"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

async function fetchRedirectUrl(path) {
  const response = await fetch(`/api/v1/${path.join("/")}`, { method: "GET" });
  if (!response.ok) throw new Error("Failed to fetch redirect URL");
  return response.json();
}

export default function ShortUrlPage({ params }) {
  const { path } = params;
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      try {
        const data = await fetchRedirectUrl(path);
        if (data.longUrl) {
          window.location.href = data.longUrl;
        } else {
          throw new Error("No redirect URL found");
        }
      } catch (error) {
        console.error("Error fetching redirect URL:", error);
        // Handle error (e.g., show error message)
      }
    }

    redirect();
  }, [path]);

  return <div>Redirecting...</div>;
}
