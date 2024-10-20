"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {  Code,  Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ApiDocsComponent() {
  return (
    <div>
      <Card className="rounded-2xl border border-blue-800/25 mb-4">
        <CardHeader>
          <CardTitle>Cmpct API Documentation</CardTitle>
          <CardDescription>
            This API allows you to create and retrieve shortened URLs. It
            requires an access token for authentication.{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section className="mb-3">
            <h2 className="flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Base URL
            </h2>
            <Card>
              <CardContent className="pt-6">
                <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                  {`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/compact`}
                </pre>
                <code className="bg-gray-100 rounded-lg block text-sm"></code>
              </CardContent>
            </Card>
          </section>
          <section className="">
            <h2 className="flex items-center">
              <Shield className="h-4 w-4 mr-2" /> Authentication
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4 text-sm text-gray-700">
                  All API requests require an access token to be included in the
                  Authorization header:
                </p>
                <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                  {`Authorization: Bearer YOUR_ACCESS_TOKEN`}
                </pre>
              </CardContent>
            </Card>
          </section>
        </CardContent>
      </Card>

      <Card className="mb-3 border-l-4 border-blue-800/25 border-l-blue-900">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Badge className="mr-2 bg-blue-900">POST</Badge> Create Short URL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-2 text-blue-900">
            POST /api/v1/compact
          </h3>
          <p className="mb-4 text-gray-700">
            Creates a new shortened URL from a long URL.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-2">Request Body</h4>

          <pre className="bg-gray-100 p-3 rounded-lg mb-4 text-sm overflow-x-auto">
            {`{
 "longUrl": "https://example.com/very/long/url",
 "header": "optional-custom-header"  // Optional
}`}
          </pre>

          <h4 className="text-lg font-semibold mt-6 mb-2">Response</h4>

          <pre className="bg-gray-100 p-3 rounded-lg mb-4 text-sm overflow-x-auto">
            {`{
 "shortUrl": "https://yourdomain.com/abcde"  // or "https://yourdomain.com/optional-custom-header/abcde"
}`}
          </pre>

          <h4 className="text-lg font-semibold mt-6 mb-2">Example</h4>
          <Tabs defaultValue="js" className="w-full">
            <TabsList>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
              <TabsTrigger value="py">Python</TabsTrigger>
            </TabsList>
            <TabsContent value="js">
              <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
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
              </pre>
            </TabsContent>
            <TabsContent value="py">
              <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
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
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Updated GET Request Section */}
      <Card className="border-l-4  border-blue-800/25 border-l-blue-900">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Badge className="mr-2 bg-blue-900">GET</Badge> Retrieve Long URL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-2 text-blue-900">
          GET /api/v1/compact?shortCode={"shortCode"}&header={"optional-header"}
          </h3>
          <p className="mb-4 text-gray-700">
            Retrieves the original long URL from a short URL.
          </p>

          <p className="mb-4 text-gray-700">
            The query parameters required:
            <ul className="list-disc list-inside mt-2">
              <li><strong>shortCode</strong> - The short code for the URL.</li>
              <li><strong>header</strong> - (Optional) Custom header, if applicable.</li>
            </ul>
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-2">Response</h4>
          <pre className="bg-gray-100 p-3 rounded-lg mb-4 text-sm overflow-x-auto">
            {`
{
 "longUrl": "https://example.com/very/long/url"
}`}
          </pre>

          <h4 className="text-lg font-semibold mt-6 mb-2">Example</h4>
          <Tabs defaultValue="js" className="w-full">
            <TabsList>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
              <TabsTrigger value="py">Python</TabsTrigger>
            </TabsList>
            <TabsContent value="js">
              <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                {`fetch('${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/compact?shortCode=abcde&header=optional-header', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
      }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));`}
              </pre>
            </TabsContent>
            <TabsContent value="py">
              <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                {`import requests

    url = '${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/compact?shortCode=abcde&header=optional-header'
    headers = {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
    }

    response = requests.get(url, headers=headers)
    print(response.json())`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
