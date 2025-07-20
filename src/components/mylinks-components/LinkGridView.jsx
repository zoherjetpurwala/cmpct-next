import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LinkIcon,
  BarChart2,
  Copy,
  CheckCircle,
  ExternalLink,
  MoreHorizontal,
  Edit3,
  QrCode,
  Trash2
} from "lucide-react";

export const LinkGridView = ({
  paginatedLinks,
  selectedLinks,
  handleSelectLink,
  isRecent,
  getPerformanceBadge,
  copyToClipboard,
  copiedLinkId,
  formatDate
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <AnimatePresence mode="popLayout">
      {paginatedLinks.map((link, index) => (
        <div
          key={`${link.id || link.shortened}-${index}`}
          className="border border-themeColor/20 p-6 rounded-xl bg-gradient-to-br from-white to-themeColor-light/5 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-themeColor/10 rounded-lg">
                <LinkIcon className="h-5 w-5 text-themeColor" />
              </div>
              <div className="flex flex-col">
                {isRecent(link.createdAt) && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs mb-1 w-fit">
                    New
                  </Badge>
                )}
                {getPerformanceBadge(link.clicks || 0)}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Checkbox
                checked={selectedLinks.has(link.id)}
                onCheckedChange={(checked) => handleSelectLink(link.id, checked)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">
                {link.title || "Original URL"}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm text-gray-900 truncate cursor-pointer hover:text-themeColor">
                    {link.original}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs break-all">{link.original}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">Short URL</div>
              <div 
                className="text-themeColor font-medium text-sm truncate cursor-pointer hover:underline"
                onClick={() => copyToClipboard(link.shortened, link.id)}
              >
                {link.shortened.replace(/^https?:\/\//, '')}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-semibold">{link.clicks || 0} clicks</span>
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(link.createdAt).split(',')[0]}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(link.shortened, link.id)}
                className="flex-1 border-themeColor/30 text-themeColor hover:bg-themeColor hover:text-white"
              >
                {copiedLinkId === link.id ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy
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
      ))}
    </AnimatePresence>
  </div>
);