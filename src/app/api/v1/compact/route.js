import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import urlModel from '@/models/url.model';
import userModel from '@/models/user.model';
import { nanoid } from 'nanoid';

export async function POST(request) {
  const { longUrl, header } = await request.json();
  const accessToken = request.headers.get('Authorization')?.split(' ')[1]; // Extract access token from Authorization header

  if (!longUrl) {
    return NextResponse.json({ error: 'Long URL is required' }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const user = await userModel.findOne({ accessToken });
    if (!user) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 403 });
    }

    // Check user's free tier limits
    if (user.currentTier === 'free') {
      if (user.linkCount >= 10) {
        return NextResponse.json(
          { error: 'Free plan limit reached. Upgrade your plan to create more links.' },
          { status: 403 }
        );
      }

      if (user.apiCallsToday >= 10) {
        return NextResponse.json(
          { error: 'API call limit reached for the day. Upgrade your plan for more API calls.' },
          { status: 403 }
        );
      }

      // Increment the user's API call count
      user.apiCallsToday += 1;
    }

    // Generate a unique short code for the URL
    const shortCode = nanoid(5);

    // Create the new URL document with initial values
    const url = new urlModel({
      longUrl,
      shortCode,
      clickCount: 0, // Initialize click count
      header: header || null, // Optional header
      user: user._id, // Link the URL to the user
    });

    // Save the new URL document
    await url.save();

    // Increment the user's link count
    user.linkCount += 1;
    await user.save();

    // Construct the short URL based on whether a header is present
    const shortUrl = header
      ? `${process.env.NEXT_PUBLIC_DOMAIN}/${header}/${shortCode}`
      : `${process.env.NEXT_PUBLIC_DOMAIN}/${shortCode}`;

    // Return the short URL
    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
