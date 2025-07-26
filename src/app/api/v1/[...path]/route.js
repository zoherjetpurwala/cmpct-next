// app/api/v1/[...path]/route.js
import { NextResponse } from "next/server";

export async function GET(request, props) {
  const params = await props.params;
  try {
    console.log('=== Enhanced Analytics API Route Start ===');
    console.log('Params:', params);
    console.log('Environment:', process.env.NODE_ENV);
    
    // Import modules
    let supabase, userAgent;
    
    try {
      const supabaseModule = await import("@/lib/supabase");
      supabase = supabaseModule.supabase;
      console.log('✓ Supabase client imported');
    } catch (dbError) {
      console.error('✗ Supabase client import failed:', dbError);
      return NextResponse.json(
        { error: "Database client import failed", details: dbError.message },
        { status: 500 }
      );
    }
    
    try {
      const nextServerModule = await import("next/server");
      userAgent = nextServerModule.userAgent;
      console.log('✓ Next.js server utilities imported');
    } catch (nextError) {
      console.error('✗ Next.js server import failed:', nextError);
      return NextResponse.json(
        { error: "Next.js server import failed", details: nextError.message },
        { status: 500 }
      );
    }
    
    // Validate params
    const { path } = params;
    if (!path || !Array.isArray(path)) {
      console.error('✗ Invalid path parameter:', path);
      return NextResponse.json(
        { error: "Invalid path parameter" },
        { status: 400 }
      );
    }
    
    console.log('Processing path:', path);
    
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('✗ Supabase configuration missing');
      return NextResponse.json(
        { error: "Database configuration missing" },
        { status: 500 }
      );
    }
    console.log('✓ Supabase configuration exists');
    
    // Query the database for URL
    let urlData;
    try {
      if (path.length === 2) {
        const [header, shortCode] = path;
        console.log('Searching with header and shortCode:', { header, shortCode });
        
        const { data, error } = await supabase
          .from('urls')
          .select('*')
          .eq('short_code', shortCode)
          .eq('header', header)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error;
        urlData = data;
        
      } else if (path.length === 1) {
        const [shortCode] = path;
        console.log('Searching with shortCode:', shortCode);
        
        const { data, error } = await supabase
          .from('urls')
          .select('*')
          .eq('short_code', shortCode)
          .is('header', null)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error;
        urlData = data;
        
      } else {
        console.error('✗ Invalid URL format, path length:', path.length);
        return NextResponse.json(
          { error: "Invalid URL format" },
          { status: 400 }
        );
      }
      console.log('Database query completed, found:', !!urlData);
    } catch (queryError) {
      console.error('✗ Database query failed:', queryError);
      return NextResponse.json(
        { error: "Database query failed", details: queryError.message },
        { status: 500 }
      );
    }
    
    if (!urlData) {
      console.log('✗ URL not found in database');
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }
    
    console.log('✓ URL found, processing enhanced analytics...');
    
    // === ENHANCED ANALYTICS COLLECTION WITH GEOJS ===
    
    // 1. BASIC REQUEST DATA
    const headers = request.headers;
    const url = new URL(request.url);
    
    // 2. IP AND GEOLOCATION WITH GEOJS
    const rawIP = headers.get("x-forwarded-for")?.split(',')[0]?.trim() ||
                 headers.get("x-real-ip") ||
                 headers.get("cf-connecting-ip") ||
                 headers.get("x-client-ip") ||
                 "Unknown";
    
    console.log('Raw IP received:', rawIP);
    
    // Clean IP address (handle IPv6 mapped IPv4)
    let ipAddress = rawIP;
    if (ipAddress.startsWith('::ffff:')) {
      ipAddress = ipAddress.replace('::ffff:', '');
      console.log('Cleaned IPv6-mapped IP:', ipAddress);
    }
    
    // GeoJS location lookup function
    async function getLocationFromGeoJS(ip) {
      // Check if IP is local/private
      const isLocal = ip === '::1' || 
                     ip === '127.0.0.1' || 
                     ip.startsWith('192.168.') ||
                     ip.startsWith('10.') ||
                     ip.startsWith('172.16.') ||
                     ip === 'localhost' ||
                     ip === 'Unknown';
      
      if (isLocal) {
        console.log('⚠️ Skipping geo lookup for local IP:', ip);
        return null;
      }
      
      try {
        console.log('🌍 Attempting GeoJS lookup for IP:', ip);
        
        const response = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`, {
          headers: {
            'User-Agent': 'URL-Shortener/1.0'
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
          console.error('GeoJS HTTP error:', response.status, response.statusText);
          return null;
        }
        
        const data = await response.json();
        console.log('GeoJS raw response:', data);
        
        // Validate response
        if (!data || data.error) {
          console.warn('GeoJS returned error or empty data:', data);
          return null;
        }
        
        const locationData = {
          country: data.country || 'Unknown',
          countryCode: data.country_code || 'UN',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          latitude: data.latitude ? parseFloat(data.latitude) : null,
          longitude: data.longitude ? parseFloat(data.longitude) : null,
          timezone: data.timezone || 'Unknown',
          postalCode: 'Unknown', // GeoJS doesn't provide postal codes
          accuracy: 'geojs',
          provider: 'geojs.io',
          isLocal: false
        };
        
        console.log('✅ GeoJS lookup successful:', {
          country: locationData.country,
          region: locationData.region,
          city: locationData.city,
          timezone: locationData.timezone
        });
        
        return locationData;
        
      } catch (error) {
        console.error('❌ GeoJS lookup failed:', error.message);
        return null;
      }
    }
    
    // Get location data
    const geo = await getLocationFromGeoJS(ipAddress);
    
    // Fallback to Cloudflare headers if available
    let locationData;
    if (!geo) {
      const cfCountry = headers.get('cf-ipcountry');
      if (cfCountry && cfCountry !== 'XX') {
        console.log('📍 Using Cloudflare location fallback');
        locationData = {
          country: cfCountry,
          countryCode: cfCountry,
          region: headers.get('cf-region') || 'Unknown',
          city: headers.get('cf-ipcity') || 'Unknown',
          latitude: null,
          longitude: null,
          timezone: headers.get('cf-timezone') || 'Unknown',
          postalCode: 'Unknown',
          accuracy: 'cloudflare',
          provider: 'cloudflare',
          isLocal: false
        };
      } else {
        console.log('⚠️ No geo data available, using unknown');
        locationData = {
          country: 'Unknown',
          countryCode: 'UN',
          region: 'Unknown',
          city: 'Unknown',
          latitude: null,
          longitude: null,
          timezone: 'Unknown',
          postalCode: 'Unknown',
          accuracy: 'unknown',
          provider: 'none',
          isLocal: ipAddress === '127.0.0.1' || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')
        };
      }
    } else {
      locationData = geo;
    }
    
    // Add IP info to location data
    locationData.rawIP = rawIP;
    locationData.cleanIP = ipAddress;
    
    console.log('Final location data:', locationData);
    
    // 3. USER AGENT ANALYSIS
    let agent;
    try {
      agent = userAgent(request);
    } catch (uaError) {
      console.warn('⚠ User agent parsing failed:', uaError);
      agent = { ua: 'Unknown', device: {}, os: {}, browser: {} };
    }
    
    // Enhanced device detection
    const deviceInfo = {
      type: agent.device?.type || 'desktop',
      vendor: agent.device?.vendor || 'Unknown',
      model: agent.device?.model || 'Unknown',
      isBot: agent.isBot || false,
      isMobile: agent.device?.type === 'mobile',
      isTablet: agent.device?.type === 'tablet',
      isDesktop: !agent.device?.type || agent.device?.type === 'desktop'
    };
    
    // Browser details
    const browserInfo = {
      name: agent.browser?.name || 'Unknown',
      version: agent.browser?.version || 'Unknown',
      major: agent.browser?.version?.split('.')[0] || 'Unknown'
    };
    
    // Operating System details
    const osInfo = {
      name: agent.os?.name || 'Unknown',
      version: agent.os?.version || 'Unknown',
      platform: agent.os?.name?.toLowerCase().includes('windows') ? 'Windows' :
                agent.os?.name?.toLowerCase().includes('mac') ? 'macOS' :
                agent.os?.name?.toLowerCase().includes('linux') ? 'Linux' :
                agent.os?.name?.toLowerCase().includes('android') ? 'Android' :
                agent.os?.name?.toLowerCase().includes('ios') ? 'iOS' : 'Other'
    };
    
    // 4. REFERRER ANALYSIS
    const referrer = headers.get("referer") || headers.get("referrer") || "Direct";
    let referrerInfo = {
      raw: referrer,
      domain: 'Direct',
      source: 'Direct',
      medium: 'Direct',
      campaign: null,
      isSearchEngine: false,
      isSocialMedia: false,
      isEmail: false
    };
    
    if (referrer && referrer !== "Direct") {
      try {
        const referrerUrl = new URL(referrer);
        referrerInfo.domain = referrerUrl.hostname;
        
        // Detect source type
        const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu'];
        const socialPlatforms = ['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok', 'youtube', 'pinterest'];
        const emailPlatforms = ['gmail', 'outlook', 'mail', 'email'];
        
        if (searchEngines.some(engine => referrerInfo.domain.includes(engine))) {
          referrerInfo.source = 'Search Engine';
          referrerInfo.isSearchEngine = true;
        } else if (socialPlatforms.some(platform => referrerInfo.domain.includes(platform))) {
          referrerInfo.source = 'Social Media';
          referrerInfo.isSocialMedia = true;
        } else if (emailPlatforms.some(platform => referrerInfo.domain.includes(platform))) {
          referrerInfo.source = 'Email';
          referrerInfo.isEmail = true;
        } else {
          referrerInfo.source = 'Website';
        }
        
        // Extract UTM parameters if available
        const utmSource = referrerUrl.searchParams.get('utm_source');
        const utmMedium = referrerUrl.searchParams.get('utm_medium');
        const utmCampaign = referrerUrl.searchParams.get('utm_campaign');
        
        if (utmSource) referrerInfo.source = utmSource;
        if (utmMedium) referrerInfo.medium = utmMedium;
        if (utmCampaign) referrerInfo.campaign = utmCampaign;
        
      } catch (refError) {
        console.warn('⚠ Referrer parsing failed:', refError);
      }
    }
    
    // 5. TIMING AND SESSION DATA
    const now = new Date();
    const timeInfo = {
      timestamp: now,
      iso: now.toISOString(),
      unix: Math.floor(now.getTime() / 1000),
      hour: now.getHours(),
      dayOfWeek: now.getDay(), // 0 = Sunday
      dayOfMonth: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      timezone: locationData.timezone || 'Unknown'
    };
    
    // 6. TECHNICAL DATA
    const technicalInfo = {
      userAgent: agent.ua || 'Unknown',
      language: headers.get("accept-language")?.split(',')[0] || 'Unknown',
      encoding: headers.get("accept-encoding") || 'Unknown',
      connection: headers.get("connection") || 'Unknown',
      protocol: url.protocol || 'https:',
      method: 'GET',
      screenResolution: headers.get("screen-resolution") || 'Unknown',
      colorDepth: headers.get("color-depth") || 'Unknown',
      pixelRatio: headers.get("pixel-ratio") || 'Unknown',
      viewport: headers.get("viewport") || 'Unknown'
    };
    
    // 7. SECURITY AND PRIVACY
    const securityInfo = {
      dnt: headers.get("dnt") === '1', // Do Not Track
      secFetchDest: headers.get("sec-fetch-dest") || 'Unknown',
      secFetchMode: headers.get("sec-fetch-mode") || 'Unknown',
      secFetchSite: headers.get("sec-fetch-site") || 'Unknown',
      secFetchUser: headers.get("sec-fetch-user") || 'Unknown'
    };
    
    // 8. PERFORMANCE DATA
    const performanceInfo = {
      loadTime: headers.get("page-load-time") || null,
      networkType: headers.get("network-type") || 'Unknown',
      effectiveType: headers.get("effective-connection-type") || 'Unknown',
      downlink: headers.get("downlink") || null,
      rtt: headers.get("rtt") || null
    };
    
    // 9. CONSTRUCT COMPREHENSIVE VISIT DATA FOR SUPABASE
    const enhancedVisitData = {
      url_id: urlData.id,
      timestamp: timeInfo.iso,
      ip_address: ipAddress !== 'Unknown' ? ipAddress : null,
      user_agent: agent.ua || 'Unknown',
      
      // Store complex data as JSONB
      location: locationData,
      device: deviceInfo,
      browser: browserInfo,
      os: osInfo,
      referrer: referrerInfo,
      technical: technicalInfo,
      security: securityInfo,
      performance: performanceInfo,
      time_info: timeInfo,
      
      session_id: headers.get("session-id") || null,
      
      custom_data: {
        userId: headers.get("user-id") || null,
        experimentId: headers.get("experiment-id") || null,
        variant: headers.get("variant") || null,
        source: headers.get("tracking-source") || null,
        medium: headers.get("tracking-medium") || null,
        campaign: headers.get("tracking-campaign") || null,
        content: headers.get("tracking-content") || null,
        term: headers.get("tracking-term") || null
      }
    };
    
    console.log('Enhanced visit data prepared for Supabase');
    
    // Update URL data with enhanced analytics using Supabase
    try {
      // Insert visit record
      const { error: visitError } = await supabase
        .from('visits')
        .insert(enhancedVisitData);
      
      if (visitError) {
        console.warn('⚠ Failed to insert visit data:', visitError);
      } else {
        console.log('✓ Visit data inserted successfully');
      }
      
      // Update URL click count and last accessed
      const { error: updateError } = await supabase
        .from('urls')
        .update({
          click_count: urlData.click_count + 1,
          last_accessed: now.toISOString()
        })
        .eq('id', urlData.id);
      
      if (updateError) {
        console.warn('⚠ Failed to update URL analytics:', updateError);
      } else {
        console.log('✓ URL analytics updated successfully');
      }
      
    } catch (updateError) {
      console.warn('⚠ Failed to update enhanced analytics (non-critical):', updateError);
    }
    
    console.log('=== Enhanced Analytics API Route Success ===');
    console.log('Returning longUrl:', urlData.long_url);
    
    return NextResponse.json({ longUrl: urlData.long_url });
    
  } catch (error) {
    console.error('=== Enhanced Analytics API Route Fatal Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}