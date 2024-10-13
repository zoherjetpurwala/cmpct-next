"use client";
import { Button } from "@/components/ui/button";
import { BarChart2, Link as LinkIcon, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Baumans } from "next/font/google";

const baumans = Baumans({
  weight: "400",
  subsets: ["latin"],
});

const Sidebar = ({ isSidebarOpen, toggleSidebar, activeTab, setActiveTab }) => {
  const router = useRouter();

  const navigateTo = (path, tabName) => {
    setActiveTab(tabName);
    router.push(path);
    toggleSidebar();
  };

  return (
    <div
      className={`w-64 bg-blue-950 text-white p-6 fixed inset-y-0 left-0 transform rounded-tr-2xl rounded-br-2xl z-30
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 transition-transform duration-200 ease-in-out`}
    >
      <div className="flex justify-between md:text-center items-center mb-8">
        <h1 className={`${baumans.className} ml-2  text-3xl font-bold`}>
          cmpct.
        </h1>
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
            activeTab === "dashboard" ? "bg-blue-800 text-white" : ""
          }`}
          onClick={() => navigateTo("/app/dashboard", "dashboard")}
        >
          <BarChart2 className="mr-2 h-4 w-4" /> Dashboard
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start rounded-xl ${
            activeTab === "myLinks" ? "bg-blue-800 text-white" : ""
          }`}
          onClick={() => navigateTo("/app/mylinks", "myLinks")}
        >
          <LinkIcon className="mr-2 h-4 w-4" /> My Links
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start rounded-xl ${
            activeTab === "analytics" ? "bg-blue-800 text-white" : ""
          }`}
          onClick={() => navigateTo("/app/analytics", "analytics")}
        >
          <BarChart2 className="mr-2 h-4 w-4" /> Analytics
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start rounded-xl ${
            activeTab === "profile" ? "bg-blue-800 text-white" : ""
          }`}
          onClick={() => navigateTo("/app/profile", "profile")}
        >
          <User className="mr-2 h-4 w-4" /> Profile
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start rounded-xl ${
            activeTab === "docs" ? "bg-blue-800 text-white" : ""
          }`}
          onClick={() => navigateTo("/app/docs", "docs")}
        >
          <User className="mr-2 h-4 w-4" /> Docs
        </Button>
      </nav>
    </div>
  );
};

export default Sidebar;
