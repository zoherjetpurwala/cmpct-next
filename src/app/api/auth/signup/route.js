// app/api/auth/signup/route.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";
import userModel from "@/models/user.model"; // Adjust the path as needed
import purchaseModel from "@/models/purchase.model"; // Adjust the path as needed
import { connectToDatabase } from "@/lib/db";

export async function POST(req) {
  await connectToDatabase();

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

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique access token
    let accessToken;
    let isUnique = false;

    while (!isUnique) {
      accessToken = crypto.randomBytes(16).toString("hex");
      const existingToken = await userModel.findOne({ accessToken });
      isUnique = !existingToken;
    }

    // Create a new user and save it using .create()
    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      name,
      phone,
      accessToken,
      linkCount: 0, // Initialize link count for free tier
      apiCallsToday: 0, // Initialize API call count for free tier
    });

    // Create a new purchase entry for the free plan using .create()
    const purchase = await purchaseModel.create({
      userId: newUser._id,
      tier: "free", // Set to free tier
      purchaseDate: Date.now(),
      expirationDate: null, // Set expiration date to null for free tier
    });

    // Link the current tier to the user and save it
    newUser.currentTierId = purchase._id;
    await newUser.save(); // Save the updated user with the current tier

    return NextResponse.json(
      { message: "User created successfully", accessToken },
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
