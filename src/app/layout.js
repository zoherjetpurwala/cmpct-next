import { Open_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/sonner";

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
      <body className={`${opensans.className} antialiased`}>
        <UserProvider>
          {children}
          <Toaster richColors closeButton />
        </UserProvider>
      </body>
    </html>
  );
}
