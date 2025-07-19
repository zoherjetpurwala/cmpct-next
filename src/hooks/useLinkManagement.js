// ====================
// Updated useLinkManagement.js hook for Supabase
// ====================
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export const useLinkManagement = () => {
  const [shortenedLinks, setShortenedLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession(); 

  const fetchUserLinks = useCallback(async () => {
    if (!session?.user.id) {
      console.log("User is not logged in or ID is not available.");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("/api/v1/user-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user.id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch user links");
      }

      // Updated to match Supabase column names
      const formattedLinks = data.map((link) => ({
        original: link.long_url, // Updated from longUrl to long_url
        shortened: `${process.env.NEXT_PUBLIC_DOMAIN}/${link.header ? `${link.header}/` : ""}${link.short_code}`, // Updated from shortCode to short_code
        clicks: link.click_count || 0, // Updated from clickCount to click_count
        id: link.id, // Include the UUID for potential future use
        createdAt: link.created_at, // Include creation timestamp
        header: link.header // Include header for branded links
      }));

      setShortenedLinks(formattedLinks);
    } catch (error) {
      console.error("Error fetching user links:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    fetchUserLinks();
  }, [fetchUserLinks]);

  const addNewLink = useCallback((newLink) => {
    setShortenedLinks(prevLinks => [newLink, ...prevLinks]);
  }, []);

  // Additional helper function to refresh a specific link's analytics
  const refreshLinkAnalytics = useCallback(async (linkId) => {
    try {
      // This could be extended to fetch updated analytics for a specific link
      await fetchUserLinks();
    } catch (error) {
      console.error("Error refreshing link analytics:", error);
    }
  }, [fetchUserLinks]);

  return { 
    shortenedLinks, 
    isLoading, 
    error, 
    fetchUserLinks, 
    addNewLink,
    refreshLinkAnalytics 
  };
};