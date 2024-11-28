import { NextResponse } from 'next/server'

export function middleware(req) {
  const ip = 
    req.ip ||
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    '127.0.0.1'

  // Remove IPv6 prefix if present
  const cleanIp = ip.replace(/^::ffff:/, '')

  // Create a new request headers with the IP
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-real-client-ip', cleanIp)

  console.log("middleware works");
  

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}

export const config = {
  matcher: '/:path*', 
};
