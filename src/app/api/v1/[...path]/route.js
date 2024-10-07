import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import urlModel from "@/models/url.model";
import userModel from "@/models/user.model";

export async function GET(_, { params }) {
  const { path } = params;
  const accessToken = request.headers.get('Authorization')?.split(' ')[1]; // Extract access token from Authorization header

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
      urlData = await urlModel.findOne({ shortCode, header, user: user._id }); // Ensure URL belongs to the user
    } else if (path.length === 1) {
      const [shortCode] = path;
      urlData = await urlModel.findOne({ shortCode, user: user._id }); // Ensure URL belongs to the user
    } else {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (!urlData) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    // Redirect to the original long URL
    return NextResponse.redirect(urlData.longUrl);
  } catch (error) {
    console.error("Error in URL shortener API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
