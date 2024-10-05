"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, Copy, ExternalLink, BarChart2, Link, User } from "lucide-react"

export function EnhancedLinkShortenerComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [shortenedLinks, setShortenedLinks] = useState([
    { original: "https://example.com/very/long/url", shortened: "https://short.ly/abc123", clicks: 145 },
    { original: "https://another-example.com/with/many/parameters", shortened: "https://short.ly/def456", clicks: 89 },
  ])

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoggedIn(true)
  }

  const handleShorten = (e) => {
    e.preventDefault()
    const newShortLink = {
      original: (e.target).url.value,
      shortened: `https://short.ly/${Math.random().toString(36).substr(2, 6)}`,
      clicks: 0,
    }
    setShortenedLinks([...shortenedLinks, newShortLink])
    ;(e.target).reset()
  }

  if (!isLoggedIn) {
    return (
      (<div
        className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center text-white mb-16">
            <h1 className="text-5xl font-bold mb-4">Welcome to Short.ly</h1>
            <p className="text-xl mb-8">The fastest way to shorten your URLs and track their performance</p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" variant="secondary">Learn More</Button>
              <Button size="lg" variant="outline">Sign Up</Button>
            </div>
          </div>
          <Card className="max-w-md mx-auto bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Login to Short.ly</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Enter your email" type="email" required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" placeholder="Enter your password" type="password" required />
                  </div>
                </div>
                <Button className="w-full mt-6" type="submit">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>)
    );
  }

  return (
    (<div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Short.ly Dashboard</h1>
          <Button variant="ghost">
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Links</CardTitle>
              <Link className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shortenedLinks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shortenedLinks.reduce((acc, link) => acc + link.clicks, 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Clicks per Link</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(shortenedLinks.reduce((acc, link) => acc + link.clicks, 0) / shortenedLinks.length).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="shorten" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shorten">Shorten URL</TabsTrigger>
            <TabsTrigger value="links">My Links</TabsTrigger>
          </TabsList>
          <TabsContent value="shorten">
            <Card>
              <CardHeader>
                <CardTitle>Shorten a URL</CardTitle>
                <CardDescription>Enter a long URL to create a shortened version</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShorten} className="flex space-x-2">
                  <Input
                    name="url"
                    placeholder="Enter your long URL"
                    className="flex-grow"
                    required />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Shorten
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="links">
            <Card>
              <CardHeader>
                <CardTitle>My Shortened Links</CardTitle>
                <CardDescription>View and manage your shortened URLs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Original URL</TableHead>
                      <TableHead>Shortened URL</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shortenedLinks.map((link, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{link.original}</TableCell>
                        <TableCell>{link.shortened}</TableCell>
                        <TableCell>{link.clicks}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => navigator.clipboard.writeText(link.shortened)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(link.shortened, "_blank")}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>)
  );
}