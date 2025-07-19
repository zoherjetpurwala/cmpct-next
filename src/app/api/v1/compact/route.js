// /app/api/v1/compact/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export async function POST(request) {
  try {
    const { longUrl, header } = await request.json();
    const accessToken = request.headers.get('Authorization')?.split(' ')[1];

    // Validate required fields
    if (!longUrl) {
      return NextResponse.json({ error: 'Long URL is required' }, { status: 400 });
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
    }

    // Get user by access token
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('access_token', accessToken)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 403 });
    }

    const currentDate = new Date();
    
    // Reset link count if needed (monthly reset)
    const linkResetDate = new Date(user.link_limit_reset_date);
    if (linkResetDate < currentDate) {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      const { error: resetError } = await supabase
        .from('users')
        .update({
          links_this_month: 0,
          link_limit_reset_date: nextMonth.toISOString()
        })
        .eq('id', user.id);
      
      if (resetError) {
        console.error('Error resetting link count:', resetError);
      } else {
        user.links_this_month = 0;
      }
    }

    // Check link limits based on tier
    let linkLimit;
    if (user.current_tier === 'free') linkLimit = 500;
    else if (user.current_tier === 'basic') linkLimit = 50000;
    else linkLimit = Infinity;

    if (user.links_this_month >= linkLimit) {
      return NextResponse.json(
        { error: `Link creation limit reached for the ${user.current_tier} tier.` },
        { status: 403 }
      );
    }

    // Reset API calls if needed (per minute reset)
    const apiCallResetPeriod = 60 * 1000; // 1 minute
    const apiResetTime = new Date(user.api_call_reset_time);
    if (currentDate.getTime() - apiResetTime.getTime() >= apiCallResetPeriod) {
      const { error: apiResetError } = await supabase
        .from('users')
        .update({
          api_calls_today: 0,
          api_call_reset_time: currentDate.toISOString()
        })
        .eq('id', user.id);
      
      if (apiResetError) {
        console.error('Error resetting API calls:', apiResetError);
      } else {
        user.api_calls_today = 0;
      }
    }

    // Check API call limits
    let apiCallLimit;
    if (user.current_tier === 'free') apiCallLimit = 10;
    else if (user.current_tier === 'basic') apiCallLimit = 1000;
    else apiCallLimit = Infinity;

    if (user.api_calls_today >= apiCallLimit) {
      return NextResponse.json(
        { error: `API call limit reached for the ${user.current_tier} tier.` },
        { status: 403 }
      );
    }

    // Generate unique short code
    let shortCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      shortCode = nanoid(5);
      
      // Check if shortCode already exists
      const { data: existingUrl, error: checkError } = await supabase
        .from('urls')
        .select('id')
        .eq('short_code', shortCode)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // No existing URL found, shortCode is unique
        isUnique = true;
      } else if (checkError) {
        console.error('Error checking shortCode uniqueness:', checkError);
        attempts++;
      } else {
        // URL exists, try again
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Unable to generate unique short code. Please try again.' },
        { status: 500 }
      );
    }

    // Create the short URL
    const { data: newUrl, error: urlError } = await supabase
      .from('urls')
      .insert({
        long_url: longUrl,
        short_code: shortCode,
        user_id: user.id,
        header: header || null,
        click_count: 0
      })
      .select()
      .single();

    if (urlError) {
      console.error('Error creating URL:', urlError);
      return NextResponse.json({ error: 'Failed to create short URL' }, { status: 500 });
    }

    // Update user counters
    const { error: updateError } = await supabase
      .from('users')
      .update({
        api_calls_today: user.api_calls_today + 1,
        links_this_month: user.links_this_month + 1
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating user counters:', updateError);
      // Don't fail the request for this
    }

    // Build the short URL
    const shortUrl = header
      ? `${process.env.NEXT_PUBLIC_DOMAIN}/${header}/${shortCode}`
      : `${process.env.NEXT_PUBLIC_DOMAIN}/${shortCode}`;

    return NextResponse.json({ 
      shortUrl,
      shortCode,
      longUrl,
      header,
      clickCount: 0,
      createdAt: newUrl.created_at
    });

  } catch (error) {
    console.error('Error in compact API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for testing
export async function GET(request) {
  return NextResponse.json({ 
    message: 'Compact API is running',
    methods: ['POST'],
    endpoint: '/api/v1/compact'
  });
}