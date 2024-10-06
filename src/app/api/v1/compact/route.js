import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import urlModel from '@/models/url.model';
import { nanoid } from 'nanoid';

export async function POST(request) {
  const { longUrl, header } = await request.json();

  if (!longUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  await connectToDatabase();

  const shortCode = nanoid(6); // Generate a unique short code

  try {
    const url = new urlModel({
      longUrl,
      shortCode,
      header: header || null, // Optional header
    });

    await url.save();

    const shortUrl = header
      ? `${process.env.DOMAIN}/${header}/${shortCode}`
      : `${process.env.DOMAIN}/${shortCode}`;

    return NextResponse.json({ shortUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
[]