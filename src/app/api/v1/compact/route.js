import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import urlModel from '@/models/url.model';
import userModel from '@/models/user.model';
import { nanoid } from 'nanoid';

export async function POST(request) {
  const { longUrl, header } = await request.json();
  const accessToken = request.headers.get('Authorization')?.split(' ')[1]; // Extract access token from Authorization header

  if (!longUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
  }

  await connectToDatabase();

  try {
    // Fetch the user based on access token
    const user = await userModel.findOne({ accessToken });
    if (!user) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 403 });
    }

    // Check if the user is on the free plan and has exceeded their limit
    if (user.currentTier === 'free') {
      if (user.linkCount >= 10) {
        return NextResponse.json(
          { error: 'Free plan limit reached. Upgrade your plan to create more links.' },
          { status: 403 }
        );
      }

      // Check the API call count for the day
      if (user.apiCallsToday >= 10) {
        return NextResponse.json(
          { error: 'API call limit reached for the day. Upgrade your plan for more API calls.' },
          { status: 403 }
        );
      }

      // Increment the user's API call count
      user.apiCallsToday += 1;
    }

    const shortCode = nanoid(6); // Generate a unique short code

    const url = new urlModel({
      longUrl,
      shortCode,
      header: header || null, // Optional header
      user: user._id // Link the URL to the user
    });

    await url.save();

    user.linkCount += 1;
    await user.save();

    const shortUrl = header
      ? `${process.env.NEXT_PUBLIC_DOMAIN}/${header}/${shortCode}`
      : `${process.env.NEXT_PUBLIC_DOMAIN}/${shortCode}`;

    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
