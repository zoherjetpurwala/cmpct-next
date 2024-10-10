import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import urlModel from "@/models/url.model";
import userModel from "@/models/user.model";

export async function GET(request, { params }) {
  console.log("Request received");
  const { path } = params;
  console.log("Incoming Path:", path);
  
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    
    // Validate the user by access token
    const user = await userModel.findOne({ accessToken });
    if (!user) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 403 });
    }

    let urlData;
    if (path.length === 2) {
      const [header, shortCode] = path;
      urlData = await urlModel.findOne({ shortCode, header, user: user._id });
    } else if (path.length === 1) {
      const [shortCode] = path;
      urlData = await urlModel.findOne({ shortCode, user: user._id });
    } else {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    if (!urlData) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    // Simplified visit logging
    const visit = {
      timestamp: new Date(),
    };

    // Increment the click count and save the visit data
    urlData.clickCount += 1;
    urlData.visits.push(visit);
    await urlData.save();

    // Return the long URL
    return NextResponse.json({ longUrl: urlData.longUrl });
  } catch (error) {
    console.error("Error in URL shortener API:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}