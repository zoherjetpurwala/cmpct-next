import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendVerificationEmail } from "@/lib/email-service";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    // Basic input validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email_verified")
      .eq("email", email)
      .single();

    if (existingUser) {
      if (existingUser.email_verified) {
        return NextResponse.json(
          { error: "This email is already registered and verified" },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: "This email is already registered but not verified. Please check your email for verification link." },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique access token
    let accessToken;
    let isUnique = false;

    while (!isUnique) {
      accessToken = crypto.randomBytes(16).toString("hex");
      const { data: existingToken } = await supabase
        .from("users")
        .select("id")
        .eq("access_token", accessToken)
        .single();
      isUnique = !existingToken;
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user (not verified initially)
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        name,
        access_token: accessToken,
        current_tier: "free",
        api_calls_today: 0,
        link_count: 0,
        links_this_month: 0,
        email_verified: false,
        verification_token: verificationToken,
        verification_expires: verificationExpiry.toISOString()
      })
      .select()
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    // Create free tier purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        user_id: newUser.id,
        tier: "free",
        purchase_date: new Date().toISOString(),
        expiration_date: null
      })
      .select()
      .single();

    if (purchaseError) {
      throw new Error(purchaseError.message);
    }

    // Update user with purchase reference
    const { error: updateError } = await supabase
      .from("users")
      .update({ current_tier_id: purchase.id })
      .eq("id", newUser.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
    
    const emailResult = await sendVerificationEmail(email, name, verificationUrl);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Don't fail the signup if email fails - user can request resend
    }

    return NextResponse.json(
      { 
        message: "User created successfully. Please check your email to verify your account.",
        requiresVerification: true 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}