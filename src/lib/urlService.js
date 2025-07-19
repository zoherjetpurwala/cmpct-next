import { supabase } from './supabase'
import { nanoid } from 'nanoid'

export class URLService {
  static async createShortUrl({ longUrl, header, userId }) {
    const shortCode = nanoid(5)

    const { data, error } = await supabase
      .from('urls')
      .insert({
        long_url: longUrl,
        short_code: shortCode,
        user_id: userId,
        header: header || null
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUrlByShortCode(shortCode, header = null) {
    let query = supabase
      .from('urls')
      .select('*')
      .eq('short_code', shortCode)

    if (header) {
      query = query.eq('header', header)
    } else {
      query = query.is('header', null)
    }

    const { data, error } = await query.single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async getUserUrls(userId) {
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async incrementClickCount(urlId) {
    const { data, error } = await supabase
      .from('urls')
      .update({ 
        click_count: supabase.sql`click_count + 1`,
        last_accessed: new Date().toISOString()
      })
      .eq('id', urlId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async addVisit(urlId, visitData) {
    const { data, error } = await supabase
      .from('visits')
      .insert({
        url_id: urlId,
        ...visitData
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}