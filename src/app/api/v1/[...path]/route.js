import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import urlModel from "@/models/url.model";
import userModel from "@/models/user.model";

let dbConnection = null;

export async function GET(request, { params }) {
  const { path } = params;
  const accessToken = request.headers.get("Authorization")?.split(" ")[1];

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token is required" },
      { status: 401 }
    );
  }

  try {
    if (!dbConnection) {
      dbConnection = await connectToDatabase();
    }

    const [user, urlData] = await Promise.all([
      userModel.findOne({ accessToken }).select("_id").lean(),
      urlModel
        .findOne({
          $or: [
            { shortCode: path[0], user: { $exists: true } },
            { shortCode: path[1], header: path[0], user: { $exists: true } },
          ],
        })
        .select("longUrl")
        .lean(),
    ]);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 403 }
      );
    }

    if (!urlData) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    return NextResponse.json({ longUrl: urlData.longUrl });
  } catch (error) {
    console.error("Error in URL shortener API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
