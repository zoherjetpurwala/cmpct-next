import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, SortAsc, SortDesc } from "lucide-react";

export const getPerformanceBadge = (clicks) => {
  if (clicks === 0) return <Badge variant="secondary">No clicks</Badge>;
  if (clicks <= 10) return <Badge variant="outline" className="text-yellow-700 border-yellow-300">Low</Badge>;
  if (clicks <= 100) return <Badge variant="outline" className="text-blue-700 border-blue-300">Medium</Badge>;
  return <Badge className="bg-green-600">High</Badge>;
};

export const getSortIcon = (column, sortConfig) => {
  if (sortConfig.key !== column) return <ArrowUpDown className="h-4 w-4" />;
  return sortConfig.direction === "asc" ? 
    <SortAsc className="h-4 w-4" /> : 
    <SortDesc className="h-4 w-4" />;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
