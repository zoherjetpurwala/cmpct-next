"use client"
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ApiDocsPage = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const exampleCodeJS = `
    fetch("/api/v1/compact/{header}/{shortCode}", {
      method: "GET",
      headers: {
        "Authorization": "Bearer ACCESS_TOKEN"
      }
    })
    .then(response => response.json())
    .then(data => console.log(data));
  `;

  const exampleCodeJava = `
    import java.net.HttpURLConnection;
    import java.net.URL;

    public class Main {
        public static void main(String[] args) {
            try {
                URL url = new URL("https://your-api.com/api/v1/compact/{header}/{shortCode}");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Authorization", "Bearer ACCESS_TOKEN");
                
                int responseCode = conn.getResponseCode();
                if(responseCode == HttpURLConnection.HTTP_OK) {
                    // handle response
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
  `;

  const exampleCodePHP = `
    <?php
    $url = "https://your-api.com/api/v1/compact/{header}/{shortCode}";
    $headers = [
        "Authorization: Bearer ACCESS_TOKEN"
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;
    ?>
  `;

  return (
    <motion.div
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Documentation - Get Long URL</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This API allows you to retrieve the original long URL associated with the shortened URL. The API requires an access token for authentication.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-2">
        {/* Endpoint Card */}
        <Card className="rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle>GET /api/v1/compact/{`{header}/{shortCode}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              This endpoint retrieves the original URL based on the given shortened URL code and logs the visit.
            </p>
          </CardContent>
        </Card>

        {/* Response Example */}
        <Card className="rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle>Sample Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 text-sm p-4 rounded-md">
              {`{
  "longUrl": "https://example.com",
  "clickCount": 42
}`}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Table for Parameters */}
      <Card className="rounded-xl border border-gray-200 mb-6">
        <CardHeader>
          <CardTitle>GET Request Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>shortCode</TableCell>
                <TableCell>The unique shortened URL code.</TableCell>
                <TableCell>string</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>header</TableCell>
                <TableCell>(Optional) A custom URL header.</TableCell>
                <TableCell>string</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Authorization</TableCell>
                <TableCell>Bearer token for authentication.</TableCell>
                <TableCell>string</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Code Snippets */}
      <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-3">
        {/* JS Example */}
        <Card className="rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle>JavaScript Example</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="flex items-center mt-4 bg-blue-600 text-white"
              onClick={() => handleCopy(exampleCodeJS)}
            >
              <Copy className="h-4 w-4 mr-2" /> {copied ? "Copied!" : "Copy Example"}
            </Button>

            <pre className="bg-gray-100 text-sm p-4 mt-4 rounded-md">
              {exampleCodeJS}
            </pre>
          </CardContent>
        </Card>

        {/* Java Example */}
        <Card className="rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle>Java Example</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="flex items-center mt-4 bg-blue-600 text-white"
              onClick={() => handleCopy(exampleCodeJava)}
            >
              <Copy className="h-4 w-4 mr-2" /> {copied ? "Copied!" : "Copy Example"}
            </Button>

            <pre className="bg-gray-100 text-sm p-4 mt-4 rounded-md">
              {exampleCodeJava}
            </pre>
          </CardContent>
        </Card>

        {/* PHP Example */}
        <Card className="rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle>PHP Example</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="flex items-center mt-4 bg-blue-600 text-white"
              onClick={() => handleCopy(exampleCodePHP)}
            >
              <Copy className="h-4 w-4 mr-2" /> {copied ? "Copied!" : "Copy Example"}
            </Button>

            <pre className="bg-gray-100 text-sm p-4 mt-4 rounded-md">
              {exampleCodePHP}
            </pre>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ApiDocsPage;
