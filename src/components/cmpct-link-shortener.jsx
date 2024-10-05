"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  User,
  Menu,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Baumans } from "next/font/google";
import FlickeringGrid from "./ui/flickering-grid";
import { LandingPage } from "./landing-page";
import { ChevronRight, Zap } from "lucide-react";

const baumans = Baumans({
  weight: "400",
  subsets: ["latin"],
});

const handleLogin = (event) => {
  event.preventDefault();
  // Add your login logic here
};

const handleShorten = (event) => {
  event.preventDefault();
  // Handle URL shortening logic here
};
export function CmpctLinkShortenerComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [urlInput, setUrlInput] = useState("");

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

  const analyticsData = [
    { name: "Mon", clicks: 120 },
    { name: "Tue", clicks: 150 },
    { name: "Wed", clicks: 180 },
    { name: "Thu", clicks: 190 },
    { name: "Fri", clicks: 210 },
    { name: "Sat", clicks: 170 },
    { name: "Sun", clicks: 140 },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  function FeatureCard({ icon, title, description }) {
    return (
      <div className="bg-white/85 backdrop-blur-3xl rounded-2xl p-6 shadow-xl flex items-start space-x-4">
        <div className="flex flex-col justify-center items-center gap-2">
          {icon}
          <h3 className="text-xl font-semibold text-blue-800">{title}</h3>
          <p className="text-blue-800/50">{description}</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
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

  const renderMyLinks = () => (
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
  );

  const renderAnalytics = () => (
    <Card className="rounded-2xl border border-blue-800/25">
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>
          Click performance over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderProfile = () => (
    <Card className="rounded-2xl border border-blue-800/25">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" defaultValue="John Doe" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="john.doe@example.com"
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <Button type="submit">Update Profile</Button>
        </form>
      </CardContent>
    </Card>
  );

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex flex-col justify-center items-center px-4 overflow-hidden">
        <FlickeringGrid
          className="z-0 absolute inset-0 min-h-screen  [mask:radial-gradient(circle_at_center,#fff_300px,transparent_0)]"
          squareSize={12}
          gridGap={6}
          color="#ffffff"
          maxOpacity={0.1}
          flickerChance={0.05}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        />
        <div className="max-w-6xl mx-auto text-center text-white relative z-10 flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mt-28 mb-20 md:mb-0 md:mt-0"
          >
            <motion.h1
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`${baumans.className} text-8xl md:text-9xl font-extrabold mb-8`}
            >
              cmpct.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl md:text-3xl mb-8 font-light"
            >
              Shrink your links, expand your reach
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4"
            >
              <Button
                size="lg"
                variant="secondary"
                className="text-blue-700 hover:bg-blue-100 transition-colors duration-300"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Sign-In
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-6">
              <FeatureCard
                icon={<Zap className="w-8 h-8 text-yellow-400" />}
                title="Lightning Fast"
                description="Generate short links in milliseconds"
              />
              <FeatureCard
                icon={<LinkIcon className="w-8 h-8 text-blue-400" />}
                title="Custom Links"
                description="Create branded and memorable URLs"
              />
            </div>
          </motion.div>
        </div>
        <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
          <DialogContent className="bg-white/85 backdrop-blur-2xl border-0 text-blue-800 mx-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">
                Login to <span className="text-3xl">cmpct.</span>
              </DialogTitle>
              <DialogDescription className="text-center text-blue-800/70">
                Enter your credentials to access your account
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="text-blue-800/70">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    required
                    className="bg-white/20 border border-blue-800/30 text-white placeholder-blue-200"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="text-blue-800/70">
                    Password
                  </Label>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    required
                    className="bg-white/20 border border-blue-800/30 text-white placeholder-blue-200"
                  />
                </div>
              </div>
              <Button
                className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
                type="submit"
              >
                Login
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`w-64 bg-blue-800 text-white p-6 fixed inset-y-0 left-0 transform rounded-tr-2xl rounded-br-2xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className={`${baumans.className} text-3xl font-bold`}>cmpct.</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start rounded-xl ${
              activeTab === "dashboard" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => {
              setActiveTab("dashboard");
              toggleSidebar();
            }}
          >
            <BarChart2 className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start rounded-xl ${
              activeTab === "myLinks" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => {
              setActiveTab("myLinks");
              toggleSidebar();
            }}
          >
            <LinkIcon className="mr-2 h-4 w-4" /> My Links
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start rounded-xl ${
              activeTab === "analytics" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => {
              setActiveTab("analytics");
              toggleSidebar();
            }}
          >
            <BarChart2 className="mr-2 h-4 w-4" /> Analytics
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start rounded-xl ${
              activeTab === "profile" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => {
              setActiveTab("profile");
              toggleSidebar();
            }}
          >
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-blue-800/5 backdrop-blur-3xl border border-blue-800/25 p-4 flex justify-between items-center mx-4 mt-3 rounded-2xl">
          <Button variant="ghost" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <h2
            className={`${baumans.className} text-2xl font-semibold text-blue-800 md:hidden`}
          >
            cmpct.
          </h2>

          <h2 className={`text-xl  text-blue-800 max-md:hidden`}>
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "myLinks" && "My Links"}
            {activeTab === "analytics" && "Analytics"}
            {activeTab === "profile" && "Profile"}
          </h2>

          <Button variant="ghost">
            <User className="h-6 w-6" />
          </Button>
        </header>

        <main className="flex-1 p-4 overflow-auto">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "myLinks" && renderMyLinks()}
          {activeTab === "analytics" && renderAnalytics()}
          {activeTab === "profile" && renderProfile()}
        </main>
      </div>
    </div>
  );
}
