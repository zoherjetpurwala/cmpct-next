import { NextResponse } from "next/server";

export function middleware(req) {
  // console.log("Middleware triggered!");

  const ip =
    req.ip ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "127.0.0.1";

  // Remove IPv6 prefix if present
  const cleanIp = ip.replace(/^::ffff:/, "");

  // Create a new request headers with the IP
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-real-client-ip", cleanIp);

  // console.log(
  //   "Middleware - Request Headers:",
  // );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
export const config = {
  matcher: "/api/v1/:path*",
};
