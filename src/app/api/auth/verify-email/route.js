// app/api/auth/verify-email/route.js (Fixed version)
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email-service";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    console.log('Verification attempt with token:', token ? 'Token provided' : 'No token');

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("verification_token", token)
      .single();

    if (userError) {
      console.log('Database error:', userError);
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    if (!user) {
      console.log('No user found with token');
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    console.log('User found:', user.email, 'Already verified:', user.email_verified);

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json(
        { message: "Email is already verified! You can now sign in." },
        { status: 200 }
      );
    }

    // Check if token has expired
    if (user.verification_expires && new Date() > new Date(user.verification_expires)) {
      console.log('Token expired');
      return NextResponse.json(
        { error: "Verification token has expired. Please request a new verification email." },
        { status: 400 }
      );
    }

    // Verify the email
    const { error: updateError } = await supabase
      .from("users")
      .update({
        email_verified: true,
        verification_token: null,
        verification_expires: null
      })
      .eq("id", user.id);

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json(
        { error: "Failed to verify email. Please try again." },
        { status: 500 }
      );
    }

    console.log('Email verified successfully for:', user.email);

    // Send welcome email (don't fail verification if this fails)
    try {
      await sendWelcomeEmail(user.email, user.name);
      console.log('Welcome email sent successfully');
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the verification process for email issues
    }

    return NextResponse.json(
      { message: "Email verified successfully! Welcome to CMPCT!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error during email verification:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}