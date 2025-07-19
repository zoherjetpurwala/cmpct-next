import { NextResponse } from "next/server";

// Wrap everything in try-catch to ensure we always return JSON
export async function GET(request, { params }) {
  try {
    console.log('=== API Route Start ===');
    console.log('Params:', params);
    console.log('Environment:', process.env.NODE_ENV);
    
    // Check if required modules can be imported
    let connectToDatabase, urlModel, userAgent, geoip;
    
    try {
      const dbModule = await import("@/lib/db");
      connectToDatabase = dbModule.connectToDatabase;
      console.log('✓ Database module imported');
    } catch (dbError) {
      console.error('✗ Database module import failed:', dbError);
      return NextResponse.json(
        { error: "Database module import failed", details: dbError.message },
        { status: 500 }
      );
    }
    
    try {
      const urlModelModule = await import("@/models/url.model");
      urlModel = urlModelModule.default;
      console.log('✓ URL model imported');
    } catch (modelError) {
      console.error('✗ URL model import failed:', modelError);
      return NextResponse.json(
        { error: "URL model import failed", details: modelError.message },
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
    
    try {
      geoip = await import("geoip-lite");
      console.log('✓ GeoIP imported');
    } catch (geoError) {
      console.warn('⚠ GeoIP import failed (non-critical):', geoError);
      geoip = { lookup: () => null }; // Fallback
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
    if (!process.env.MONGODB_URI) {
      console.error('✗ MONGODB_URI not found');
      return NextResponse.json(
        { error: "Database configuration missing" },
        { status: 500 }
      );
    }
    console.log('✓ MONGODB_URI exists');
    
    // Try to connect to database
    console.log('Attempting database connection...');
    try {
      await connectToDatabase();
      console.log('✓ Database connected');
    } catch (dbError) {
      console.error('✗ Database connection failed:', dbError);
      return NextResponse.json(
        { error: "Database connection failed", details: dbError.message },
        { status: 500 }
      );
    }
    
    // Query the database
    let urlData;
    try {
      if (path.length === 2) {
        const [header, shortCode] = path;
        console.log('Searching with header and shortCode:', { header, shortCode });
        urlData = await urlModel.findOne({ shortCode, header });
      } else if (path.length === 1) {
        const [shortCode] = path;
        console.log('Searching with shortCode:', shortCode);
        urlData = await urlModel.findOne({ shortCode });
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
    
    console.log('✓ URL found, processing analytics...');
    
    // Get IP address
    const ipAddress = request.headers.get("x-forwarded-for")?.split(',')[0]?.trim() ||
                     request.headers.get("x-real-ip") ||
                     request.headers.get("cf-connecting-ip") ||
                     "Unknown";
    console.log("IP address:", ipAddress);
    
    // Get user agent
    let agent;
    try {
      agent = userAgent(request);
      console.log('✓ User agent parsed');
    } catch (uaError) {
      console.warn('⚠ User agent parsing failed:', uaError);
      agent = { ua: 'Unknown', device: {}, os: {}, browser: {} };
    }
    
    // Get geo info
    let geo = null;
    try {
      if (ipAddress !== 'Unknown' && geoip.default) {
        geo = geoip.default.lookup(ipAddress);
      }
      console.log('✓ Geo lookup completed');
    } catch (geoError) {
      console.warn('⚠ Geo lookup failed:', geoError);
    }
    
    const referrer = request.headers.get("referer") || "Direct";
    const screenResolution = request.headers.get("screen-resolution") || "Unknown";
    
    const visitData = {
      ipAddress: ipAddress,
      userAgent: agent.ua || 'Unknown',
      location: geo ? `${geo.city || 'Unknown'}, ${geo.region || 'Unknown'}, ${geo.country || 'Unknown'}` : "Unknown",
      device: agent.device?.type === "mobile" ? "Mobile" : 
              agent.device?.type === "tablet" ? "Tablet" : "Desktop",
      os: agent.os?.name || 'Unknown',
      browser: agent.browser?.name || 'Unknown',
      referrer,
      screenResolution,
      timestamp: new Date()
    };
    
    console.log('Visit data prepared:', visitData);
    
    // Update URL data
    try {
      await urlModel.findByIdAndUpdate(
        urlData._id,
        {
          $push: { visits: visitData },
          $inc: { clickCount: 1 }
        }
      );
      console.log('✓ URL data updated successfully');
    } catch (updateError) {
      console.warn('⚠ Failed to update analytics (non-critical):', updateError);
      // Don't fail the redirect for analytics issues
    }
    
    console.log('=== API Route Success ===');
    console.log('Returning longUrl:', urlData.longUrl);
    
    return NextResponse.json({ longUrl: urlData.longUrl });
    
  } catch (error) {
    console.error('=== API Route Fatal Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    // Always return JSON, never let it fall through to HTML error page
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