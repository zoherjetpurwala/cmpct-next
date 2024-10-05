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
  Link as LinkIcon,

} from "lucide-react";

import { Baumans } from "next/font/google";

const baumans = Baumans({
  weight: "400",
  subsets: ["latin"],
});
const MyLinksComponent = () => {
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
  return (
    <Card className="rounded-2xl border border-blue-800/25">
      <CardHeader>
        <CardTitle>My Links</CardTitle>
        <CardDescription>All your shortened links</CardDescription>
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
            {shortenedLinks.map((link, index) => (
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
  )
}

export default MyLinksComponent
