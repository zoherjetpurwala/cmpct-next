"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Shield, 
  Copy, 
  CheckCircle, 
  Book, 
  Zap, 
  Globe,
  Key,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ApiDocsComponent() {
  const [copiedCode, setCopiedCode] = useState("");

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const CodeBlock = ({ children, id, language = "javascript" }) => (
    <div className="relative group">
      <pre className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl text-sm overflow-x-auto font-mono">
        <code className="text-gray-800">{children}</code>
      </pre>
      <Button
        onClick={() => copyToClipboard(children, id)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-700 border border-gray-200 h-8 w-8 p-0"
        size="sm"
      >
        {copiedCode === id ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/10 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-themeColor/10 rounded-xl">
                <Book className="h-8 w-8 text-themeColor" />
              </div>
              <div>
                <CardTitle className="text-2xl text-themeColor-text">Cmpct API Documentation</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  RESTful API for creating and managing shortened URLs with advanced analytics and custom headers
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Start */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-themeColor-light/20 rounded-xl">
                <Zap className="h-5 w-5 text-themeColor" />
                <div>
                  <div className="font-semibold text-themeColor-text">Quick Start</div>
                  <div className="text-sm text-gray-600">Get started in minutes</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-themeColor-light/20 rounded-xl">
                <Shield className="h-5 w-5 text-themeColor" />
                <div>
                  <div className="font-semibold text-themeColor-text">Secure</div>
                  <div className="text-sm text-gray-600">Bearer token auth</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-themeColor-light/20 rounded-xl">
                <Globe className="h-5 w-5 text-themeColor" />
                <div>
                  <div className="font-semibold text-themeColor-text">RESTful</div>
                  <div className="text-sm text-gray-600">Standard HTTP methods</div>
                </div>
              </div>
            </div>

            {/* Base URL */}
            <section>
              <h3 className="flex items-center text-lg font-semibold text-themeColor-text mb-3">
                <Code className="h-5 w-5 mr-2 text-themeColor" />
                Base URL
              </h3>
              <div className="p-4 bg-gradient-to-r from-themeColor-light/10 to-themeColor-muted/10 rounded-xl border border-themeColor/20">
                <CodeBlock id="base-url">
                  {`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/compact`}
                </CodeBlock>
              </div>
            </section>

            {/* Authentication */}
            <section>
              <h3 className="flex items-center text-lg font-semibold text-themeColor-text mb-3">
                <Key className="h-5 w-5 mr-2 text-themeColor" />
                Authentication
              </h3>
              <div className="p-4 bg-gradient-to-r from-themeColor-light/10 to-themeColor-muted/10 rounded-xl border border-themeColor/20">
                <p className="mb-4 text-gray-700">
                  All API requests require an access token in the Authorization header:
                </p>
                <CodeBlock id="auth-header">
                  {`Authorization: Bearer YOUR_ACCESS_TOKEN`}
                </CodeBlock>
              </div>
            </section>
          </CardContent>
        </Card>
      </motion.div>

      {/* POST Endpoint */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-l-4 border-l-themeColor border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Badge className="mr-3 bg-green-600 hover:bg-green-700">POST</Badge>
              <span className="text-themeColor-text">Create Short URL</span>
            </CardTitle>
            <CardDescription>
              Transform long URLs into compact, trackable links with optional custom headers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <h4 className="font-semibold text-green-800 mb-2">Endpoint</h4>
              <code className="text-green-700 font-mono">POST /api/v1/compact</code>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-themeColor-text mb-3">Request Body</h4>
              <CodeBlock id="post-request">
{`{
  "longUrl": "https://example.com/very/long/url",
  "header": "optional-custom-header"  // Optional
}`}
              </CodeBlock>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-themeColor-text mb-3">Response</h4>
              <CodeBlock id="post-response">
{`{
  "shortUrl": "https://yourdomain.com/abcde",
  "shortCode": "abcde",
  "createdAt": "2024-01-15T10:30:00Z"
}`}
              </CodeBlock>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-themeColor-text mb-3">Code Examples</h4>
              <Tabs defaultValue="js" className="w-full">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="js" className="data-[state=active]:bg-themeColor data-[state=active]:text-white">JavaScript</TabsTrigger>
                  <TabsTrigger value="py" className="data-[state=active]:bg-themeColor data-[state=active]:text-white">Python</TabsTrigger>
                  <TabsTrigger value="curl" className="data-[state=active]:bg-themeColor data-[state=active]:text-white">cURL</TabsTrigger>
                </TabsList>
                <TabsContent value="js" className="mt-4">
                  <CodeBlock id="js-post">
{`fetch('${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/compact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: JSON.stringify({
    longUrl: 'https://example.com/very/long/url',
    header: 'optional-custom-header'  // Optional
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                  </CodeBlock>
                </TabsContent>
                <TabsContent value="py" className="mt-4">
                  <CodeBlock id="py-post">
{`import requests
import json

url = '${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/compact'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
}
data = {
    'longUrl': 'https://example.com/very/long/url',
    'header': 'optional-custom-header'  # Optional
}

response = requests.post(url, headers=headers, data=json.dumps(data))
print(response.json())`}
                  </CodeBlock>
                </TabsContent>
                <TabsContent value="curl" className="mt-4">
                  <CodeBlock id="curl-post">
{`curl -X POST '${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/compact' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -d '{
    "longUrl": "https://example.com/very/long/url",
    "header": "optional-custom-header"
  }'`}
                  </CodeBlock>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* GET Endpoint */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border-l-4 border-l-themeColor border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Badge className="mr-3 bg-blue-600 hover:bg-blue-700">GET</Badge>
              <span className="text-themeColor-text">Retrieve Long URL</span>
            </CardTitle>
            <CardDescription>
              Get the original URL from a short code with optional header parameter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-blue-800 mb-2">Endpoint</h4>
              <code className="text-blue-700 font-mono">GET /api/v1/compact?shortCode={"shortCode"}&header={"optional-header"}</code>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-xl">
                <h5 className="font-semibold text-gray-800 mb-2">Required Parameter</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-themeColor rounded-full"></div>
                    <strong>shortCode</strong> - The unique short code identifier
                  </li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl">
                <h5 className="font-semibold text-gray-800 mb-2">Optional Parameter</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <strong>header</strong> - Custom header if used during creation
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-themeColor-text mb-3">Response</h4>
              <CodeBlock id="get-response">
{`{
  "longUrl": "https://example.com/very/long/url",
  "shortCode": "abcde",
  "clicks": 42,
  "createdAt": "2024-01-15T10:30:00Z"
}`}
              </CodeBlock>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-themeColor-text mb-3">Code Examples</h4>
              <Tabs defaultValue="js" className="w-full">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="js" className="data-[state=active]:bg-themeColor data-[state=active]:text-white">JavaScript</TabsTrigger>
                  <TabsTrigger value="py" className="data-[state=active]:bg-themeColor data-[state=active]:text-white">Python</TabsTrigger>
                  <TabsTrigger value="curl" className="data-[state=active]:bg-themeColor data-[state=active]:text-white">cURL</TabsTrigger>
                </TabsList>
                <TabsContent value="js" className="mt-4">
                  <CodeBlock id="js-get">
{`fetch('${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/compact?shortCode=abcde&header=optional-header', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                  </CodeBlock>
                </TabsContent>
                <TabsContent value="py" className="mt-4">
                  <CodeBlock id="py-get">
{`import requests

url = '${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/compact?shortCode=abcde&header=optional-header'
headers = {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
}

response = requests.get(url, headers=headers)
print(response.json())`}
                  </CodeBlock>
                </TabsContent>
                <TabsContent value="curl" className="mt-4">
                  <CodeBlock id="curl-get">
{`curl -X GET '${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/compact?shortCode=abcde&header=optional-header' \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'`}
                  </CodeBlock>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Codes Section */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-red-50/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-themeColor-text flex items-center">
              <Shield className="h-5 w-5 mr-2 text-themeColor" />
              Error Responses
            </CardTitle>
            <CardDescription>Common error codes and their meanings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <span className="font-semibold text-red-800">400 Bad Request</span>
                  <p className="text-sm text-red-600">Invalid URL format or missing required fields</p>
                </div>
                <Badge variant="destructive">Error</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                <div>
                  <span className="font-semibold text-orange-800">401 Unauthorized</span>
                  <p className="text-sm text-orange-600">Invalid or missing access token</p>
                </div>
                <Badge className="bg-orange-600">Auth</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                <div>
                  <span className="font-semibold text-yellow-800">404 Not Found</span>
                  <p className="text-sm text-yellow-600">Short code does not exist</p>
                </div>
                <Badge className="bg-yellow-600">Missing</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Rate Limits */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-themeColor-text flex items-center">
              <Zap className="h-5 w-5 mr-2 text-themeColor" />
              Rate Limits & Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-themeColor/20 rounded-xl">
                <h4 className="font-semibold text-themeColor-text mb-2">Rate Limits</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 1000 requests per hour</li>
                  <li>• 100 requests per minute</li>
                  <li>• Burst limit: 10 requests/second</li>
                </ul>
              </div>
              <div className="p-4 border border-themeColor/20 rounded-xl">
                <h4 className="font-semibold text-themeColor-text mb-2">Best Practices</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cache responses when possible</li>
                  <li>• Use exponential backoff</li>
                  <li>• Monitor rate limit headers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}