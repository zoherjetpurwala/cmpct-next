import { useUser } from "@/context/UserContext";
import { useState } from "react";

export default function ShortenUrl() {
  const [longUrl, setLongUrl] = useState("");
  const [header, setHeader] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/v1/compact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({ longUrl, header }),
    });

    const data = await response.json();
    if (data.shortUrl) {
      setShortUrl(data.shortUrl);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Optional Header"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>
      {shortUrl && (
        <p>
          Shortened URL: <a href={shortUrl}>{shortUrl}</a>
        </p>
      )}
    </div>
  );
}
