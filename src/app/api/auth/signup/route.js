import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { email, password, name, phone } = await req.json();

    // Basic input validation
    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "Phone must be a 10-digit number" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 400 }
      );
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

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        name,
        phone,
        access_token: accessToken,
        current_tier: "free",
        api_calls_today: 0,
        link_count: 0,
        links_this_month: 0
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

    return NextResponse.json(
      { message: "User created successfully" },
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