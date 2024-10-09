"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


async function fetchRedirectUrl(path, accessToken) {

  const response = await fetch(`/api/v1/${path.join("/")}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch redirect URL");
  return response.json();
}

export default function ShortUrlPage({ params }) {
  const { path } = params;
  const router = useRouter();
  const { data: session } = useSession();


  useEffect(() => {
    async function redirect() {
      try {
        if (!session?.user || !session?.user.accessToken) {
          throw new Error("User is not authenticated");
        }
        const data = await fetchRedirectUrl(path, session?.user.accessToken);
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
  }, [path, session?.user, router]);

  return (
    <div>
      {!session?.user || !session?.user.accessToken ? "Not authenticated" : "Redirecting..."}
    </div>
  );
}
