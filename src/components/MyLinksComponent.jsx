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
} from "lucide-react";
import { Baumans } from "next/font/google";
import { useLinkManagement } from "@/hooks/useLinkManagement";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // Import Input component
import LoadingSpinner from "./ui/loading-spinner";

const MyLinksComponent = () => {
  const { shortenedLinks, isLoading, error } = useLinkManagement();
  const [sortConfig, setSortConfig] = useState({
    key: "clicks",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  if (isLoading) return <p><LoadingSpinner/></p>;
  if (error) return <p>Error: {error}</p>;

  const sortedLinks = [...shortenedLinks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Filter the links based on search term
  const filteredLinks = sortedLinks.filter(
    (link) =>
      link.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.shortened.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLinks = filteredLinks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);

  return (
    <Card className="rounded-2xl border border-blue-800/25">
      <CardHeader className="md:hidden">
        <CardTitle>My Links</CardTitle>
        <CardDescription>All your shortened links</CardDescription>
      </CardHeader>
      <CardContent className="md:mt-2">
        <div className="overflow-x-auto">
          {/* Search Bar */}
          <div className="relative w-full py-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder="Search links."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Desktop Table View */}
          <Table className="min-w-full table-fixed hidden md:table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/6">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("original")}
                  >
                    Original URL <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-2/6">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("shortened")}
                  >
                    Shortened URL <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-1/6">
                  <Button variant="ghost" onClick={() => requestSort("clicks")}>
                    Clicks <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-1/6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLinks.map((link, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {link.original}
                  </TableCell>
                  <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {link.shortened}
                  </TableCell>
                  <TableCell>{link.clicks}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          navigator.clipboard.writeText(link.shortened)
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(link.shortened, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Mobile-friendly card design */}
          <div className="md:hidden space-y-4">
            {paginatedLinks.map((link, index) => (
              <div key={index} className="border p-4 rounded-lg min-h-full">
                <div className="font-medium">Original URL:</div>
                <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">
                  {link.original}
                </div>
                <div className="mt-2 font-medium">Shortened URL:</div>
                <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  {link.shortened}
                </div>
                <div className="mt-2 font-medium">Clicks:</div>
                <div>{link.clicks}</div>
                <div className="mt-2 flex space-x-2 justify-start">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      navigator.clipboard.writeText(link.shortened)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(link.shortened, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-between items-center py-4">
            {/* Select Items Per Page */}
            <Select
              onValueChange={(value) => setItemsPerPage(Number(value))}
              defaultValue={`${itemsPerPage}`}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 items per page</SelectItem>
                <SelectItem value="10">10 items per page</SelectItem>
                <SelectItem value="20">20 items per page</SelectItem>
              </SelectContent>
            </Select>

            {/* Responsive Pagination Controls */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyLinksComponent;
