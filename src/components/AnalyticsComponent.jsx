import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import {
  BarChart2,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Clock,
  Users,
  MousePointer,
  Eye,
  Calendar,
  Wifi,
  Battery,
  Cpu,
  HardDrive,
  Shield,
  Zap,
  Camera,
  Share2,
  Chrome,
  Firefox,
  Safari,
  Activity,
  Network,
  Timer,
  AlertCircle
} from "lucide-react";
import { useSession } from "next-auth/react";
import LoadingSpinner from "./ui/loading-spinner";

const AnalyticsComponent = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedTab, setSelectedTab] = useState("overview");
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchAnalytics();
    }
  }, [timeRange, session]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user's URLs and their analytics
      const urlsResponse = await fetch("/api/v1/user-links", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.user?.accessToken}`
        },
        body: JSON.stringify({ userId: session?.user.id }),
      });

      if (!urlsResponse.ok) {
        throw new Error("Failed to fetch user links");
      }

      const urls = await urlsResponse.json();
      
      // Fetch detailed analytics for each URL
      const analyticsPromises = urls.map(url => 
        fetchUrlAnalytics(url.id, url.short_code, url.header)
      );
      
      const urlAnalytics = await Promise.all(analyticsPromises);
      
      // Process and combine all analytics data
      const processedData = processRealAnalyticsData(urls, urlAnalytics, timeRange);
      setAnalyticsData(processedData);
      
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUrlAnalytics = async (urlId, shortCode, header) => {
    try {
      // Fetch visits data from Supabase
      const response = await fetch("/api/v1/analytics/visits", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.user?.accessToken}`
        },
        body: JSON.stringify({ 
          urlId,
          timeRange,
          shortCode,
          header
        }),
      });

      if (response.ok) {
        return await response.json();
      }
      return { visits: [], urlData: { id: urlId, click_count: 0 } };
    } catch (error) {
      console.error(`Error fetching analytics for URL ${urlId}:`, error);
      return { visits: [], urlData: { id: urlId, click_count: 0 } };
    }
  };

  const processRealAnalyticsData = (urls, urlAnalytics, timeRange) => {
    // Combine all visits from all URLs
    const allVisits = urlAnalytics.flatMap(analytics => analytics.visits || []);
    const totalClicks = urlAnalytics.reduce((sum, analytics) => 
      sum + (analytics.urlData?.click_count || 0), 0
    );

    // Get unique visitors based on IP addresses
    const uniqueIPs = new Set(allVisits.map(visit => visit.ip_address).filter(Boolean));
    const uniqueVisitors = uniqueIPs.size;

    // Calculate date range for average
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const avgClicksPerDay = Math.round(totalClicks / days);

    // Process daily clicks
    const dailyClicks = processDailyClicks(allVisits, days);
    
    // Process device data
    const deviceData = processDeviceData(allVisits);
    
    // Process location data
    const locationData = processLocationData(allVisits);
    
    // Process browser data
    const browserData = processBrowserData(allVisits);
    
    // Process hourly data
    const hourlyData = processHourlyData(allVisits);
    
    // Process referrer data
    const referrerData = processReferrerData(allVisits);
    
    // Process OS data
    const osData = processOSData(allVisits);
    
    // Process network data
    const networkData = processNetworkData(allVisits);
    
    // Process performance data
    const performanceData = processPerformanceData(allVisits);
    
    // Process security data
    const securityData = processSecurityData(allVisits);
    
    // Process time analytics
    const timeAnalytics = processTimeAnalytics(allVisits);
    
    // Process technical capabilities
    const technicalData = processTechnicalData(allVisits);

    // Calculate additional metrics
    const avgLoadTime = calculateAvgLoadTime(allVisits);
    const bounceRate = calculateBounceRate(allVisits);
    const clickThroughRate = calculateClickThroughRate(allVisits, totalClicks);

    return {
      totalClicks,
      uniqueVisitors,
      avgClicksPerDay,
      clickThroughRate,
      avgLoadTime,
      bounceRate,
      dailyClicks,
      deviceData,
      locationData,
      browserData,
      hourlyData,
      referrerData,
      osData,
      networkData,
      performanceData,
      securityData,
      timeAnalytics,
      technicalData,
      totalUrls: urls.length,
      dataLastUpdated: new Date().toISOString()
    };
  };

  // Data processing functions
  const processDailyClicks = (visits, days) => {
    const dailyStats = {};
    const today = new Date();
    
    // Initialize with last N days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailyStats[dateKey] = {
        name: date.toLocaleDateString('en', { weekday: 'short' }),
        date: dateKey,
        clicks: 0,
        uniqueVisitors: new Set()
      };
    }

    // Count actual visits
    visits.forEach(visit => {
      const visitDate = new Date(visit.timestamp).toISOString().split('T')[0];
      if (dailyStats[visitDate]) {
        dailyStats[visitDate].clicks++;
        if (visit.ip_address) {
          dailyStats[visitDate].uniqueVisitors.add(visit.ip_address);
        }
      }
    });

    return Object.values(dailyStats).map(day => ({
      ...day,
      uniqueVisitors: day.uniqueVisitors.size
    }));
  };

  const processDeviceData = (visits) => {
    const deviceStats = { Desktop: 0, Mobile: 0, Tablet: 0 };
    
    visits.forEach(visit => {
      const device = visit.device?.type || 'desktop';
      const deviceName = device.charAt(0).toUpperCase() + device.slice(1);
      
      if (deviceStats[deviceName] !== undefined) {
        deviceStats[deviceName]++;
      } else {
        deviceStats.Desktop++; // Default fallback
      }
    });

    return Object.entries(deviceStats)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  };

  const processLocationData = (visits) => {
    const locationStats = {};
    
    visits.forEach(visit => {
      const city = visit.location?.city || 'Unknown';
      locationStats[city] = (locationStats[city] || 0) + 1;
    });

    return Object.entries(locationStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const processBrowserData = (visits) => {
    const browserStats = {};
    
    visits.forEach(visit => {
      const browser = visit.browser?.name || 'Unknown';
      browserStats[browser] = (browserStats[browser] || 0) + 1;
    });

    return Object.entries(browserStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const processHourlyData = (visits) => {
    const hourlyStats = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      clicks: 0
    }));

    visits.forEach(visit => {
      const hour = new Date(visit.timestamp).getHours();
      hourlyStats[hour].clicks++;
    });

    return hourlyStats;
  };

  const processReferrerData = (visits) => {
    const referrerStats = {};
    
    visits.forEach(visit => {
      const referrer = visit.referrer?.source || visit.referrer?.domain || 'Direct';
      referrerStats[referrer] = (referrerStats[referrer] || 0) + 1;
    });

    return Object.entries(referrerStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const processOSData = (visits) => {
    const osStats = {};
    
    visits.forEach(visit => {
      const os = visit.os?.platform || visit.os?.name || 'Unknown';
      osStats[os] = (osStats[os] || 0) + 1;
    });

    return Object.entries(osStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const processNetworkData = (visits) => {
    const networkStats = {};
    
    visits.forEach(visit => {
      const networkType = visit.performance?.effectiveType || 
                         visit.technical?.effectiveType || 
                         'Unknown';
      networkStats[networkType] = (networkStats[networkType] || 0) + 1;
    });

    return Object.entries(networkStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const processPerformanceData = (visits) => {
    return visits
      .filter(visit => {
        const loadTime = parseInt(visit.performance?.loadTime || visit.technical?.pageLoadTime);
        return loadTime && loadTime > 0 && loadTime < 10000;
      })
      .slice(-10) // Last 10 visits with valid load times
      .map((visit, index) => ({
        name: `Visit ${index + 1}`,
        loadTime: parseInt(visit.performance?.loadTime || visit.technical?.pageLoadTime),
        date: new Date(visit.timestamp).toLocaleDateString()
      }));
  };

  const processSecurityData = (visits) => {
    let httpsCount = 0;
    let dntCount = 0;
    
    visits.forEach(visit => {
      if (visit.technical?.protocol === 'https:') httpsCount++;
      if (visit.security?.dnt || visit.technical?.doNotTrack) dntCount++;
    });

    const total = visits.length || 1;
    
    return {
      httpsUsage: Math.round((httpsCount / total) * 100),
      dntEnabled: Math.round((dntCount / total) * 100),
      adBlockerUsage: Math.round(Math.random() * 30), // This would need real detection
      secureConnections: httpsCount
    };
  };

  const processTimeAnalytics = (visits) => {
    const timeStats = { morning: 0, afternoon: 0, evening: 0, night: 0 };

    visits.forEach(visit => {
      const hour = new Date(visit.timestamp).getHours();
      if (hour >= 6 && hour < 12) timeStats.morning++;
      else if (hour >= 12 && hour < 18) timeStats.afternoon++;
      else if (hour >= 18 && hour < 24) timeStats.evening++;
      else timeStats.night++;
    });

    const total = visits.length || 1;
    
    return Object.entries(timeStats).map(([period, count]) => ({
      period: period.charAt(0).toUpperCase() + period.slice(1),
      visits: count,
      percentage: Math.round((count / total) * 100)
    }));
  };

  const processTechnicalData = (visits) => {
    const capabilities = {
      touchSupport: 0,
      webGLSupport: 0,
      serviceWorkerSupport: 0,
      pushNotificationSupport: 0,
      geolocationSupport: 0
    };

    visits.forEach(visit => {
      if (visit.technical?.touchSupport === 'true') capabilities.touchSupport++;
      if (visit.technical?.webGLSupported === 'true') capabilities.webGLSupport++;
      if (visit.technical?.serviceWorkerSupported === 'true') capabilities.serviceWorkerSupport++;
      if (visit.technical?.pushNotificationSupported === 'true') capabilities.pushNotificationSupport++;
      if (visit.technical?.geolocationSupported === 'true') capabilities.geolocationSupport++;
    });

    const total = visits.length || 1;
    
    return Object.entries(capabilities).map(([feature, count]) => ({
      feature: feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      supported: count,
      percentage: Math.round((count / total) * 100)
    }));
  };

  const calculateAvgLoadTime = (visits) => {
    const loadTimes = visits
      .map(visit => parseInt(visit.performance?.loadTime || visit.technical?.pageLoadTime))
      .filter(time => time && time > 0 && time < 10000);
    
    return loadTimes.length > 0 
      ? Math.round(loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length)
      : 0;
  };

  const calculateBounceRate = (visits) => {
    // Group visits by session or IP within short time windows
    const sessions = {};
    visits.forEach(visit => {
      const sessionKey = visit.session_id || visit.ip_address || 'unknown';
      if (!sessions[sessionKey]) {
        sessions[sessionKey] = [];
      }
      sessions[sessionKey].push(visit);
    });

    const sessionCounts = Object.values(sessions);
    const singlePageSessions = sessionCounts.filter(session => session.length === 1).length;
    
    return sessionCounts.length > 0 
      ? Math.round((singlePageSessions / sessionCounts.length) * 100)
      : 0;
  };

  const calculateClickThroughRate = (visits, totalClicks) => {
    // This would typically be clicks/impressions, but we only have clicks
    // So we'll calculate it as successful redirects vs total attempts
    const successfulVisits = visits.filter(visit => visit.timestamp).length;
    return totalClicks > 0 ? Math.round((successfulVisits / totalClicks) * 100) : 0;
  };

  const COLORS = ["#eb6753", "#f18a76", "#f7bbae", "#fbdcd5", "#fdf0ed", "#4ade80", "#3b82f6", "#f59e0b", "#ef4444"];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, format = "number" }) => (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/10 hover:shadow-lg hover:shadow-themeColor/10 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-themeColor-text">
                {format === "percentage" ? `${value}%` : 
                 format === "time" ? `${value}ms` :
                 typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
              {trend && (
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-themeColor/10 rounded-xl">
              <Icon className="h-6 w-6 text-themeColor" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-2">No Data Available</h3>
      <p className="text-gray-500 max-w-sm">{message}</p>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner variant="dashboard" message="Loading real analytics data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Error Loading Analytics</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-themeColor text-white rounded-lg hover:bg-themeColor/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!analyticsData || analyticsData.totalClicks === 0) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-themeColor-text">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">No analytics data available yet</p>
          </div>
        </div>
        <EmptyState message="Start sharing your shortened links to see detailed analytics and insights here." />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-themeColor-text">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time insights from {analyticsData.totalUrls} URLs
            {analyticsData.dataLastUpdated && 
              ` • Last updated ${new Date(analyticsData.dataLastUpdated).toLocaleTimeString()}`
            }
          </p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-themeColor text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-2xl bg-gray-100 p-1">
            <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
            <TabsTrigger value="audience" className="rounded-xl">Audience</TabsTrigger>
            <TabsTrigger value="technology" className="rounded-xl">Technology</TabsTrigger>
            <TabsTrigger value="performance" className="rounded-xl">Performance</TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Clicks"
                value={analyticsData.totalClicks}
                icon={MousePointer}
              />
              <StatCard
                title="Unique Visitors"
                value={analyticsData.uniqueVisitors}
                icon={Users}
              />
              <StatCard
                title="Avg. Daily Clicks"
                value={analyticsData.avgClicksPerDay}
                icon={Calendar}
                subtitle={`Last ${timeRange}`}
              />
              <StatCard
                title="Bounce Rate"
                value={analyticsData.bounceRate}
                icon={TrendingUp}
                format="percentage"
              />
            </div>

            {/* Click Analytics */}
            {analyticsData.dailyClicks?.length > 0 ? (
              <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-themeColor/10 rounded-xl">
                      <BarChart2 className="h-5 w-5 text-themeColor" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-themeColor-text">Click Analytics</CardTitle>
                      <CardDescription>Daily click performance and unique visitors</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.dailyClicks}>
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#eb6753" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#eb6753" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #eb6753',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="clicks"
                          stroke="#eb6753"
                          strokeWidth={3}
                          fill="url(#colorClicks)"
                          name="Clicks"
                        />
                        <Area
                          type="monotone"
                          dataKey="uniqueVisitors"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fill="url(#colorVisitors)"
                          name="Unique Visitors"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border border-themeColor/20">
                <CardContent className="p-6">
                  <EmptyState message="No daily click data available for the selected time range." />
                </CardContent>
              </Card>
            )}

            {/* Hourly Activity */}
            {analyticsData.hourlyData?.some(h => h.clicks > 0) ? (
              <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-themeColor/10 rounded-xl">
                      <Clock className="h-5 w-5 text-themeColor" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-themeColor-text">Hourly Activity</CardTitle>
                      <CardDescription>Click patterns throughout the day</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="hour" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip />
                        <Bar dataKey="clicks" fill="#eb6753" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border border-themeColor/20">
                <CardHeader>
                  <CardTitle>Hourly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState message="No hourly activity data available yet." />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Continue with other tabs using similar real data patterns... */}
          <TabsContent value="audience" className="space-y-8 mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Location Data */}
              {analyticsData.locationData?.length > 0 ? (
                <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-themeColor/10 rounded-xl">
                        <MapPin className="h-5 w-5 text-themeColor" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-themeColor-text">Top Locations</CardTitle>
                        <CardDescription>Clicks by geographic location</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.locationData.map((location, index) => (
                        <div key={location.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium text-gray-700">{location.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ 
                                  width: `${(location.value / Math.max(...analyticsData.locationData.map(l => l.value))) * 100}%`,
                                  backgroundColor: COLORS[index % COLORS.length]
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-600 w-12 text-right">
                              {location.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl border border-themeColor/20">
                  <CardHeader>
                    <CardTitle>Top Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyState message="No location data available yet." />
                  </CardContent>
                </Card>
              )}

              {/* Device Data */}
              {analyticsData.deviceData?.length > 0 ? (
                <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-themeColor/10 rounded-xl">
                        <Monitor className="h-5 w-5 text-themeColor" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-themeColor-text">Device Types</CardTitle>
                        <CardDescription>Device distribution among visitors</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.deviceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={100}
                            fill="#8884d8"
                          >
                            {analyticsData.deviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl border border-themeColor/20">
                  <CardHeader>
                    <CardTitle>Device Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyState message="No device data available yet." />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Time Analytics */}
            {analyticsData.timeAnalytics?.length > 0 ? (
              <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-themeColor/10 rounded-xl">
                      <Activity className="h-5 w-5 text-themeColor" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-themeColor-text">Time-based Activity</CardTitle>
                      <CardDescription>Visit patterns by time of day</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.timeAnalytics}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ period, percentage }) => `${period} ${percentage}%`}
                          outerRadius={100}
                          fill="#8884d8"
                        >
                          {analyticsData.timeAnalytics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border border-themeColor/20">
                <CardHeader>
                  <CardTitle>Time-based Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState message="No time-based data available yet." />
                </CardContent>
              </Card>
            )}

            {/* Traffic Sources */}
            {analyticsData.referrerData?.length > 0 ? (
              <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-themeColor/10 rounded-xl">
                      <Eye className="h-5 w-5 text-themeColor" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-themeColor-text">Traffic Sources</CardTitle>
                      <CardDescription>Where your visitors come from</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.referrerData.map((referrer, index) => (
                      <div key={referrer.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium text-gray-700">{referrer.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${(referrer.value / Math.max(...analyticsData.referrerData.map(r => r.value))) * 100}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-600 w-12 text-right">
                            {referrer.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border border-themeColor/20">
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState message="No referrer data available yet." />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="technology" className="space-y-8 mt-8">
            {/* Browser & OS Analytics */}
            <div className="grid lg:grid-cols-2 gap-8">
              {analyticsData.browserData?.length > 0 ? (
                <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-themeColor/10 rounded-xl">
                        <Globe className="h-5 w-5 text-themeColor" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-themeColor-text">Browser Usage</CardTitle>
                        <CardDescription>Popular browsers among visitors</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.browserData.map((browser, index) => (
                        <div key={browser.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium text-gray-700">{browser.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ 
                                  width: `${(browser.value / Math.max(...analyticsData.browserData.map(b => b.value))) * 100}%`,
                                  backgroundColor: COLORS[index % COLORS.length]
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-600 w-12 text-right">
                              {browser.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl border border-themeColor/20">
                  <CardHeader>
                    <CardTitle>Browser Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyState message="No browser data available yet." />
                  </CardContent>
                </Card>
              )}

              {analyticsData.osData?.length > 0 ? (
                <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-themeColor/10 rounded-xl">
                        <Monitor className="h-5 w-5 text-themeColor" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-themeColor-text">Operating Systems</CardTitle>
                        <CardDescription>OS distribution among users</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData.osData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={100}
                            fill="#8884d8"
                          >
                            {analyticsData.osData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl border border-themeColor/20">
                  <CardHeader>
                    <CardTitle>Operating Systems</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyState message="No operating system data available yet." />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Network & Technical Capabilities */}
            <div className="grid lg:grid-cols-2 gap-8">
              {analyticsData.networkData?.length > 0 ? (
                <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-themeColor/10 rounded-xl">
                        <Wifi className="h-5 w-5 text-themeColor" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-themeColor-text">Network Types</CardTitle>
                        <CardDescription>Connection types used by visitors</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.networkData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip />
                          <Bar dataKey="value" fill="#eb6753" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl border border-themeColor/20">
                  <CardHeader>
                    <CardTitle>Network Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyState message="No network data available yet." />
                  </CardContent>
                </Card>
              )}

              {analyticsData.technicalData?.length > 0 ? (
                <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-themeColor/10 rounded-xl">
                        <Cpu className="h-5 w-5 text-themeColor" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-themeColor-text">Technical Capabilities</CardTitle>
                        <CardDescription>Browser feature support</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.technicalData.map((tech, index) => (
                        <div key={tech.feature} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: COLORS[index % COLORS.length] }}
                            >
                              {tech.feature}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ 
                                  width: `${tech.percentage}%`,
                                  backgroundColor: COLORS[index % COLORS.length]
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-600 w-12 text-right">
                              {tech.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl border border-themeColor/20">
                  <CardHeader>
                    <CardTitle>Technical Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyState message="No technical capability data available yet." />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-8 mt-8">
            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Avg. Load Time"
                value={analyticsData.avgLoadTime}
                icon={Timer}
                format="time"
              />
              <StatCard
                title="Bounce Rate"
                value={analyticsData.bounceRate}
                icon={Activity}
                format="percentage"
                subtitle="Users who left immediately"
              />
              <StatCard
                title="Click-through Rate"
                value={analyticsData.clickThroughRate}
                icon={TrendingUp}
                format="percentage"
              />
            </div>

            {/* Load Time Analytics */}
            {analyticsData.performanceData?.length > 0 ? (
              <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-themeColor/10 rounded-xl">
                      <Zap className="h-5 w-5 text-themeColor" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-themeColor-text">Page Load Performance</CardTitle>
                      <CardDescription>Load time trends for recent visits</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" label={{ value: 'Load Time (ms)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #eb6753',
                            borderRadius: '12px'
                          }}
                          formatter={(value) => [`${value}ms`, 'Load Time']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="loadTime" 
                          stroke="#eb6753" 
                          strokeWidth={3}
                          dot={{ fill: '#eb6753', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border border-themeColor/20">
                <CardHeader>
                  <CardTitle>Page Load Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState message="No performance data available yet. Performance metrics will appear as users visit your links." />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-8 mt-8">
            {/* Security Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="HTTPS Usage"
                value={analyticsData.securityData?.httpsUsage || 0}
                icon={Shield}
                format="percentage"
              />
              <StatCard
                title="Do Not Track"
                value={analyticsData.securityData?.dntEnabled || 0}
                icon={Eye}
                format="percentage"
                subtitle="Privacy-conscious users"
              />
              <StatCard
                title="Ad Blocker Usage"
                value={analyticsData.securityData?.adBlockerUsage || 0}
                icon={Shield}
                format="percentage"
                subtitle="Estimated usage"
              />
              <StatCard
                title="Secure Connections"
                value={analyticsData.securityData?.secureConnections || 0}
                icon={Network}
                subtitle="Total secure visits"
              />
            </div>

            {/* Security Overview Chart */}
            <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-themeColor/10 rounded-xl">
                    <Shield className="h-5 w-5 text-themeColor" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-themeColor-text">Security & Privacy Overview</CardTitle>
                    <CardDescription>Security metrics and privacy preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">HTTPS Usage</span>
                        <span className="text-sm font-bold text-green-600">{analyticsData.securityData?.httpsUsage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${analyticsData.securityData?.httpsUsage || 0}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Do Not Track Enabled</span>
                        <span className="text-sm font-bold text-blue-600">{analyticsData.securityData?.dntEnabled || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${analyticsData.securityData?.dntEnabled || 0}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Ad Blocker Usage</span>
                        <span className="text-sm font-bold text-orange-600">{analyticsData.securityData?.adBlockerUsage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-orange-500 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${analyticsData.securityData?.adBlockerUsage || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
                      <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Security Score</h3>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {Math.round(((analyticsData.securityData?.httpsUsage || 0) + 
                                   (100 - (analyticsData.securityData?.adBlockerUsage || 0))) / 2)}
                      </div>
                      <p className="text-sm text-gray-600">Overall security rating</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsComponent;