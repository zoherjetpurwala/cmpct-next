import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

class SupabaseRateLimit {
  constructor() {
    this.windowSize = 60 * 1000; // 1 minute in milliseconds
    this.maxRequests = 100; // requests per minute
    this.cleanupInterval = 5 * 60 * 1000; // cleanup every 5 minutes
    
    // Start periodic cleanup
    this.startCleanup();
  }

  async checkLimit(identifier, requestId = null) {
    const now = new Date();
    const windowStart = new Date(now.getTime() - this.windowSize);
    
    try {
      // First, clean up old records
      await this.cleanup(windowStart);
      
      // Count requests in current window
      const { data: requests, error: countError } = await supabase
        .from('rate_limits')
        .select('id, created_at')
        .eq('identifier', identifier)
        .gte('created_at', windowStart.toISOString())
        .order('created_at', { ascending: false });

      if (countError) {
        logger.error('Rate limit count error', { 
          requestId, 
          identifier: identifier.substring(0, 8) + '...', 
          error: countError.message 
        });
        // Allow request on error to avoid blocking users
        return { allowed: true, remaining: this.maxRequests, limit: this.maxRequests };
      }

      const currentCount = requests?.length || 0;
      
      // Check if limit exceeded
      if (currentCount >= this.maxRequests) {
        const oldestRequest = requests[requests.length - 1];
        const resetTime = new Date(oldestRequest.created_at).getTime() + this.windowSize;
        const retryAfter = Math.ceil((resetTime - now.getTime()) / 1000);
        
        return {
          allowed: false,
          remaining: 0,
          limit: this.maxRequests,
          retryAfter: Math.max(retryAfter, 1),
          resetTime: Math.ceil(resetTime / 1000)
        };
      }

      // Record this request
      const { error: insertError } = await supabase
        .from('rate_limits')
        .insert({
          identifier,
          created_at: now.toISOString(),
          expires_at: new Date(now.getTime() + this.windowSize).toISOString()
        });

      if (insertError) {
        logger.error('Rate limit insert error', { 
          requestId, 
          identifier: identifier.substring(0, 8) + '...', 
          error: insertError.message 
        });
        // Allow request on error
        return { allowed: true, remaining: this.maxRequests - 1, limit: this.maxRequests };
      }

      return {
        allowed: true,
        remaining: this.maxRequests - currentCount - 1,
        limit: this.maxRequests,
        retryAfter: 60,
        resetTime: Math.ceil((now.getTime() + this.windowSize) / 1000)
      };

    } catch (error) {
      logger.error('Rate limit check failed', { 
        requestId, 
        identifier: identifier.substring(0, 8) + '...', 
        error: error.message 
      });
      // Allow request on unexpected error
      return { allowed: true, remaining: this.maxRequests, limit: this.maxRequests };
    }
  }

  async cleanup(before = null) {
    try {
      const cleanupTime = before || new Date(Date.now() - this.windowSize);
      
      const { error } = await supabase
        .from('rate_limits')
        .delete()
        .lt('expires_at', cleanupTime.toISOString());

      if (error) {
        logger.warn('Rate limit cleanup failed', { error: error.message });
      }
    } catch (error) {
      logger.warn('Rate limit cleanup exception', { error: error.message });
    }
  }

  startCleanup() {
    // Run cleanup periodically
    setInterval(() => {
      this.cleanup().catch(error => {
        logger.warn('Scheduled cleanup failed', { error: error.message });
      });
    }, this.cleanupInterval);
  }

  async getStats(identifier) {
    try {
      const windowStart = new Date(Date.now() - this.windowSize);
      
      const { data: requests, error } = await supabase
        .from('rate_limits')
        .select('created_at')
        .eq('identifier', identifier)
        .gte('created_at', windowStart.toISOString());

      if (error) {
        return { count: 0, remaining: this.maxRequests };
      }

      const count = requests?.length || 0;
      return {
        count,
        remaining: Math.max(0, this.maxRequests - count),
        limit: this.maxRequests,
        windowSize: this.windowSize
      };
    } catch (error) {
      return { count: 0, remaining: this.maxRequests };
    }
  }
}

// Create singleton instance
export const supabaseRateLimit = new SupabaseRateLimit();

// Fallback in-memory rate limiter for development/testing
class InMemoryRateLimit {
  constructor() {
    this.requests = new Map();
    this.windowSize = 60 * 1000; // 1 minute
    this.maxRequests = 100;
  }

  async checkLimit(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowSize;
    
    // Get or create request history for this identifier
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const requestHistory = this.requests.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = requestHistory.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (validRequests.length >= this.maxRequests) {
      const retryAfter = Math.ceil((validRequests[0] + this.windowSize - now) / 1000);
      return {
        allowed: false,
        limit: this.maxRequests,
        remaining: 0,
        retryAfter: Math.max(retryAfter, 1),
        resetTime: Math.ceil((validRequests[0] + this.windowSize) / 1000)
      };
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return {
      allowed: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - validRequests.length,
      retryAfter: 60,
      resetTime: Math.ceil((now + this.windowSize) / 1000)
    };
  }
}

// Export the appropriate rate limiter based on environment
export const fallbackRateLimit = new InMemoryRateLimit();