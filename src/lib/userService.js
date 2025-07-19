import { supabase } from './supabase'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export class UserService {
  static async createUser({ email, password, name, phone }) {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Generate unique access token
    let accessToken
    let isUnique = false
    
    while (!isUnique) {
      accessToken = crypto.randomBytes(16).toString('hex')
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('access_token', accessToken)
        .single()
      isUnique = !data
    }

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        name,
        phone,
        access_token: accessToken,
        current_tier: 'free'
      })
      .select()
      .single()

    if (userError) throw userError

    // Create free tier purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: newUser.id,
        tier: 'free',
        purchase_date: new Date().toISOString(),
        expiration_date: null
      })
      .select()
      .single()

    if (purchaseError) throw purchaseError

    // Update user with purchase reference
    await supabase
      .from('users')
      .update({ current_tier_id: purchase.id })
      .eq('id', newUser.id)

    return newUser
  }

  static async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async getUserByAccessToken(accessToken) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('access_token', accessToken)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async resetLinkCountIfNeeded(userId) {
    const user = await this.getUserById(userId)
    if (!user) return null

    const currentDate = new Date()
    const resetDate = new Date(user.link_limit_reset_date)

    if (resetDate < currentDate) {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      return await this.updateUser(userId, {
        links_this_month: 0,
        link_limit_reset_date: nextMonth.toISOString()
      })
    }

    return user
  }

  static async resetApiCallsIfNeeded(userId) {
    const user = await this.getUserById(userId)
    if (!user) return null

    const currentDate = new Date()
    const resetTime = new Date(user.api_call_reset_time)
    const apiCallResetPeriod = 60 * 1000 // 1 minute

    if (currentDate.getTime() - resetTime.getTime() >= apiCallResetPeriod) {
      return await this.updateUser(userId, {
        api_calls_today: 0,
        api_call_reset_time: currentDate.toISOString()
      })
    }

    return user
  }
}