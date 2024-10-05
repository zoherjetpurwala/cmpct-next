import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
} from "lucide-react";

import { Baumans } from "next/font/google";

const baumans = Baumans({
  weight: "400",
  subsets: ["latin"],
});

const DashboardComponent = () => {
  const [shortenedLinks, setShortenedLinks] = useState([
    {
      original: "https://example.com/very/long/url",
      shortened: "https://cmpct.io/abc123",
      clicks: 145,
    },
    {
      original: "https://another-example.com/with/many/parameters",
      shortened: "https://cmpct.io/def456",
      clicks: 89,
    },
    {
      original: "https://third-example.com/page",
      shortened: "https://cmpct.io/ghi789",
      clicks: 212,
    },
  ]);
  const handleShorten = (e) => {
    e.preventDefault();
    const newShortLink = {
      original: e.target.url.value,
      shortened: `https://cmpct.io/${Math.random().toString(36).substr(2, 6)}`,
      clicks: 0,
    };
    setShortenedLinks([newShortLink, ...shortenedLinks]);
    e.target.reset();
  };

  return (
    <>
      <Card className="rounded-2xl border border-blue-800/25 mb-4">
        <CardHeader>
          <CardTitle>Shorten a URL</CardTitle>
          <CardDescription>
            Enter a long URL to create a compact version
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleShorten} className="flex space-x-2">
            <Input
              name="url"
              placeholder="Enter your long URL"
              className="flex-grow"
              required
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <span className="max-md:hidden">Compact</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <Card className="rounded-2xl border border-blue-800/25">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Links</CardTitle>
              <LinkIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shortenedLinks.length}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-blue-800/25">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clicks
              </CardTitle>
              <BarChart2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {shortenedLinks.reduce((acc, link) => acc + link.clicks, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-blue-800/25">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Clicks per Link
              </CardTitle>
              <BarChart2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  shortenedLinks.reduce((acc, link) => acc + link.clicks, 0) /
                  shortenedLinks.length
                ).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="rounded-2xl border border-blue-800/25">
          <CardHeader>
            <CardTitle>Recent Links</CardTitle>
            <CardDescription>
              Your most recently created compact links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {/* Desktop Table View */}
              <Table className="min-w-full hidden md:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Shortened URL</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shortenedLinks.slice(0, 5).map((link, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis ">
                        {link.original}
                      </TableCell>
                      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
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
                            onClick={() =>
                              window.open(link.shortened, "_blank")
                            }
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
                {shortenedLinks.slice(0, 5).map((link, index) => (
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
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardComponent;
