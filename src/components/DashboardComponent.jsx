import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  Copy,
  ExternalLink,
  BarChart2,
  Link as LinkIcon,
  MoreHorizontal,
  Trash2,
  Edit,
  Calendar,
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  Check,
  Eye,
  QrCode,
} from "lucide-react";
import { useLinkManagement } from "@/hooks/useLinkManagement";
import { useSession } from "next-auth/react";
import LoadingSpinner from "./ui/loading-spinner";

const DashboardComponent = () => {
  const [formData, setFormData] = useState({ longUrl: "", header: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [copiedStates, setCopiedStates] = useState({});
  const [showAll, setShowAll] = useState(false);
  
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
          createdAt: new Date().toISOString(),
          header: formData.header || "Untitled",
        });
        setFormData({ longUrl: "", header: "" });
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

  const copyToClipboard = async (text, linkId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [linkId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [linkId]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const openLink = (url) => window.open(url, "_blank");

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedAndFilteredLinks = () => {
    let filtered = shortenedLinks.filter(link => {
      const searchLower = searchTerm.toLowerCase();
      return (
        link.original.toLowerCase().includes(searchLower) ||
        link.shortened.toLowerCase().includes(searchLower) ||
        (link.header && link.header.toLowerCase().includes(searchLower))
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'createdAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return showAll ? filtered : filtered.slice(0, 5);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTruncatedUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const getClicksBadgeColor = (clicks) => {
    if (clicks === 0) return "secondary";
    if (clicks < 10) return "default";
    if (clicks < 50) return "secondary";
    return "default";
  };

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <Card className="rounded-2xl border border-blue-800/25 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {trend && <TrendingUp className="h-3 w-3 text-green-500" />}
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  const totalClicks = shortenedLinks.reduce((acc, link) => acc + link.clicks, 0);
  const avgClicks = shortenedLinks.length > 0 ? (totalClicks / shortenedLinks.length).toFixed(1) : 0;
  const sortedAndFilteredLinks = getSortedAndFilteredLinks();

  return (
    <TooltipProvider>
      <Card className="rounded-2xl border border-blue-800/25 mb-4">
        <CardHeader>
          <CardTitle>Shorten a URL</CardTitle>
          <CardDescription>
            Enter a long URL to create a compact version
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex max-md:flex-col max-md:w-full gap-2"
          >
            <Input
              name="longUrl"
              placeholder="Enter your long URL"
              className="flex-grow md:w-4/6"
              value={formData.longUrl}
              onChange={handleInputChange}
              required
            />
            <Input
              name="header"
              placeholder="Enter your header"
              className="flex-grow md:w-1/6"
              value={formData.header}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              className="bg-blue-950 hover:bg-blue-700 md:w-1/6"
            >
              <span>Compact</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Links"
              value={shortenedLinks.length}
              icon={LinkIcon}
            />
            <StatCard
              title="Total Clicks"
              value={totalClicks}
              icon={BarChart2}
              trend={totalClicks > 0}
            />
            <StatCard
              title="Avg. Clicks per Link"
              value={avgClicks}
              icon={BarChart2}
            />
          </div>

          <Card className="rounded-2xl border border-blue-800/25">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Recent Links</CardTitle>
                  <CardDescription>
                    Your most recently created compact links
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search links..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  {shortenedLinks.length > 5 && (
                    <Button
                      variant="outline"
                      onClick={() => setShowAll(!showAll)}
                      size="sm"
                    >
                      {showAll ? 'Show Less' : `Show All (${shortenedLinks.length})`}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-full hidden md:table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('header')}
                          className="h-auto p-0 font-semibold"
                        >
                          Title
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Original URL</TableHead>
                      <TableHead>Shortened URL</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('clicks')}
                          className="h-auto p-0 font-semibold"
                        >
                          Clicks
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('createdAt')}
                          className="h-auto p-0 font-semibold"
                        >
                          Created
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {sortedAndFilteredLinks.map((link, index) => (
                        <motion.tr
                          key={`${link.shortened}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span className="truncate max-w-[120px]">
                                {link.header || 'Untitled'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-2">
                                  <span className="truncate max-w-[200px] text-blue-600 hover:text-blue-800">
                                    {getTruncatedUrl(link.original)}
                                  </span>
                                  <ExternalLink 
                                    className="h-3 w-3 opacity-50 hover:opacity-100 cursor-pointer"
                                    onClick={() => openLink(link.original)}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs break-all">{link.original}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                {getTruncatedUrl(link.shortened, 25)}
                              </code>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getClicksBadgeColor(link.clicks)} className="font-mono">
                              {link.clicks}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(link.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(link.shortened, `${link.shortened}-${index}`)}
                                    className="h-8 w-8 p-0"
                                  >
                                    {copiedStates[`${link.shortened}-${index}`] ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{copiedStates[`${link.shortened}-${index}`] ? 'Copied!' : 'Copy link'}</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openLink(link.shortened)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Open link</p>
                                </TooltipContent>
                              </Tooltip>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => copyToClipboard(link.original, `orig-${index}`)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy original URL
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Generate QR Code
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit title
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>

                {/* Mobile view - Enhanced */}
                <div className="md:hidden space-y-4">
                  <AnimatePresence>
                    {sortedAndFilteredLinks.map((link, index) => (
                      <motion.div
                        key={`mobile-${link.shortened}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="border rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{link.header || 'Untitled'}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(link.createdAt)}
                            </p>
                          </div>
                          <Badge variant={getClicksBadgeColor(link.clicks)} className="font-mono">
                            {link.clicks} clicks
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-1">Original URL:</div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-blue-600 break-all">
                                {getTruncatedUrl(link.original, 50)}
                              </span>
                              <ExternalLink 
                                className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer flex-shrink-0"
                                onClick={() => openLink(link.original)}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-1">Shortened URL:</div>
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm block">
                              {link.shortened}
                            </code>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(link.shortened, `mobile-${index}`)}
                              className="flex-1"
                            >
                              {copiedStates[`mobile-${index}`] ? (
                                <>
                                  <Check className="mr-2 h-4 w-4 text-green-500" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openLink(link.shortened)}
                              className="flex-1"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <QrCode className="mr-2 h-4 w-4" />
                                  QR Code
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {sortedAndFilteredLinks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No links found matching your search.' : 'No links created yet.'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </TooltipProvider>
  );
};

export default DashboardComponent;