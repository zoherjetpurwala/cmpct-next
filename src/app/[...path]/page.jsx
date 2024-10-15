"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

async function fetchRedirectUrl(path, screenResolution) {
  const response = await fetch(`/api/v1/${path.join("/")}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Screen-Resolution": screenResolution,
    },
  });
  
  if (!response.ok) throw new Error("Failed to fetch redirect URL");
  return response.json();
}

export default function ShortUrlPage({ params }) {
  const { path } = params;
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      try {
        const screenResolution = `${window.screen.width}x${window.screen.height}`;
        const data = await fetchRedirectUrl(path, screenResolution);
        if (data.longUrl) {
          router.push(data.longUrl);
        } else {
          throw new Error("No redirect URL found");
        }
      } catch (error) {
        console.error("Error fetching redirect URL:", error);
      }
    }
    redirect();
  }, [path, router]);
}