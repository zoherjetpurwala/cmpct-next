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
import { useLinkManagement } from "@/hooks/useLinkManagement";
// import { useUserStore } from "@/context/UserContext";
import { useSession } from "next-auth/react";

const DashboardComponent = () => {
  const [formData, setFormData] = useState({ longUrl: "", header: "" });
  const { shortenedLinks, isLoading, error, fetchUserLinks, addNewLink } =
    useLinkManagement();
  // const { user } = useUserStore();
  const { data: session } = useSession(); // Use NextAuth session


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/compact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();
      if (data.shortUrl) {
        addNewLink({
          original: formData.longUrl,
          shortened: data.shortUrl,
          clicks: 0,
        });
        setFormData({ longUrl: "", header: "" });
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optionally, show a success message
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const openLink = (url) => window.open(url, "_blank");

  const StatCard = ({ title, value, icon: Icon }) => (
    <Card className="rounded-2xl border border-blue-800/25">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  const totalClicks = shortenedLinks.reduce(
    (acc, link) => acc + link.clicks,
    0
  );
  const avgClicks =
    shortenedLinks.length > 0
      ? (totalClicks / shortenedLinks.length).toFixed(2)
      : 0;

  return (
    <>
      <Card className="rounded-2xl border border-blue-800/25 mb-4">
        <CardHeader>
          <CardTitle>Shorten a URL</CardTitle>
          <CardDescription>
            Enter a long URL to create a compact version
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <form
            onSubmit={handleSubmit}
            className="flex max-md:flex-col max-md:w-full gap-2"
          >
            <Input
              name="longUrl"
              placeholder="Enter your long URL"
              className="flex-grow md:w-4/6"
              value={formData.longUrl}
              onChange={handleInputChange}
              required
            />
            <Input
              name="header"
              placeholder="Enter your header"
              className="flex-grow md:w-1/6"
              value={formData.header}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 md:w-1/6"
            >
              <span className="">Compact</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Total Links"
                value={shortenedLinks.length}
                icon={LinkIcon}
              />
              <StatCard
                title="Total Clicks"
                value={totalClicks}
                icon={BarChart2}
              />
              <StatCard
                title="Avg. Clicks per Link"
                value={avgClicks}
                icon={BarChart2}
              />
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
                          <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
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
                                onClick={() => copyToClipboard(link.shortened)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openLink(link.shortened)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="md:hidden space-y-4">
                    {shortenedLinks.slice(0, 5).map((link, index) => (
                      <div key={index} className="border p-4 rounded-lg">
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
                            onClick={() => copyToClipboard(link.shortened)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openLink(link.shortened)}
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
      )}
    </>
  );
};

export default DashboardComponent;
