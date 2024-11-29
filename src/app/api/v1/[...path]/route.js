import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import urlModel from "@/models/url.model";
import geoip from "geoip-lite";

export async function GET(request, { params }) {
  const { path } = params;

  try {
    await connectToDatabase();

    let urlData;
    if (path.length === 2) {
      const [header, shortCode] = path;
      urlData = await urlModel.findOne({ shortCode, header });
    } else if (path.length === 1) {
      const [shortCode] = path;
      urlData = await urlModel.findOne({ shortCode });
    } else {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (!urlData) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    const ipAddress = request.headers.get("x-real-client-ip") || "IP not found";
    console.log(ipAddress);

    const userAgent = request.headers.get("user-agent");
    const referrer = request.headers.get("referer") || "Direct";
    const geo = geoip.lookup(ipAddress);

    const visitData = {
      ipAddress,
      userAgent,
      location: geo ? `${geo.city}, ${geo.region}, ${geo.country}` : "Unknown",
      device: getDeviceType(userAgent),
      os: getOperatingSystem(userAgent),
      browser: getBrowser(userAgent),
      referrer,
      screenResolution: "Unknown",
    };

    urlData.visits.push(visitData);

    urlData.clickCount += 1;
    await urlData.save();

    return NextResponse.json({ longUrl: urlData.longUrl });
  } catch (error) {
    console.error("Error in URL shortener API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Utility functions to extract device, OS, and browser information
function getDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet/i.test(userAgent)) return "Tablet";
  return "Desktop";
}

function getOperatingSystem(userAgent) {
  if (/windows/i.test(userAgent)) return "Windows";
  if (/macintosh|mac os x/i.test(userAgent)) return "Mac OS";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  return "Unknown";
}

function getBrowser(userAgent) {
  if (/chrome/i.test(userAgent)) return "Chrome";
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
  if (/firefox/i.test(userAgent)) return "Firefox";
  if (/msie|trident/i.test(userAgent)) return "Internet Explorer";
  return "Unknown";
}
