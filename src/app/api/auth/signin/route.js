import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { z } from "zod";
import { NextResponse } from "next/server";
import userModel from "@/models/user.model"; // Adjust the path as needed
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";

// Zod schema for validation
const signinSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Validate input with Zod
    const parsedResult = signinSchema.safeParse(body);
    if (!parsedResult.success) {
      return NextResponse.json(
        { errors: parsedResult.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = parsedResult.data;

    // Find user in the database by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare hashed password with the entered one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Ensure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    // Generate a JWT token with the user ID and optional additional claims
    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        // Add any additional non-sensitive claims here
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Return the JWT token in the response
    return NextResponse.json(
      {
        message: "Sign in successful",
        jwtToken,
        user: {
          id: user._id,
          email: user.email,
          // Add any other non-sensitive user data here
        },
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${jwtToken}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; ${
            process.env.NODE_ENV === "production" ? "Secure" : ""
          }`,
        },
      }
    );
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
