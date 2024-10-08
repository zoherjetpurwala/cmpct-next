import { useState, useEffect, useCallback } from 'react';
import { useUser } from "@/context/UserContext";

export const useLinkManagement = () => {
  const [shortenedLinks, setShortenedLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const fetchUserLinks = useCallback(async () => {
    if (!user?._id) {
      console.log("User is not logged in or ID is not available.");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("/api/v1/user-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user links");
      }

      const data = await response.json();
      const formattedLinks = data.map((link) => ({
        original: link.longUrl,
        shortened: `${process.env.NEXT_PUBLIC_DOMAIN}/${link.header ? `${link.header}/` : ""}${link.shortCode}`,
        clicks: link.clicks || 0,
      }));

      setShortenedLinks(formattedLinks);
    } catch (error) {
      console.error("Error fetching user links:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserLinks();
  }, [fetchUserLinks]);

  const addNewLink = useCallback((newLink) => {
    setShortenedLinks(prevLinks => [newLink, ...prevLinks]);
  }, []);

  return { shortenedLinks, isLoading, error, fetchUserLinks, addNewLink };
};