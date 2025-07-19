import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Calendar
} from "lucide-react";
import { useSession } from "next-auth/react";
import LoadingSpinner from "./ui/loading-spinner";

const AnalyticsComponent = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const { data: session } = useSession();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, session]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?range=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(processAnalyticsData(data));
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Fallback to mock data for demo
      setAnalyticsData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (rawData) => {
    // Process your real API data here
    const dailyClicks = processDailyClicks(rawData.visits || []);
    const deviceData = processDeviceData(rawData.visits || []);
    const locationData = processLocationData(rawData.visits || []);
    const browserData = processBrowserData(rawData.visits || []);
    const hourlyData = processHourlyData(rawData.visits || []);
    const referrerData = processReferrerData(rawData.visits || []);

    return {
      totalClicks: rawData.totalClicks || 0,
      uniqueVisitors: rawData.uniqueVisitors || 0,
      avgClicksPerDay: rawData.avgClicksPerDay || 0,
      clickThroughRate: rawData.clickThroughRate || 0,
      dailyClicks,
      deviceData,
      locationData,
      browserData,
      hourlyData,
      referrerData
    };
  };

  const processHourlyData = (visits) => {
    const hourlyStats = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      clicks: 0
    }));

    visits.forEach(visit => {
      const hour = new Date(visit.timestamp || Date.now()).getHours();
      hourlyStats[hour].clicks++;
    });

    return hourlyStats;
  };

  const processReferrerData = (visits) => {
    const referrerStats = {};
    visits.forEach(visit => {
      const referrer = visit.referrer === "Direct" ? "Direct" : 
                     visit.referrer ? new URL(visit.referrer).hostname : "Unknown";
      referrerStats[referrer] = (referrerStats[referrer] || 0) + 1;
    });

    return Object.entries(referrerStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const processDailyClicks = (visits) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        name: date.toLocaleDateString('en', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        clicks: 0
      };
    });

    visits.forEach(visit => {
      const visitDate = new Date(visit.timestamp || Date.now()).toISOString().split('T')[0];
      const dayIndex = last7Days.findIndex(day => day.date === visitDate);
      if (dayIndex !== -1) {
        last7Days[dayIndex].clicks++;
      }
    });

    return last7Days;
  };

  const processDeviceData = (visits) => {
    const deviceStats = { Desktop: 0, Mobile: 0, Tablet: 0 };
    visits.forEach(visit => {
      const device = visit.device || "Desktop";
      if (deviceStats[device] !== undefined) {
        deviceStats[device]++;
      }
    });

    return Object.entries(deviceStats).map(([name, value]) => ({ name, value }));
  };

  const processLocationData = (visits) => {
    const locationStats = {};
    visits.forEach(visit => {
      const location = visit.location?.split(',')[1]?.trim() || "Unknown";
      locationStats[location] = (locationStats[location] || 0) + 1;
    });

    return Object.entries(locationStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  const processBrowserData = (visits) => {
    const browserStats = {};
    visits.forEach(visit => {
      const browser = visit.browser || "Unknown";
      browserStats[browser] = (browserStats[browser] || 0) + 1;
    });

    return Object.entries(browserStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const getMockData = () => ({
    totalClicks: 1250,
    uniqueVisitors: 892,
    avgClicksPerDay: 178,
    clickThroughRate: 3.2,
    dailyClicks: [
      { name: "Mon", clicks: 120 },
      { name: "Tue", clicks: 150 },
      { name: "Wed", clicks: 180 },
      { name: "Thu", clicks: 190 },
      { name: "Fri", clicks: 210 },
      { name: "Sat", clicks: 170 },
      { name: "Sun", clicks: 140 },
    ],
    deviceData: [
      { name: "Desktop", value: 400 },
      { name: "Mobile", value: 600 },
      { name: "Tablet", value: 250 },
    ],
    locationData: [
      { name: "Mumbai", value: 320 },
      { name: "Delhi", value: 280 },
      { name: "Bangalore", value: 250 },
      { name: "Chennai", value: 180 },
      { name: "Pune", value: 150 },
    ],
    browserData: [
      { name: "Chrome", value: 450 },
      { name: "Safari", value: 320 },
      { name: "Firefox", value: 280 },
      { name: "Edge", value: 150 },
      { name: "Opera", value: 50 },
    ],
    hourlyData: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      clicks: Math.floor(Math.random() * 50) + 10
    })),
    referrerData: [
      { name: "Google", value: 450 },
      { name: "Direct", value: 320 },
      { name: "Facebook", value: 180 },
      { name: "Twitter", value: 120 },
      { name: "LinkedIn", value: 80 },
    ]
  });

  const COLORS = ["#eb6753", "#f18a76", "#f7bbae", "#fbdcd5", "#fdf0ed"];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle }) => (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/10 hover:shadow-lg hover:shadow-themeColor/10 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-themeColor-text">{value}</p>
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
        <LoadingSpinner />
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
          <p className="text-gray-600 mt-1">Comprehensive insights into your link performance</p>
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

      {/* Overview Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clicks"
            value={analyticsData?.totalClicks?.toLocaleString() || "0"}
            icon={MousePointer}
            trend={true}
            trendValue="+12.5% from last week"
          />
          <StatCard
            title="Unique Visitors"
            value={analyticsData?.uniqueVisitors?.toLocaleString() || "0"}
            icon={Users}
            trend={true}
            trendValue="+8.2% from last week"
          />
          <StatCard
            title="Avg. Daily Clicks"
            value={analyticsData?.avgClicksPerDay?.toLocaleString() || "0"}
            icon={Calendar}
            subtitle="Last 7 days"
          />
          <StatCard
            title="Click-through Rate"
            value={`${analyticsData?.clickThroughRate || 0}%`}
            icon={TrendingUp}
            trend={true}
            trendValue="+0.5% from last week"
          />
        </div>
      </motion.div>

      {/* Click Analytics */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-themeColor/10 rounded-xl">
                <BarChart2 className="h-5 w-5 text-themeColor" />
              </div>
              <div>
                <CardTitle className="text-xl text-themeColor-text">Click Analytics</CardTitle>
                <CardDescription>Daily click performance over time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData?.dailyClicks || []}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eb6753" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#eb6753" stopOpacity={0}/>
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
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Device & Location Analytics */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-themeColor/10 rounded-xl">
                  <Smartphone className="h-5 w-5 text-themeColor" />
                </div>
                <div>
                  <CardTitle className="text-xl text-themeColor-text">Device Types</CardTitle>
                  <CardDescription>Click distribution by device</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData?.deviceData || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                    >
                      {(analyticsData?.deviceData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
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
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData?.locationData || []} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#666" />
                    <YAxis dataKey="name" type="category" stroke="#666" width={80} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #eb6753',
                        borderRadius: '12px'
                      }}
                    />
                    <Bar dataKey="value" fill="#eb6753" radius={[4, 4, 4, 4]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Hourly Activity */}
      <motion.div variants={itemVariants}>
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
                <BarChart data={analyticsData?.hourlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #eb6753',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="clicks" fill="#eb6753" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Browser & Referrer Analytics */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
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
                {(analyticsData?.browserData || []).map((browser, index) => (
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
                            width: `${(browser.value / Math.max(...(analyticsData?.browserData || []).map(b => b.value))) * 100}%`,
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
        </motion.div>

        <motion.div variants={itemVariants}>
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
                {(analyticsData?.referrerData || []).map((referrer, index) => (
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
                            width: `${(referrer.value / Math.max(...(analyticsData?.referrerData || []).map(r => r.value))) * 100}%`,
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
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsComponent;