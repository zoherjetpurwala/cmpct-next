import { NextResponse } from 'next/server';
import { metrics } from '@/lib/metrics';

export function middleware(request) {
  const start = Date.now();
  
  // Add security headers
  const response = NextResponse.next();
  
  // CORS headers
  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Rate limiting headers
  response.headers.set('X-RateLimit-Policy', '100 requests per minute');
  
  // Track request metrics
  const duration = Date.now() - start;
  metrics.record('middleware.duration', duration);
  metrics.increment('middleware.requests');
  
  return response;
}

export const config = {
  matcher: '/api/:path*'
};
