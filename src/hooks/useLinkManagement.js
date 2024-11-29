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

      const formattedLinks = data.map((link) => ({
        original: link.longUrl,
        shortened: `${process.env.NEXT_PUBLIC_DOMAIN}/${link.header ? `${link.header}/` : ""}${link.shortCode}`,
        clicks: link.clickCount || 0,
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

  return { shortenedLinks, isLoading, error, fetchUserLinks, addNewLink };
};