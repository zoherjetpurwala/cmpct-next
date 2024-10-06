import { connectToDatabase } from '@/lib/db';  // Import your DB connection utility
import userModel from '@/models/user.model'; // Import your User model
import { NextResponse } from 'next/server';

// GET handler to fetch user info
export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url); // Get search parameters from the request
      const userId = searchParams.get('userId'); // Extract userId
  
      if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
      }
  
      await connectToDatabase(); // Ensure you are connected to the database
  
      const user = await userModel.findById(userId).select('-password'); // Exclude sensitive fields
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json(user, { status: 200 }); // Return user info
    } catch (error) {
      console.error('Error fetching user info:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }