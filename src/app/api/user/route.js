import { connectToDatabase } from '@/lib/db';
import userModel from '@/models/user.model';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Authentication token not found' }, { status: 401 });
    }

    const secretKey = process.env.JWT_SECRET;
    let decodedToken;
    try {
      decodedToken = jwt.verify(token.value, secretKey);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = decodedToken?.id;
    if (!userId) {
      return NextResponse.json({ message: 'User ID not found in token' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await userModel.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
