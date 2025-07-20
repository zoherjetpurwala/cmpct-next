import { AnimatePresence, motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLink,
  LinkIcon,
  BarChart2,
  Copy,
  CheckCircle,
  MoreHorizontal,
  Edit3,
  QrCode,
  Share2,
  Trash2,
  Users
} from "lucide-react";

export const LinkTableView = ({
  paginatedLinks,
  selectedLinks,
  handleSelectAll,
  handleSelectLink,
  getSortIcon,
  handleSort,
  formatDate,
  isRecent,
  getPerformanceBadge,
  copyToClipboard,
  copiedLinkId,
  setShowAnalytics,
  setEditingLink,
  deleteLink
}) => (
  <div className="overflow-hidden rounded-xl border border-gray-200">
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={selectedLinks.size === paginatedLinks.length && paginatedLinks.length > 0}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          <TableHead className="w-5/12">
            <Button
              variant="ghost"
              onClick={() => handleSort("original")}
              className="hover:bg-themeColor/10 text-themeColor-text font-semibold p-0 h-auto"
            >
              Original URL 
              {getSortIcon("original")}
            </Button>
          </TableHead>
          <TableHead className="w-3/12">
            <Button
              variant="ghost"
              onClick={() => handleSort("shortened")}
              className="hover:bg-themeColor/10 text-themeColor-text font-semibold p-0 h-auto"
            >
              Short URL 
              {getSortIcon("shortened")}
            </Button>
          </TableHead>
          <TableHead className="w-1/12">
            <Button 
              variant="ghost" 
              onClick={() => handleSort("clicks")}
              className="hover:bg-themeColor/10 text-themeColor-text font-semibold p-0 h-auto"
            >
              Clicks 
              {getSortIcon("clicks")}
            </Button>
          </TableHead>
          <TableHead className="w-2/12">
            <Button 
              variant="ghost" 
              onClick={() => handleSort("createdAt")}
              className="hover:bg-themeColor/10 text-themeColor-text font-semibold p-0 h-auto"
            >
              Created 
              {getSortIcon("createdAt")}
            </Button>
          </TableHead>
          <TableHead className="w-1/12 text-themeColor-text font-semibold">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence mode="popLayout">
          {paginatedLinks.map((link, index) => (
            <motion.tr
              key={`${link.id || link.shortened}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className="hover:bg-themeColor-light/10 transition-colors group"
            >
              <TableCell>
                <Checkbox
                  checked={selectedLinks.has(link.id)}
                  onCheckedChange={(checked) => handleSelectLink(link.id, checked)}
                />
              </TableCell>
              <TableCell className="max-w-0">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                    <ExternalLink className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="truncate font-medium text-gray-900 cursor-pointer hover:text-themeColor">
                            {link.title || new URL(link.original).hostname}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs break-all">{link.original}</p>
                        </TooltipContent>
                      </Tooltip>
                      {isRecent(link.createdAt) && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          New
                        </Badge>
                      )}
                      {link.isActive === false && (
                        <Badge variant="outline" className="text-red-600 border-red-200 text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {link.description || link.original}
                    </div>
                    {link.tags && link.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {link.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {link.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{link.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-w-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-themeColor/10 rounded-lg flex-shrink-0">
                    <LinkIcon className="h-4 w-4 text-themeColor" />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span 
                        className="text-themeColor font-medium truncate cursor-pointer hover:underline"
                        onClick={() => copyToClipboard(link.shortened, link.id)}
                      >
                        {link.shortened.replace(/^https?:\/\//, '')}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to copy</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold">{link.clicks || 0}</span>
                  {getPerformanceBadge(link.clicks || 0)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {formatDate(link.createdAt).split(',')[0]}
                  </div>
                  <div className="text-gray-500">
                    {formatDate(link.createdAt).split(',')[1]}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(link.shortened, link.id)}
                        className="h-8 w-8 p-0 hover:bg-themeColor/20"
                      >
                        {copiedLinkId === link.id ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy link</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(link.shortened, "_blank")}
                        className="h-8 w-8 p-0 hover:bg-themeColor/20"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open link</TooltipContent>
                  </Tooltip>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-themeColor/20"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setShowAnalytics(prev => ({ ...prev, [link.id]: !prev[link.id] }))}>
                        <BarChart2 className="h-4 w-4 mr-2" />
                        Show Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <QrCode className="h-4 w-4 mr-2" />
                        Generate QR Code
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEditingLink(link)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        Collaborate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => deleteLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
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
  </div>
);