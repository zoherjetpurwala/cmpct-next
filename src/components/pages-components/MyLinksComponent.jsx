import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LinkIcon, Plus, Download, FileText, ChevronDown, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useLinkManagement } from "@/hooks/useLinkManagement";
import LoadingSpinner from "../common/LoadingComponent";

// Import modular components
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFiltering } from "@/hooks/useFiltering";
import { StatsOverview } from "@/components/mylinks-components/StatsOverview";
import { SearchAndFilters } from "@/components/mylinks-components/SearchAndFilters";
import { BulkActionsBar } from "@/components/mylinks-components/BulkActionsBar";
import { LinkTableView } from "@/components/mylinks-components/LinkTableView";
import { LinkGridView } from "@/components/mylinks-components/LinkGridView";
import { LinkCompactView } from "@/components/mylinks-components/LinkCompactView";
import { Pagination } from "@/components/mylinks-components/Pagination";
import { EditLinkDialog } from "@/components/mylinks-components/EditLinkDialog";
import { AnalyticsExpansion } from "@/components/mylinks-components/AnalyticsExpansion";
import { getPerformanceBadge, getSortIcon, formatDate } from "@/utils/linkUtils";

const MyLinksComponent = () => {
  const { shortenedLinks, isLoading, error, refreshLinks, deleteLink, updateLink } = useLinkManagement();
  
  // State management - ALL HOOKS MUST BE AT THE TOP
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    dateRange: "all",
    clicks: "all",
    tags: []
  });
  const [selectedLinks, setSelectedLinks] = useState(new Set());
  const [copiedLinkId, setCopiedLinkId] = useState("");
  const [viewMode, setViewMode] = useState("table"); // table, grid, compact
  const [showAnalytics, setShowAnalytics] = useState({});
  const [editingLink, setEditingLink] = useState(null);
  const [bulkAction, setBulkAction] = useState("");

  // Use custom hooks
  const { analytics, isRecent } = useAnalytics(shortenedLinks);
  const processedLinks = useFiltering(shortenedLinks, searchTerm, selectedFilters, sortConfig, isRecent);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLinks = processedLinks.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(processedLinks.length / itemsPerPage);

  // Utility functions
  const copyToClipboard = useCallback(async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLinkId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedLinkId(""), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  }, []);

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      setSelectedLinks(new Set(paginatedLinks.map(link => link.id)));
    } else {
      setSelectedLinks(new Set());
    }
  }, [paginatedLinks]);

  const handleSelectLink = useCallback((linkId, checked) => {
    const newSelected = new Set(selectedLinks);
    if (checked) {
      newSelected.add(linkId);
    } else {
      newSelected.delete(linkId);
    }
    setSelectedLinks(newSelected);
  }, [selectedLinks]);

  const handleBulkAction = useCallback(async (action) => {
    const selectedLinkIds = Array.from(selectedLinks);
    try {
      switch (action) {
        case "delete":
          await Promise.all(selectedLinkIds.map(id => deleteLink(id)));
          toast.success(`Deleted ${selectedLinkIds.length} links`);
          break;
        case "archive":
          toast.success(`Archived ${selectedLinkIds.length} links`);
          break;
        case "export":
          toast.success(`Exported ${selectedLinkIds.length} links`);
          break;
      }
      setSelectedLinks(new Set());
    } catch (error) {
      toast.error("Bulk action failed");
    }
  }, [selectedLinks, deleteLink]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="rounded-xl animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <LoadingSpinner size="lg" message="Loading your links..." variant="dashboard" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="rounded-2xl border border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load links</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={refreshLinks}
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Stats Overview */}
        <StatsOverview analytics={analytics} shortenedLinks={shortenedLinks} />

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          refreshLinks={refreshLinks}
        />

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedLinks={selectedLinks}
          handleBulkAction={handleBulkAction}
          setSelectedLinks={setSelectedLinks}
        />

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-themeColor/10 rounded-xl">
                    <LinkIcon className="h-6 w-6 text-themeColor" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-themeColor-text">
                      My Links {processedLinks.length > 0 && `(${processedLinks.length})`}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage and track all your shortened links with advanced analytics
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-themeColor/30">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Export as CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Export as JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button className="bg-themeColor hover:bg-themeColor-dark text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Link
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {processedLinks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <LinkIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    {searchTerm || Object.values(selectedFilters).some(f => f !== "all" && f.length > 0) 
                      ? "No links found" 
                      : "No links yet"
                    }
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || Object.values(selectedFilters).some(f => f !== "all" && f.length > 0)
                      ? "Try adjusting your search or filter criteria" 
                      : "Create your first short link to get started!"
                    }
                  </p>
                  {!(searchTerm || Object.values(selectedFilters).some(f => f !== "all" && f.length > 0)) && (
                    <Button className="bg-themeColor hover:bg-themeColor-dark text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Link
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Table View */}
                  {viewMode === "table" && (
                    <LinkTableView
                      paginatedLinks={paginatedLinks}
                      selectedLinks={selectedLinks}
                      handleSelectAll={handleSelectAll}
                      handleSelectLink={handleSelectLink}
                      getSortIcon={(column) => getSortIcon(column, sortConfig)}
                      handleSort={handleSort}
                      formatDate={formatDate}
                      isRecent={isRecent}
                      getPerformanceBadge={getPerformanceBadge}
                      copyToClipboard={copyToClipboard}
                      copiedLinkId={copiedLinkId}
                      setShowAnalytics={setShowAnalytics}
                      setEditingLink={setEditingLink}
                      deleteLink={deleteLink}
                    />
                  )}

                  {/* Grid View */}
                  {viewMode === "grid" && (
                    <LinkGridView
                      paginatedLinks={paginatedLinks}
                      selectedLinks={selectedLinks}
                      handleSelectLink={handleSelectLink}
                      isRecent={isRecent}
                      getPerformanceBadge={getPerformanceBadge}
                      copyToClipboard={copyToClipboard}
                      copiedLinkId={copiedLinkId}
                      formatDate={formatDate}
                    />
                  )}

                  {/* Compact View */}
                  {viewMode === "compact" && (
                    <LinkCompactView
                      paginatedLinks={paginatedLinks}
                      selectedLinks={selectedLinks}
                      handleSelectLink={handleSelectLink}
                      isRecent={isRecent}
                      copyToClipboard={copyToClipboard}
                      copiedLinkId={copiedLinkId}
                      formatDate={formatDate}
                    />
                  )}

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    processedLinks={processedLinks}
                    startIndex={startIndex}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Link Dialog */}
        <EditLinkDialog 
          editingLink={editingLink} 
          setEditingLink={setEditingLink} 
        />

        {/* Analytics Expansion */}
        <AnalyticsExpansion
          showAnalytics={showAnalytics}
          setShowAnalytics={setShowAnalytics}
          shortenedLinks={shortenedLinks}
          formatDate={formatDate}
        />
      </motion.div>
    </TooltipProvider>
  );
};

export default MyLinksComponent;