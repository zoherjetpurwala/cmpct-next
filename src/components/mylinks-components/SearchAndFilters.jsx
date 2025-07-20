import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  CalendarIcon,
  BarChart2,
  Settings,
  RefreshCw,
  ChevronDown,
  X
} from "lucide-react";

export const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  selectedFilters,
  setSelectedFilters,
  viewMode,
  setViewMode,
  refreshLinks
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by URL, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-themeColor/30">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={selectedFilters.status}
                    onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, status: value }))}
                  >
                    <DropdownMenuRadioItem value="all">All Links</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="inactive">Inactive</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="popular">Popular</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="recent">Recent</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-themeColor/30">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Date
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={selectedFilters.dateRange}
                    onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, dateRange: value }))}
                  >
                    <DropdownMenuRadioItem value="all">All Time</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="today">Today</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="week">This Week</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="month">This Month</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="year">This Year</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-themeColor/30">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Clicks
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={selectedFilters.clicks}
                    onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, clicks: value }))}
                  >
                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="none">No Clicks</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="low">1-10 Clicks</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="medium">11-100 Clicks</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="high">100+ Clicks</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-themeColor/30">
                    <Settings className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={viewMode} onValueChange={setViewMode}>
                    <DropdownMenuRadioItem value="table">Table View</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="grid">Grid View</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="compact">Compact View</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={refreshLinks}
                variant="outline"
                className="border-themeColor/30"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedFilters.status !== "all" || selectedFilters.dateRange !== "all" || selectedFilters.clicks !== "all" || searchTerm) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                </Badge>
              )}
              {selectedFilters.status !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {selectedFilters.status}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedFilters(prev => ({ ...prev, status: "all" }))} />
                </Badge>
              )}
              {selectedFilters.dateRange !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Date: {selectedFilters.dateRange}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedFilters(prev => ({ ...prev, dateRange: "all" }))} />
                </Badge>
              )}
              {selectedFilters.clicks !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Clicks: {selectedFilters.clicks}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedFilters(prev => ({ ...prev, clicks: "all" }))} />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFilters({ status: "all", dateRange: "all", clicks: "all", tags: [] });
                }}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};