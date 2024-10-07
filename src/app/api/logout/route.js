import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';  // Adjust the import path as needed
import userModel from '@/models/user.model';  // Adjust the import path as needed

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Prepare the response
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0), // Setting the expiration date to the past effectively deletes the cookie
    });

    // If you have any other cookies related to the user session, clear them here
    // For example:
    // response.cookies.set('user', '', {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   path: '/',
    //   expires: new Date(0),
    // });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during logout' },
      { status: 500 }
    );
  }
}