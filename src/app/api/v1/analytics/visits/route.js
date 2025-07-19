import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET endpoint - Fetch all analytics for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    
    const accessToken = request.headers.get('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
    }

    // Verify user access token
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('access_token', accessToken)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 403 });
    }

    // Calculate date range
    const now = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    try {
      // Get all user's URLs
      const { data: urls, error: urlsError } = await supabase
        .from('urls')
        .select('id, short_code, header, long_url, click_count, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (urlsError) {
        throw new Error(`Error fetching URLs: ${urlsError.message}`);
      }

      if (!urls || urls.length === 0) {
        return NextResponse.json({
          totalClicks: 0,
          uniqueVisitors: 0,
          avgClicksPerDay: 0,
          urls: [],
          visits: [],
          timeRange,
          dateRange: {
            start: startDate.toISOString(),
            end: now.toISOString()
          }
        });
      }

      // Get all visits for user's URLs within the time range
      const urlIds = urls.map(url => url.id);
      
      const { data: allVisits, error: visitsError } = await supabase
        .from('visits')
        .select('*')
        .in('url_id', urlIds)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      if (visitsError) {
        console.warn('Error fetching visits:', visitsError);
        // Continue without visits data
      }

      // Calculate summary statistics
      const visits = allVisits || [];
      const totalClicks = urls.reduce((sum, url) => sum + (url.click_count || 0), 0);
      const uniqueIPs = new Set(visits.map(visit => visit.ip_address).filter(Boolean));
      const uniqueVisitors = uniqueIPs.size;

      // Group visits by URL for easier processing
      const visitsByUrl = {};
      visits.forEach(visit => {
        if (!visitsByUrl[visit.url_id]) {
          visitsByUrl[visit.url_id] = [];
        }
        visitsByUrl[visit.url_id].push(visit);
      });

      // Enhance URLs with their visit data
      const enhancedUrls = urls.map(url => ({
        ...url,
        visits: visitsByUrl[url.id] || []
      }));

      return NextResponse.json({
        totalClicks,
        uniqueVisitors,
        avgClicksPerDay: Math.round(totalClicks / days),
        urls: enhancedUrls,
        visits: visits,
        timeRange,
        dateRange: {
          start: startDate.toISOString(),
          end: now.toISOString()
        }
      });

    } catch (error) {
      console.error('Error processing analytics:', error);
      return NextResponse.json(
        { error: 'Error processing analytics', details: error.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in analytics GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST endpoint - Fetch analytics for a specific URL
export async function POST(request) {
  try {
    const { urlId, timeRange, shortCode, header } = await request.json();
    const accessToken = request.headers.get('Authorization')?.split(' ')[1];

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
    }

    // Verify user access token
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('access_token', accessToken)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 403 });
    }

    // Calculate date range
    const now = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    let urlData = null;
    let visits = [];

    try {
      if (urlId) {
        // Fetch specific URL data by ID
        const { data: url, error: urlError } = await supabase
          .from('urls')
          .select('*')
          .eq('id', urlId)
          .eq('user_id', user.id)
          .single();

        if (urlError) {
          console.error('Error fetching URL:', urlError);
          return NextResponse.json({ 
            visits: [], 
            urlData: { id: urlId, click_count: 0 } 
          });
        }

        urlData = url;

        // Fetch visits for this specific URL
        const { data: urlVisits, error: visitsError } = await supabase
          .from('visits')
          .select('*')
          .eq('url_id', urlId)
          .gte('timestamp', startDate.toISOString())
          .order('timestamp', { ascending: false });

        if (visitsError) {
          console.error('Error fetching visits:', visitsError);
        } else {
          visits = urlVisits || [];
        }

      } else if (shortCode) {
        // Find URL by shortCode and optional header
        let query = supabase
          .from('urls')
          .select('*')
          .eq('short_code', shortCode)
          .eq('user_id', user.id);

        if (header) {
          query = query.eq('header', header);
        } else {
          query = query.is('header', null);
        }

        const { data: url, error: urlError } = await query.single();

        if (urlError) {
          console.error('Error fetching URL by shortCode:', urlError);
          return NextResponse.json({ 
            visits: [], 
            urlData: { click_count: 0 } 
          });
        }

        urlData = url;

        // Fetch visits for this URL
        const { data: urlVisits, error: visitsError } = await supabase
          .from('visits')
          .select('*')
          .eq('url_id', url.id)
          .gte('timestamp', startDate.toISOString())
          .order('timestamp', { ascending: false });

        if (visitsError) {
          console.error('Error fetching visits:', visitsError);
        } else {
          visits = urlVisits || [];
        }
      } else {
        // No specific URL requested - return empty data
        return NextResponse.json({
          visits: [],
          urlData: { click_count: 0 }
        });
      }

      return NextResponse.json({
        visits: visits,
        urlData: urlData || { click_count: 0 },
        timeRange,
        dateRange: {
          start: startDate.toISOString(),
          end: now.toISOString()
        }
      });

    } catch (error) {
      console.error('Error processing specific URL analytics:', error);
      return NextResponse.json(
        { error: 'Error processing URL analytics', details: error.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in analytics POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}