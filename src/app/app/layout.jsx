"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/loading-spinner";

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (pathname === "/app/dashboard") {
      setActiveTab("dashboard");
    } else if (pathname === "/app/mylinks") {
      setActiveTab("myLinks");
    } else if (pathname === "/app/analytics") {
      setActiveTab("analytics");
    } else if (pathname === "/app/profile") {
      setActiveTab("profile");
    } else if (pathname === "/app/docs") {
      setActiveTab("docs");
    } else {
      router.push("/app/dashboard");
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

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
