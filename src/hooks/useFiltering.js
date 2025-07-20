import { useMemo } from "react";

export const useFiltering = (shortenedLinks, searchTerm, selectedFilters, sortConfig, isRecent) => {
  const processedLinks = useMemo(() => {
    if (!shortenedLinks || shortenedLinks.length === 0) {
      return [];
    }

    let filtered = [...shortenedLinks];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(link => 
        link.original?.toLowerCase().includes(term) ||
        link.shortened?.toLowerCase().includes(term) ||
        link.title?.toLowerCase().includes(term) ||
        link.description?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (selectedFilters.status !== "all") {
      filtered = filtered.filter(link => {
        switch (selectedFilters.status) {
          case "active": return link.isActive !== false;
          case "inactive": return link.isActive === false;
          case "popular": return (link.clicks || 0) > 50;
          case "recent": return isRecent(link.createdAt);
          default: return true;
        }
      });
    }

    // Date range filter
    if (selectedFilters.dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter(link => {
        const linkDate = new Date(link.createdAt);
        switch (selectedFilters.dateRange) {
          case "today": return linkDate.toDateString() === now.toDateString();
          case "week": return (now - linkDate) <= 7 * 24 * 60 * 60 * 1000;
          case "month": return (now - linkDate) <= 30 * 24 * 60 * 60 * 1000;
          case "year": return (now - linkDate) <= 365 * 24 * 60 * 60 * 1000;
          default: return true;
        }
      });
    }

    // Clicks filter
    if (selectedFilters.clicks !== "all") {
      filtered = filtered.filter(link => {
        const clicks = link.clicks || 0;
        switch (selectedFilters.clicks) {
          case "none": return clicks === 0;
          case "low": return clicks > 0 && clicks <= 10;
          case "medium": return clicks > 10 && clicks <= 100;
          case "high": return clicks > 100;
          default: return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key] || 0;
      const bVal = b[sortConfig.key] || 0;
      
      if (sortConfig.direction === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [shortenedLinks, searchTerm, selectedFilters, sortConfig, isRecent]);

  return processedLinks;
};