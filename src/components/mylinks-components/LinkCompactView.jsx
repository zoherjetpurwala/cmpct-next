import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Trash2
} from "lucide-react";

export const LinkCompactView = ({
  paginatedLinks,
  selectedLinks,
  handleSelectLink,
  isRecent,
  copyToClipboard,
  copiedLinkId,
  formatDate
}) => (
  <div className="space-y-2">
    <AnimatePresence mode="popLayout">
      {paginatedLinks.map((link, index) => (
        <div
          key={`${link.id || link.shortened}-${index}`}
          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-themeColor-light/5 transition-colors group"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Checkbox
              checked={selectedLinks.has(link.id)}
              onCheckedChange={(checked) => handleSelectLink(link.id, checked)}
            />
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <LinkIcon className="h-4 w-4 text-themeColor flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">
                    {link.title || new URL(link.original).hostname}
                  </span>
                  {isRecent(link.createdAt) && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {link.shortened.replace(/^https?:\/\//, '')}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-semibold">{link.clicks || 0}</span>
            </div>
            
            <div className="text-xs text-gray-500">
              {formatDate(link.createdAt).split(',')[0]}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(link.shortened, link.id)}
                className="h-8 w-8 p-0"
              >
                {copiedLinkId === link.id ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(link.shortened, "_blank")}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
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
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </AnimatePresence>
  </div>
);