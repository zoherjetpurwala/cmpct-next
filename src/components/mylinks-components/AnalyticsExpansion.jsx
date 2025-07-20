import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  X,
  Activity,
  Users,
  MapPin,
  Clock,
  Download,
  Share2,
  Monitor,
  Smartphone,
  Tablet,
  Globe
} from "lucide-react";

export const AnalyticsExpansion = ({ showAnalytics, setShowAnalytics, shortenedLinks, formatDate }) => (
  <AnimatePresence>
    {Object.entries(showAnalytics).map(([linkId, isVisible]) => {
      if (!isVisible) return null;
      const link = shortenedLinks.find(l => l.id === linkId);
      if (!link) return null;

      return (
        <motion.div
          key={linkId}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-themeColor/10 rounded-lg">
                    <BarChart2 className="h-5 w-5 text-themeColor" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Analytics for {link.title || "Link"}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {link.shortened.replace(/^https?:\/\//, '')}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnalytics(prev => ({ ...prev, [linkId]: false }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Total Clicks</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mt-2">
                    {link.clicks || 0}
                  </div>
                  <div className="text-sm text-blue-700">
                    +{Math.floor(Math.random() * 20)} today
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-900">Unique Visitors</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 mt-2">
                    {Math.floor((link.clicks || 0) * 0.7)}
                  </div>
                  <div className="text-sm text-green-700">
                    70% unique rate
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">Top Location</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900 mt-2">
                    US
                  </div>
                  <div className="text-sm text-purple-700">
                    45% of traffic
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-orange-900">Avg. Time</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900 mt-2">
                    2.3s
                  </div>
                  <div className="text-sm text-orange-700">
                    page load time
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Device Types
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: "Desktop", percentage: 65, icon: Monitor },
                      { name: "Mobile", percentage: 30, icon: Smartphone },
                      { name: "Tablet", percentage: 5, icon: Tablet }
                    ].map((device) => (
                      <div key={device.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <device.icon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">{device.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-themeColor rounded-full"
                              style={{ width: `${device.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{device.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Top Referrers
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: "Direct", count: Math.floor((link.clicks || 0) * 0.4) },
                      { name: "Google", count: Math.floor((link.clicks || 0) * 0.3) },
                      { name: "Twitter", count: Math.floor((link.clicks || 0) * 0.2) },
                      { name: "Other", count: Math.floor((link.clicks || 0) * 0.1) }
                    ].map((referrer) => (
                      <div key={referrer.name} className="flex items-center justify-between">
                        <span className="text-sm">{referrer.name}</span>
                        <span className="text-sm font-medium">{referrer.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Created {formatDate(link.createdAt)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    })}
  </AnimatePresence>
);