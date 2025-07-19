"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

async function fetchRedirectUrl(path, screenResolution, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`/api/v1/${path.join("/")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Screen-Resolution": screenResolution,
        },
        // Add timeout for Vercel
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

export default function ShortUrlPage({ params }) {
  const { path } = params;
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function redirect() {
      try {
        setLoading(true);
        setError(null);
        
        const screenResolution = typeof window !== 'undefined' 
          ? `${window.screen.width}x${window.screen.height}`
          : "Unknown";
          
        console.log('Fetching redirect for path:', path);
        
        const data = await fetchRedirectUrl(path, screenResolution);
        
        if (data.longUrl) {
          console.log('Redirecting to:', data.longUrl);
          
          // Use window.location.href for external URLs to ensure proper redirect
          if (data.longUrl.startsWith('http://') || data.longUrl.startsWith('https://')) {
            window.location.href = data.longUrl;
          } else {
            router.push(data.longUrl);
          }
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Link Not Found</h1>
          <p className="text-gray-600 mb-4">
            The short URL you&apos;re looking for does&apos;nt exist or has expired.
          </p>
          <p className="text-sm text-gray-500">Error: {error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return null;
}