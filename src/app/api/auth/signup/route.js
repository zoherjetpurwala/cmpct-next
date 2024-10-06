// app/api/auth/signup/route.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import userModel from '@/models/user.model'; // Adjust the path as needed

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI); // Ensure your MongoDB URI is set in .env
};

// Zod schema for validation
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  // Validate input
  const parsedResult = signupSchema.safeParse(body);
  if (!parsedResult.success) {
    return NextResponse.json({ errors: parsedResult.error.errors }, { status: 400 });
  }

  const { email, password } = parsedResult.data;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Generate a unique access token
  const accessToken = crypto.randomBytes(16).toString('hex');

  const newUser = new userModel({
    email,
    password: hashedPassword,
    accessToken,
  });

  await newUser.save();

  return NextResponse.json({ message: 'User created successfully', accessToken }, { status: 201 });
}
