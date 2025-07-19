import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Copy,
  ExternalLink,
  ArrowUpDown,
  ArrowLeft,
  ArrowRight,
  Search,
  BarChart2,
  Link as LinkIcon,
  Calendar,
  TrendingUp,
  Filter,
  Download,
  CheckCircle,
  Edit3,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLinkManagement } from "@/hooks/useLinkManagement";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "./ui/loading-spinner";

const MyLinksComponent = () => {
  const { shortenedLinks, isLoading, error } = useLinkManagement();
  const [sortConfig, setSortConfig] = useState({
    key: "clicks",
    direction: "descending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [copiedLinkId, setCopiedLinkId] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl border border-red-200 bg-red-50">
        <CardContent className="p-6">
          <p className="text-red-600">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const copyToClipboard = async (link, index) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLinkId(index);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedLinkId(""), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const sortedLinks = [...shortenedLinks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredLinks = sortedLinks.filter((link) => {
    const matchesSearch = 
      link.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.shortened.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterBy === "all" ||
      (filterBy === "high-traffic" && link.clicks > 50) ||
      (filterBy === "recent" && isRecent(link.createdAt)) ||
      (filterBy === "low-traffic" && link.clicks <= 10);
    
    return matchesSearch && matchesFilter;
  });

  const isRecent = (dateString) => {
    const date = new Date(dateString || Date.now());
    const now = new Date();
    const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLinks = filteredLinks.slice(startIndex, startIndex + itemsPerPage);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const totalClicks = shortenedLinks.reduce((sum, link) => sum + link.clicks, 0);

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Overview */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Links</p>
                  <p className="text-2xl font-bold text-themeColor-text">{shortenedLinks.length}</p>
                </div>
                <LinkIcon className="h-8 w-8 text-themeColor/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-themeColor-text">{totalClicks.toLocaleString()}</p>
                </div>
                <BarChart2 className="h-8 w-8 text-themeColor/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Clicks</p>
                  <p className="text-2xl font-bold text-themeColor-text">
                    {shortenedLinks.length > 0 ? Math.round(totalClicks / shortenedLinks.length) : 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-themeColor/60" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-themeColor-text">
                    {shortenedLinks.filter(link => isRecent(link.createdAt)).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-themeColor/60" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Table Card */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-themeColor/10 rounded-xl">
                  <LinkIcon className="h-6 w-6 text-themeColor" />
                </div>
                <div>
                  <CardTitle className="text-xl text-themeColor-text">My Links</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage and track all your shortened links
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-themeColor/30 text-themeColor hover:bg-themeColor hover:text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by URL or short code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
                />
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-[200px] border-gray-300 focus:border-themeColor">
                  <Filter className="h-4 w-4 mr-2 text-themeColor" />
                  <SelectValue placeholder="Filter links" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Links</SelectItem>
                  <SelectItem value="recent">Recent (7 days)</SelectItem>
                  <SelectItem value="high-traffic">High Traffic (50+ clicks)</SelectItem>
                  <SelectItem value="low-traffic">Low Traffic (≤10 clicks)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paginatedLinks.length === 0 ? (
              <div className="text-center py-12">
                <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {searchTerm || filterBy !== "all" ? "No links found" : "No links yet"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || filterBy !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Create your first short link to get started!"
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-5/12">
                          <Button
                            variant="ghost"
                            onClick={() => requestSort("original")}
                            className="hover:bg-themeColor/10 text-themeColor-text font-semibold"
                          >
                            Original URL 
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="w-3/12">
                          <Button
                            variant="ghost"
                            onClick={() => requestSort("shortened")}
                            className="hover:bg-themeColor/10 text-themeColor-text font-semibold"
                          >
                            Short URL 
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="w-2/12">
                          <Button 
                            variant="ghost" 
                            onClick={() => requestSort("clicks")}
                            className="hover:bg-themeColor/10 text-themeColor-text font-semibold"
                          >
                            Clicks 
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="w-2/12 text-themeColor-text font-semibold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {paginatedLinks.map((link, index) => (
                          <motion.tr
                            key={`${link.shortened}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-themeColor-light/10 transition-colors"
                          >
                            <TableCell className="max-w-0">
                              <div className="flex items-center gap-3">
                                <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <div className="truncate">
                                  <div className="truncate font-medium" title={link.original}>
                                    {link.original}
                                  </div>
                                  {isRecent(link.createdAt) && (
                                    <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                                      New
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-0">
                              <div className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4 text-themeColor flex-shrink-0" />
                                <span className="text-themeColor font-medium truncate" title={link.shortened}>
                                  {link.shortened}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <BarChart2 className="h-4 w-4 text-gray-400" />
                                <span className="font-semibold">{link.clicks}</span>
                                {link.clicks > 50 && (
                                  <Badge className="bg-themeColor text-white">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(link.shortened, `${link.shortened}-${index}`)}
                                  className="border-themeColor/30 text-themeColor hover:bg-themeColor hover:text-white transition-all duration-200"
                                >
                                  {copiedLinkId === `${link.shortened}-${index}` ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(link.shortened, "_blank")}
                                  className="border-themeColor/30 text-themeColor hover:bg-themeColor hover:text-white transition-all duration-200"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  <AnimatePresence>
                    {paginatedLinks.map((link, index) => (
                      <motion.div
                        key={`${link.shortened}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border border-themeColor/20 p-4 rounded-xl bg-gradient-to-br from-white to-themeColor-light/5"
                      >
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                              <ExternalLink className="h-4 w-4" />
                              Original URL
                              {isRecent(link.createdAt) && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <div className="truncate text-sm" title={link.original}>
                              {link.original}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                              <LinkIcon className="h-4 w-4 text-themeColor" />
                              Short URL
                            </div>
                            <div className="text-themeColor font-medium truncate text-sm" title={link.shortened}>
                              {link.shortened}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BarChart2 className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-semibold">{link.clicks} clicks</span>
                              {link.clicks > 50 && (
                                <Badge className="bg-themeColor text-white text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(link.shortened, `${link.shortened}-${index}`)}
                                className="border-themeColor/30 text-themeColor hover:bg-themeColor hover:text-white"
                              >
                                {copiedLinkId === `${link.shortened}-${index}` ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(link.shortened, "_blank")}
                                className="border-themeColor/30 text-themeColor hover:bg-themeColor hover:text-white"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <Select
                      value={String(itemsPerPage)}
                      onValueChange={(value) => setItemsPerPage(Number(value))}
                    >
                      <SelectTrigger className="w-[140px] border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 per page</SelectItem>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="20">20 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLinks.length)} of {filteredLinks.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="border-gray-300"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={currentPage === pageNum ? "bg-themeColor" : "border-gray-300"}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="border-gray-300"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MyLinksComponent;