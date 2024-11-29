import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import urlModel from '@/models/url.model';
import userModel from '@/models/user.model';
import { nanoid } from 'nanoid';

export async function POST(request) {
  const { longUrl, header } = await request.json();
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];

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

    const currentDate = new Date();
    if (user.linkLimitResetDate < currentDate) {
      user.linksThisMonth = 0;
      user.linkLimitResetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }

    let linkLimit;
    if (user.currentTier === 'free') linkLimit = 500;
    else if (user.currentTier === 'basic') linkLimit = 50000;
    else linkLimit = Infinity;

    if (user.linksThisMonth >= linkLimit) {
      return NextResponse.json(
        { error: `Link creation limit reached for the ${user.currentTier} tier.` },
        { status: 403 }
      );
    }

    const apiCallResetPeriod = 60 * 1000;
    if (currentDate - user.apiCallResetTime >= apiCallResetPeriod) {
      user.apiCallsToday = 0;
      user.apiCallResetTime = currentDate;
    }

    let apiCallLimit;
    if (user.currentTier === 'free') apiCallLimit = 10;
    else if (user.currentTier === 'basic') apiCallLimit = 1000;
    else apiCallLimit = Infinity;

    if (user.apiCallsToday >= apiCallLimit) {
      return NextResponse.json(
        { error: `API call limit reached for the ${user.currentTier} tier.` },
        { status: 403 }
      );
    }

    user.apiCallsToday += 1;
    user.linksThisMonth += 1;

    const shortCode = nanoid(5);

    const url = new urlModel({
      longUrl,
      shortCode,
      clickCount: 0,
      header: header || null,
      user: user._id,
    });

    await url.save();
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

export async function GET(request) {
  //console.log("Request received");

  const { searchParams } = new URL(request.url);
  const shortCode = searchParams.get('shortCode');
  const header = searchParams.get('header');

  //console.log("shortCode:", shortCode);
  //console.log("header:", header);

  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
  }

  
  try {
    await connectToDatabase();

    const user = await userModel.findOne({ accessToken });
    if (!user) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 403 });
    }

    let urlData;
    if (!shortCode) {
      return NextResponse.json({ error: "shortCode is required" }, { status: 400 });
    }

    if (header) {
      urlData = await urlModel.findOne({ shortCode, header, user: user._id });
    } else {
      urlData = await urlModel.findOne({ shortCode, user: user._id });
    }

    if (!urlData) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    const visit = {
      timestamp: new Date(),
    };

    urlData.clickCount += 1;
    urlData.visits.push(visit);
    await urlData.save();

    return NextResponse.json({ longUrl: urlData.longUrl });
  } catch (error) {
    console.error("Error in URL shortener API:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}