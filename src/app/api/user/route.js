import { connectToDatabase } from '@/lib/db';  // Import your DB connection utility
import userModel from '@/models/user.model'; // Import your User model
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // For verifying the JWT
import { cookies } from 'next/headers'; // To access cookies in Next.js

// GET handler to fetch user info
export async function GET(req) {
  try {
    // Access the cookies from the request
    const cookieStore = cookies();
    const token = cookieStore.get('token'); // Assume JWT is stored in a cookie named 'token'

    if (!token) {
      return NextResponse.json({ message: 'Authentication token not found' }, { status: 401 });
    }

    // Verify the JWT and decode the payload
    const secretKey = process.env.JWT_SECRET; // Your JWT secret key
    let decodedToken;
    try {
      decodedToken = jwt.verify(token.value, secretKey);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // Extract user ID from the decoded token
    const userId = decodedToken?.id;
    if (!userId) {
      return NextResponse.json({ message: 'User ID not found in token' }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Fetch the user from the database by their ID, excluding sensitive fields
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the user data (excluding sensitive fields)
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
