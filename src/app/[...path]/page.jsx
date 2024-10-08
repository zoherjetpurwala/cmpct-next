"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

async function fetchRedirectUrl(path, accessToken) {
    const response = await fetch(`/api/v1/${path.join("/")}`, {
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
    const { user } = useUser();

    useEffect(() => {
        if (!user?.accessToken) {
            router.push('/login'); // Redirect to login if not authenticated
            return;
        }

        fetchRedirectUrl(path, user.accessToken)
            .then(data => {
                if (data.longUrl) {
                    window.location.href = data.longUrl; // Use window.location for faster redirect
                } else {
                    throw new Error("No redirect URL found");
                }
            })
            .catch(error => {
                console.error("Error fetching redirect URL:", error);
                router.push('/error'); // Redirect to error page
            });
    }, [path, user, router]);

    return <div>Redirecting...</div>;
}