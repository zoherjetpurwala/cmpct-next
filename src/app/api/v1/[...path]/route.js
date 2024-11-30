import { NextResponse, userAgent } from "next/server";
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
    console.log("ipAddress  " + ipAddress);

    const agent = userAgent(request);
    console.log(agent);

    const referrer = request.headers.get("referer") || "Direct";
    const geo = geoip.lookup(ipAddress);

    const visitData = {
      ipAddress: ipAddress,
      userAgent: agent.ua,
      location: geo ? `${geo.city}, ${geo.region}, ${geo.country}` : "Unknown",
      device:
        agent.device.type === "mobile"
          ? "Mobile"
          : agent.device.type === "tablet"
          ? "Tablet"
          : "Desktop",
      os: agent.os.name,
      browser: agent.browser.name,
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