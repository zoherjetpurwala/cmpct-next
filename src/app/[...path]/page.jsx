"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/common/LoadingComponent";

// Enhanced analytics collection on client side
function collectClientAnalytics() {
  const analytics = {};
  
  try {
    // Screen and display information
    analytics.screenResolution = `${window.screen.width}x${window.screen.height}`;
    analytics.viewport = `${window.innerWidth}x${window.innerHeight}`;
    analytics.colorDepth = window.screen.colorDepth;
    analytics.pixelRatio = window.devicePixelRatio;
    analytics.orientation = window.screen.orientation?.type || 'Unknown';
    
    // Browser capabilities
    analytics.cookiesEnabled = navigator.cookieEnabled;
    analytics.javaEnabled = navigator.javaEnabled?.() || false;
    analytics.language = navigator.language;
    analytics.languages = navigator.languages?.join(',') || navigator.language;
    analytics.platform = navigator.platform;
    analytics.onlineStatus = navigator.onLine;
    
    // Hardware information
    analytics.hardwareConcurrency = navigator.hardwareConcurrency || 'Unknown';
    analytics.maxTouchPoints = navigator.maxTouchPoints || 0;
    
    // Memory information (if available)
    if ('memory' in performance) {
      analytics.memoryUsage = {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    
    // Network information (if available)
    if ('connection' in navigator) {
      const connection = navigator.connection;
      analytics.networkType = connection.type || 'Unknown';
      analytics.effectiveType = connection.effectiveType || 'Unknown';
      analytics.downlink = connection.downlink || null;
      analytics.rtt = connection.rtt || null;
      analytics.saveData = connection.saveData || false;
    }
    
    // Battery information (if available and user grants permission)
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        analytics.batteryLevel = Math.round(battery.level * 100);
        analytics.batteryCharging = battery.charging;
      }).catch(() => {
        // Battery API not available or permission denied
      });
    }
    
    // Performance timing
    if ('timing' in performance) {
      const timing = performance.timing;
      analytics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      analytics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      analytics.firstPaint = timing.responseEnd - timing.fetchStart;
    }
    
    // Web vitals (if available)
    if ('getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          analytics.firstContentfulPaint = Math.round(entry.startTime);
        }
        if (entry.name === 'first-paint') {
          analytics.firstPaint = Math.round(entry.startTime);
        }
      });
    }
    
    // Local storage availability
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      analytics.localStorageEnabled = true;
    } catch (e) {
      analytics.localStorageEnabled = false;
    }
    
    // Session storage availability
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      analytics.sessionStorageEnabled = true;
    } catch (e) {
      analytics.sessionStorageEnabled = false;
    }
    
    // Time zone
    analytics.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    analytics.timezoneOffset = new Date().getTimezoneOffset();
    
    // Do Not Track
    analytics.doNotTrack = navigator.doNotTrack === '1' || 
                          window.doNotTrack === '1' || 
                          navigator.msDoNotTrack === '1';
    
    // Ad blocker detection (simple check)
    analytics.adBlockerDetected = !document.querySelector('.adsbox') && 
                                 !document.querySelector('#ads') &&
                                 !window.google_ad_client;
    
    // Dark mode preference
    analytics.prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    analytics.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Touch support
    analytics.touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Geolocation support
    analytics.geolocationSupported = 'geolocation' in navigator;
    
    // Camera/microphone support
    analytics.mediaDevicesSupported = 'mediaDevices' in navigator;
    
    // WebRTC support
    analytics.webRTCSupported = !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
    
    // Service worker support
    analytics.serviceWorkerSupported = 'serviceWorker' in navigator;
    
    // Push notification support
    analytics.pushNotificationSupported = 'PushManager' in window;
    
    // WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    analytics.webGLSupported = !!gl;
    if (gl) {
      analytics.webGLVendor = gl.getParameter(gl.VENDOR);
      analytics.webGLRenderer = gl.getParameter(gl.RENDERER);
    }
    
  } catch (error) {
    console.warn('Error collecting client analytics:', error);
  }
  
  return analytics;
}

// Enhanced fetch function with analytics headers
async function fetchRedirectUrlWithAnalytics(path, analytics, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Generate a unique session ID for this visit
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const headers = {
        "Content-Type": "application/json",
        // Screen and display
        "Screen-Resolution": analytics.screenResolution || "Unknown",
        "Viewport": analytics.viewport || "Unknown",
        "Color-Depth": analytics.colorDepth?.toString() || "Unknown",
        "Pixel-Ratio": analytics.pixelRatio?.toString() || "Unknown",
        
        // Network
        "Network-Type": analytics.networkType || "Unknown",
        "Effective-Connection-Type": analytics.effectiveType || "Unknown",
        "Downlink": analytics.downlink?.toString() || null,
        "RTT": analytics.rtt?.toString() || null,
        
        // Performance
        "Page-Load-Time": analytics.pageLoadTime?.toString() || null,
        
        // Session tracking
        "Session-ID": sessionId,
        
        // Privacy
        "DNT": analytics.doNotTrack ? "1" : "0",
        
        // Preferences
        "Prefers-Dark-Mode": analytics.prefersDarkMode ? "true" : "false",
        "Prefers-Reduced-Motion": analytics.prefersReducedMotion ? "true" : "false",
        
        // Device capabilities
        "Touch-Support": analytics.touchSupport ? "true" : "false",
        "Hardware-Concurrency": analytics.hardwareConcurrency?.toString() || "Unknown"
      };
      
      // Remove null values
      Object.keys(headers).forEach(key => {
        if (headers[key] === null || headers[key] === "null") {
          delete headers[key];
        }
      });
      
      const response = await fetch(`/api/v1/${path.join("/")}`, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

export default function EnhancedShortUrlPage({ params }) {
  const { path } = params;
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    async function redirect() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Collecting client analytics...');
        const clientAnalytics = collectClientAnalytics();
        setAnalytics(clientAnalytics);
        
        console.log('Fetching redirect for path:', path);
        console.log('Client analytics collected:', clientAnalytics);
        
        const data = await fetchRedirectUrlWithAnalytics(path, clientAnalytics);
        
        if (data.longUrl) {
          console.log('Redirecting to:', data.longUrl);
          
          // Add a small delay to ensure analytics are sent
          setTimeout(() => {
            if (data.longUrl.startsWith('http://') || data.longUrl.startsWith('https://')) {
              window.location.href = data.longUrl;
            } else {
              router.push(data.longUrl);
            }
          }, 100);
        } else {
          throw new Error("No redirect URL found");
        }
      } catch (error) {
        console.error("Error fetching redirect URL:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (path && path.length > 0) {
      redirect();
    }
  }, [path, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-themeColor-light/5 via-white to-themeColor-light/10 flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <LoadingSpinner 
            size="lg"
            message="Redirecting to your destination..."
            variant="card"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-red-600 mb-4">Link Not Found</h1>
            
            <p className="text-gray-600 mb-4">
              The short URL you&apos;re looking for doesn&apos;t exist or has expired.
            </p>
            
            <div className="bg-red-50 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700 font-medium">Error Details:</p>
              <p className="text-xs text-red-600 mt-1 font-mono">{error}</p>
            </div>
            
            <button 
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-themeColor text-white rounded-lg hover:bg-themeColor-dark transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Go to Homepage
            </button>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Need help? Contact our support team
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}