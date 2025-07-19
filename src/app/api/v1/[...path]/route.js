import { NextResponse, userAgent } from "next/server";
import { connectToDatabase } from "@/lib/db";
import urlModel from "@/models/url.model";
import geoip from "geoip-lite";

// Helper function to get real IP address on Vercel
function getRealClientIP(request) {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  // Try different headers in order of preference
  if (cfConnectingIp) return cfConnectingIp;
  if (xRealIp) return xRealIp;
  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return xForwardedFor.split(',')[0].trim();
  }
  
  return 'Unknown';
}

export async function GET(request, { params }) {
  const { path } = params;
  
  console.log('API Route called with path:', path);
  console.log('Environment:', process.env.NODE_ENV);

  try {
    // Add connection timeout
    const dbConnection = await Promise.race([
      connectToDatabase(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 10000)
      )
    ]);

    let urlData;
    if (path.length === 2) {
      const [header, shortCode] = path;
      urlData = await urlModel.findOne({ shortCode, header });
      console.log('Searching with header and shortCode:', { header, shortCode });
    } else if (path.length === 1) {
      const [shortCode] = path;
      urlData = await urlModel.findOne({ shortCode });
      console.log('Searching with shortCode:', shortCode);
    } else {
      console.error('Invalid path length:', path.length);
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (!urlData) {
      console.log('URL not found in database');
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    const ipAddress = getRealClientIP(request);
    console.log("Detected IP address:", ipAddress);

    const agent = userAgent(request);
    const referrer = request.headers.get("referer") || "Direct";
    const screenResolution = request.headers.get("screen-resolution") || "Unknown";
    
    let geo = null;
    try {
      if (ipAddress !== 'Unknown') {
        geo = geoip.lookup(ipAddress);
      }
    } catch (geoError) {
      console.warn('Geo lookup failed:', geoError);
    }

    const visitData = {
      ipAddress: ipAddress,
      userAgent: agent.ua || 'Unknown',
      location: geo ? `${geo.city || 'Unknown'}, ${geo.region || 'Unknown'}, ${geo.country || 'Unknown'}` : "Unknown",
      device:
        agent.device?.type === "mobile"
          ? "Mobile"
          : agent.device?.type === "tablet"
          ? "Tablet"
          : "Desktop",
      os: agent.os?.name || 'Unknown',
      browser: agent.browser?.name || 'Unknown',
      referrer,
      screenResolution,
      timestamp: new Date()
    };

    // Use atomic operation to prevent race conditions
    await urlModel.findByIdAndUpdate(
      urlData._id,
      {
        $push: { visits: visitData },
        $inc: { clickCount: 1 }
      }
    );

    console.log('Successfully updated URL data');
    return NextResponse.json({ longUrl: urlData.longUrl });
    
  } catch (error) {
    console.error("Error in URL shortener API:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable'
      },
      { status: 500 }
    );
  }
}