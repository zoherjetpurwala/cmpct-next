import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  LinkIcon,
  BarChart2,
  TrendingUp,
  Star,
  Calendar,
  Activity,
  Globe
} from "lucide-react";

const StatsCard = ({ title, value, subtitle, icon: Icon, color = "themeColor" }) => (
  <Card className="rounded-xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/10">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-themeColor-text">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <Icon className="h-8 w-8 text-themeColor/60" />
      </div>
    </CardContent>
  </Card>
);

export const StatsOverview = ({ analytics, shortenedLinks }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div variants={itemVariants}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatsCard
          title="Total Links"
          value={analytics.total}
          subtitle={`+${analytics.recentLinks} this week`}
          icon={LinkIcon}
        />
        <StatsCard
          title="Total Clicks"
          value={analytics.totalClicks.toLocaleString()}
          subtitle={`${analytics.conversionRate}% avg rate`}
          icon={BarChart2}
        />
        <StatsCard
          title="Avg. Clicks"
          value={analytics.avgClicks}
          subtitle="per link"
          icon={TrendingUp}
        />
        <StatsCard
          title="Popular"
          value={analytics.popularLinks}
          subtitle="100+ clicks"
          icon={Star}
        />
        <StatsCard
          title="This Week"
          value={analytics.recentLinks}
          subtitle="new links"
          icon={Calendar}
        />
        <StatsCard
          title="Top Link"
          value={analytics.topPerformer?.clicks || 0}
          subtitle="clicks"
          icon={Activity}
        />
        <StatsCard
          title="Active"
          value={shortenedLinks.filter(l => l.isActive !== false).length}
          subtitle="links"
          icon={Globe}
        />
      </div>
    </motion.div>
  );
};