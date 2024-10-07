"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

async function fetchRedirectUrl(path, accessToken) {
    const response = await fetch(`/api/v1/${path.join("/")}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`, // Pass the access token in the headers
        },
    });
    if (!response.ok) throw new Error("Failed to fetch redirect URL");
    return response.json();
}

export default function ShortUrlPage({ params }) {
    const { path } = params;
    const router = useRouter();
    const { user } = useUser(); // Make sure user is extracted correctly

    useEffect(() => {
        async function redirect() {
            try {
                if (!user || !user.accessToken) {
                    throw new Error("User is not authenticated");
                }

                const data = await fetchRedirectUrl(path, user.accessToken);
                console.log("API response data:", data); // Log the data for debugging

                if (data.longUrl) {
                    router.push(data.longUrl); // Use Next.js router for redirection
                } else {
                    throw new Error("No redirect URL found");
                }
            } catch (error) {
                console.error("Error fetching redirect URL:", error);
                // Handle error (e.g., show error message)
            }
        }

        redirect();
    }, [path, user]);

    return <div>{!user || !user.accessToken ? "Not authenticated" : "Redirecting..."}</div>;
}
