import { useMemo, useCallback } from "react";

export const useAnalytics = (shortenedLinks) => {
  const isRecent = useCallback((dateString) => {
    const date = new Date(dateString || Date.now());
    const now = new Date();
    const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }, []);

  const analytics = useMemo(() => {
    if (!shortenedLinks || shortenedLinks.length === 0) {
      return {
        total: 0,
        totalClicks: 0,
        avgClicks: 0,
        recentLinks: 0,
        popularLinks: 0,
        topPerformer: {},
        conversionRate: 0
      };
    }

    const total = shortenedLinks.length;
    const totalClicks = shortenedLinks.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const avgClicks = total > 0 ? Math.round(totalClicks / total) : 0;
    const recentLinks = shortenedLinks.filter(link => isRecent(link.createdAt)).length;
    const popularLinks = shortenedLinks.filter(link => (link.clicks || 0) > 100).length;
    const topPerformer = shortenedLinks.reduce((max, link) => 
      (link.clicks || 0) > (max.clicks || 0) ? link : max, shortenedLinks[0] || {});

    return {
      total,
      totalClicks,
      avgClicks,
      recentLinks,
      popularLinks,
      topPerformer,
      conversionRate: total > 0 ? ((totalClicks / total) * 100).toFixed(1) : 0
    };
  }, [shortenedLinks, isRecent]);

  return { analytics, isRecent };
};
