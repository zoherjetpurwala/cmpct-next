import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  Copy,
  ExternalLink,
  BarChart2,
  Link as LinkIcon,
  TrendingUp,
  Globe,
  Zap,
  CheckCircle
} from "lucide-react";
import { useLinkManagement } from "@/hooks/useLinkManagement";
import { useSession } from "next-auth/react";
import LoadingSpinner from "./ui/loading-spinner";

const DashboardComponent = () => {
  const [formData, setFormData] = useState({ longUrl: "", header: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { shortenedLinks, isLoading, error, fetchUserLinks, addNewLink } =
    useLinkManagement();
  const { data: session } = useSession();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "longUrl") {
      const normalizedValue = value.trim(); 
      if (normalizedValue && !/^https?:\/\//i.test(normalizedValue)) {
        setFormData((prevData) => ({
          ...prevData,
          longUrl: `https://${normalizedValue}`,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          longUrl: normalizedValue,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/v1/compact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();
      if (data.shortUrl) {
        addNewLink({
          original: formData.longUrl,
          shortened: data.shortUrl,
          clicks: 0,
        });
        setFormData({ longUrl: "", header: "" });
        toast.success("Link shortened successfully!");
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
      toast.error("Failed to shorten URL. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy link");
    }
  };

  const openLink = (url) => window.open(url, "_blank");

  const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/10 hover:shadow-lg hover:shadow-themeColor/10 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
          <div className="p-2 bg-themeColor/10 rounded-xl">
            <Icon className="h-4 w-4 text-themeColor" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-themeColor-text">{value}</div>
          {trend && (
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>{trendValue} from last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const totalClicks = shortenedLinks.reduce((acc, link) => acc + link.clicks, 0);
  const avgClicks = shortenedLinks.length > 0 ? (totalClicks / shortenedLinks.length).toFixed(1) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* URL Shortener Card */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-themeColor/10 rounded-xl">
                <Zap className="h-6 w-6 text-themeColor" />
              </div>
              <div>
                <CardTitle className="text-xl text-themeColor-text">Shorten a URL</CardTitle>
                <CardDescription className="text-gray-600">
                  Transform your long URLs into compact, trackable links
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    name="longUrl"
                    placeholder="https://example.com/very-long-url"
                    className="h-12 border-gray-300 focus:border-themeColor focus:ring-themeColor/20 rounded-xl"
                    value={formData.longUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="md:w-48">
                  <Input
                    name="header"
                    placeholder="Custom header (optional)"
                    className="h-12 border-gray-300 focus:border-themeColor focus:ring-themeColor/20 rounded-xl"
                    value={formData.header}
                    onChange={handleInputChange}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 bg-themeColor hover:bg-themeColor-dark text-white font-medium rounded-xl shadow-lg shadow-themeColor/25 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Compact
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border border-red-200 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-600">Error: {error}</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Stats Grid */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Links"
                value={shortenedLinks.length}
                icon={LinkIcon}
                trend={true}
                trendValue="+12%"
              />
              <StatCard
                title="Total Clicks"
                value={totalClicks.toLocaleString()}
                icon={BarChart2}
                trend={true}
                trendValue="+24%"
              />
              <StatCard
                title="Avg. Clicks per Link"
                value={avgClicks}
                icon={TrendingUp}
                trend={true}
                trendValue="+8%"
              />
            </div>
          </motion.div>

          {/* Recent Links Table */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-themeColor/10 rounded-xl">
                    <Globe className="h-5 w-5 text-themeColor" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-themeColor-text">Recent Links</CardTitle>
                    <CardDescription className="text-gray-600">
                      Your most recently created compact links
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {shortenedLinks.length === 0 ? (
                  <div className="text-center py-12">
                    <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No links yet</h3>
                    <p className="text-gray-500">Create your first short link above to get started!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Desktop Table */}
                    <Table className="min-w-full hidden md:table">
                      <TableHeader>
                        <TableRow className="border-themeColor/10">
                          <TableHead className="text-themeColor-text font-semibold">Original URL</TableHead>
                          <TableHead className="text-themeColor-text font-semibold">Shortened URL</TableHead>
                          <TableHead className="text-themeColor-text font-semibold">Clicks</TableHead>
                          <TableHead className="text-themeColor-text font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shortenedLinks.slice(0, 5).map((link, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="hover:bg-themeColor-light/10 transition-colors"
                          >
                            <TableCell className="font-medium max-w-[300px] truncate">
                              <div className="flex items-center gap-2">
                                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="truncate" title={link.original}>
                                  {link.original}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              <div className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-themeColor flex-shrink-0" />
                                <span className="text-themeColor font-medium truncate" title={link.shortened}>
                                  {link.shortened}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold">{link.clicks}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(link.shortened)}
                                  className="border-themeColor/30 text-themeColor hover:bg-themeColor hover:text-white transition-all duration-200"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openLink(link.shortened)}
                                  className="border-themeColor/30 text-themeColor hover:bg-themeColor hover:text-white transition-all duration-200"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                      {shortenedLinks.slice(0, 5).map((link, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-themeColor/20 p-4 rounded-xl bg-gradient-to-br from-white to-themeColor-light/5"
                        >
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-600 mb-1">Original URL:</div>
                              <div className="flex items-center gap-2">
                                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div className="truncate text-sm" title={link.original}>
                                  {link.original}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium text-gray-600 mb-1">Shortened URL:</div>
                              <div className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-themeColor flex-shrink-0" />
                                <div className="text-themeColor font-medium truncate text-sm" title={link.shortened}>
                                  {link.shortened}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-semibold">{link.clicks} clicks</span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(link.shortened)}
                                  className="border-themeColor/30 text-themeColor hover:bg-themeColor hover:text-white"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openLink(link.shortened)}
                                  className="border-themeColor/30 text-themeColor hover:bg-themeColor hover:text-white"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default DashboardComponent;