import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import urlModel from "@/models/url.model";

// Ensure you have DB connection utility ready (dbConnect.js should handle the connection to MongoDB)

export async function POST(request) {
  await connectToDatabase();
  try {
    const { userId } = await request.json();
   

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const userLinks = await urlModel.find({ user: userId });
    

    return NextResponse.json(userLinks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching user URLs" },
      { status: 500 }
    );
  }
}
