"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (pathname === "/app/dashboard") {
      setActiveTab("dashboard");
    } else if (pathname === "/app/mylinks") {
      setActiveTab("myLinks");
    } else if (pathname === "/app/analytics") {
      setActiveTab("analytics");
    } else if (pathname === "/app/profile") {
      setActiveTab("profile");
    } else {
      router.push("/app/dashboard");
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="w-full flex flex-col min-h-screen md:ml-64">
        <Header toggleSidebar={toggleSidebar} activeTab={activeTab} />

        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
