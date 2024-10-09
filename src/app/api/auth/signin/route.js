// // app/api/auth/signin/route.js
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../[...nextauth]";

// export async function POST(req) {
//   const session = await getServerSession(authOptions);

//   if (session) {
//     return NextResponse.json({ message: "Already signed in" }, { status: 200 });
//   }

//   // NextAuth will handle the actual signin process
//   return NextResponse.json({ message: "Use NextAuth signin" }, { status: 200 });
// }