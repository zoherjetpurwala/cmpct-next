import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { supabaseRateLimit } from '@/lib/rateLimitter';
import { logger } from '@/lib/logger';
import { metrics } from '@/lib/metrics';

export const runtime = 'nodejs';

const compactUrlSchema = z.object({
  longUrl: z.string()
    .url({ message: "Invalid URL format" })
    .max(2048, { message: "URL too long (max 2048 characters)" })
    .refine(url => {
      // Block dangerous protocols and localhost
      const parsed = new URL(url);
      return !['javascript:', 'data:', 'file:', 'ftp:'].includes(parsed.protocol) &&
             !['localhost', '127.0.0.1', '0.0.0.0'].includes(parsed.hostname);
    }, { message: "URL not allowed" }),
  
  header: z.string()
    .regex(/^[a-zA-Z0-9-_]*$/, { message: "Header can only contain letters, numbers, hyphens, and underscores" })
    .max(50, { message: "Header too long (max 50 characters)" })
    .optional()
    .or(z.literal(''))
});

function validateEnvironment() {
  const requiredEnvVars = ['NEXT_PUBLIC_DOMAIN', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_ANON_ROLE_KEY'];
  const missing = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

const CONFIG = {
  shortCodeLength: 7,
  maxGenerationAttempts: 100,
  apiCallResetPeriod: 60 * 1000,
  requestSizeLimit: 1024 * 1024, // 1MB - add this missing config
  tiers: {
    free: { linkLimit: 500, apiCallLimit: 10 },
    basic: { linkLimit: 50000, apiCallLimit: 1000 },
    pro: { linkLimit: 100000, apiCallLimit: 5000 },
    enterprise: { linkLimit: Infinity, apiCallLimit: Infinity }
  }
};

function generateRequestId() {
  return nanoid(12);
}

function sanitizeUrl(url) {
  try {
    const parsed = new URL(url);
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
    trackingParams.forEach(param => parsed.searchParams.delete(param));
    return parsed.toString();
  } catch {
    return url;
  }
}

async function getUserByToken(accessToken, requestId) {
  const startTime = Date.now();
  
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('access_token', accessToken)
      .single();

    metrics.record('db.user_lookup', Date.now() - startTime);
    
    if (error) {
      logger.warn('User lookup failed', { requestId, error: error.message });
      return { user: null, error };
    }
    
    return { user, error: null };
  } catch (error) {
    metrics.record('db.user_lookup', Date.now() - startTime);
    logger.error('User lookup exception', { requestId, error: error.message });
    return { user: null, error };
  }
}

async function resetUserLimitsIfNeeded(user, requestId) {
  const currentDate = new Date();
  const updates = {};
  
  const linkResetDate = new Date(user.link_limit_reset_date);
  if (linkResetDate < currentDate) {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    updates.links_this_month = 0;
    updates.link_limit_reset_date = nextMonth.toISOString();
    user.links_this_month = 0;
  }

  const apiResetTime = new Date(user.api_call_reset_time);
  if (currentDate.getTime() - apiResetTime.getTime() >= CONFIG.apiCallResetPeriod) {
    updates.api_calls_today = 0;
    updates.api_call_reset_time = currentDate.toISOString();
    user.api_calls_today = 0;
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);
    
    if (error) {
      logger.error('Failed to reset user limits', { requestId, userId: user.id, error: error.message });
    } else {
      logger.info('User limits reset', { requestId, userId: user.id, updates });
    }
  }
  
  return user;
}

function checkUserLimits(user) {
  const tierConfig = CONFIG.tiers[user.current_tier] || CONFIG.tiers.free;
  
  if (user.links_this_month >= tierConfig.linkLimit) {
    return {
      allowed: false,
      error: `Link creation limit reached for the ${user.current_tier} tier. Current: ${user.links_this_month}/${tierConfig.linkLimit}`
    };
  }
  
  if (user.api_calls_today >= tierConfig.apiCallLimit) {
    return {
      allowed: false,
      error: `API call limit reached for the ${user.current_tier} tier. Current: ${user.api_calls_today}/${tierConfig.apiCallLimit}`
    };
  }
  
  return { allowed: true };
}

async function generateUniqueShortCode(requestId) {
  let attempts = 0;
  
  while (attempts < CONFIG.maxGenerationAttempts) {
    const shortCode = nanoid(CONFIG.shortCodeLength);
    
    try {
      const { data, error } = await supabase
        .from('urls')
        .select('id')
        .eq('short_code', shortCode)
        .maybeSingle();
      
      if (error) {
        logger.error('Database error checking short code', { requestId, shortCode, error: error.message });
        attempts++;
        continue;
      }
      
      if (!data) {
        logger.debug('Generated unique short code', { requestId, shortCode, attempts: attempts + 1 });
        return { shortCode, error: null };
      }
      
      attempts++;
    } catch (error) {
      logger.error('Exception checking short code uniqueness', { requestId, error: error.message });
      attempts++;
    }
  }
  
  logger.error('Failed to generate unique short code', { requestId, attempts });
  return { shortCode: null, error: 'Unable to generate unique short code after maximum attempts' };
}

async function createUrlWithTransaction(urlData, user, requestId) {
  try {
    const { data: newUrl, error: urlError } = await supabase
      .from('urls')
      .insert({
        long_url: urlData.longUrl,
        short_code: urlData.shortCode,
        user_id: user.id,
        header: urlData.header || null,
        click_count: 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (urlError) {
      logger.error('Failed to create URL record', { requestId, error: urlError.message });
      return { url: null, error: urlError };
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        api_calls_today: user.api_calls_today + 1,
        links_this_month: user.links_this_month + 1,
        link_count: (user.link_count || 0) + 1,
        last_api_call: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      logger.error('Failed to update user counters', { requestId, userId: user.id, error: updateError.message });
    }

    return { url: newUrl, error: null };
  } catch (error) {
    logger.error('Transaction failed', { requestId, error: error.message });
    return { url: null, error };
  }
}

// IMPORTANT: For App Router, export named functions for each HTTP method
export async function POST(request) {
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  // Add CORS headers for production
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_DOMAIN || '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
  
  try {
    validateEnvironment();
  } catch (envError) {
    return NextResponse.json(
      {
        error: 'Server configuration error',
        details: process.env.NODE_ENV === 'development' ? envError.message : 'Missing configuration',
        requestId
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
  
  logger.info('Compact API request started', { requestId });
  
  try {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > CONFIG.requestSizeLimit) {
      metrics.increment('api.requests.rejected.size');
      return NextResponse.json(
        { error: 'Request too large', requestId },
        { 
          status: 413,
          headers: corsHeaders
        }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      metrics.increment('api.requests.rejected.invalid_json');
      logger.warn('Invalid JSON in request', { requestId, error: error.message });
      return NextResponse.json(
        { error: 'Invalid JSON format', requestId },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const validation = compactUrlSchema.safeParse(body);
    if (!validation.success) {
      metrics.increment('api.requests.rejected.validation');
      logger.warn('Request validation failed', { 
        requestId, 
        errors: validation.error.errors 
      });
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.error.errors,
          requestId 
        },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const { longUrl, header } = validation.data;
    const sanitizedUrl = sanitizeUrl(longUrl);
    
    const normalizedHeader = header && header.trim() !== '' ? header.trim() : null;

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      metrics.increment('api.requests.rejected.no_auth');
      return NextResponse.json(
        { error: 'Authorization header with Bearer token required', requestId },
        { 
          status: 401,
          headers: corsHeaders
        }
      );
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken || accessToken.length < 10) {
      metrics.increment('api.requests.rejected.invalid_token');
      return NextResponse.json(
        { error: 'Invalid access token format', requestId },
        { 
          status: 401,
          headers: corsHeaders
        }
      );
    }

    const rateLimitResult = await supabaseRateLimit.checkLimit(accessToken, requestId);
    if (!rateLimitResult.allowed) {
      metrics.increment('api.requests.rejected.rate_limit');
      logger.warn('Rate limit exceeded', { 
        requestId, 
        accessToken: accessToken.substring(0, 8) + '...',
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining
      });
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          retryAfter: rateLimitResult.retryAfter,
          requestId 
        },
        { 
          status: 429,
          headers: {
            ...corsHeaders,
            'Retry-After': rateLimitResult.retryAfter.toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    const { user, error: userError } = await getUserByToken(accessToken, requestId);
    if (!user) {
      metrics.increment('api.requests.rejected.invalid_user');
      return NextResponse.json(
        { error: 'Invalid or expired access token', requestId },
        { 
          status: 403,
          headers: corsHeaders
        }
      );
    }

    logger.info('User authenticated', { requestId, userId: user.id, tier: user.current_tier });

    const updatedUser = await resetUserLimitsIfNeeded(user, requestId);

    const limitCheck = checkUserLimits(updatedUser);
    if (!limitCheck.allowed) {
      metrics.increment('api.requests.rejected.limits');
      logger.warn('User limit exceeded', { 
        requestId, 
        userId: updatedUser.id, 
        error: limitCheck.error 
      });
      return NextResponse.json(
        { error: limitCheck.error, requestId },
        { 
          status: 403,
          headers: corsHeaders
        }
      );
    }

    const { shortCode, error: codeError } = await generateUniqueShortCode(requestId);
    if (!shortCode) {
      metrics.increment('api.requests.failed.code_generation');
      logger.error('Short code generation failed', { requestId, error: codeError });
      return NextResponse.json(
        { error: codeError || 'Failed to generate short code', requestId },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    const { url: newUrl, error: createError } = await createUrlWithTransaction(
      { longUrl: sanitizedUrl, shortCode, header: normalizedHeader },
      updatedUser,
      requestId
    );

    if (!newUrl) {
      metrics.increment('api.requests.failed.database');
      logger.error('URL creation failed', { requestId, error: createError?.message });
      return NextResponse.json(
        { error: 'Failed to create short URL', requestId },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    const shortUrl = normalizedHeader
      ? `${process.env.NEXT_PUBLIC_DOMAIN}/${normalizedHeader}/${shortCode}`
      : `${process.env.NEXT_PUBLIC_DOMAIN}/${shortCode}`;
    const duration = Date.now() - startTime;
    metrics.record('api.requests.duration', duration);
    metrics.increment('api.requests.success');
    
    logger.info('URL created successfully', {
      requestId,
      userId: updatedUser.id,
      shortCode,
      duration,
      hasHeader: !!normalizedHeader
    });

    return NextResponse.json(
      {
        shortUrl,
        shortCode,
        longUrl: sanitizedUrl,
        header: normalizedHeader,
        clickCount: 0,
        createdAt: newUrl.created_at,
        requestId
      },
      {
        headers: {
          ...corsHeaders,
          'X-Request-ID': requestId,
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
        }
      }
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    metrics.record('api.requests.duration', duration);
    metrics.increment('api.requests.error');
    
    logger.error('Unhandled error in compact API', {
      requestId,
      error: error.message,
      stack: error.stack,
      duration
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        requestId,
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'X-Request-ID': requestId
        }
      }
    );
  }
}

export async function GET(request) {
  const requestId = generateRequestId();
  
  return NextResponse.json({
    message: 'URL Shortener API',
    version: '1.0.0',
    methods: ['POST'],
    endpoint: '/api/v1/compact',
    status: 'operational',
    requestId
  }, {
    headers: {
      'X-Request-ID': requestId,
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_DOMAIN || '*',
    }
  });
}

export async function HEAD(request) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'X-Service-Status': 'healthy',
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_DOMAIN || '*',
    }
  });
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_DOMAIN || '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}