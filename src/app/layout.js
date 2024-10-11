import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProviderWrapper } from "@/lib/SessionProviderWrapper";
import Head from "./head";

const opensans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata = {
  title: "cmpct.",
  description: "Compact your URL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head />
      <body className={`${opensans.className} antialiased`}>
        <SessionProviderWrapper>
          {children}
          <Toaster richColors closeButton position="top-center" />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
