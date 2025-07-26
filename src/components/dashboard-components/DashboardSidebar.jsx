"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Link as LinkIcon,
  User,
  X,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Baumans } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

const baumans = Baumans({
  weight: "400",
  subsets: ["latin"],
});

const Sidebar = ({ isSidebarOpen, toggleSidebar, activeTab, setActiveTab }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigateTo = (path, tabName) => {
    setActiveTab(tabName);
    router.push(path);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart2,
      path: "/app/dashboard",
      description: "Overview & stats",
    },
    {
      id: "myLinks",
      label: "My Links",
      icon: LinkIcon,
      path: "/app/mylinks",
      description: "Manage links",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart2,
      path: "/app/analytics",
      description: "Detailed insights",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/app/profile",
      description: "Account settings",
    },
    {
      id: "docs",
      label: "Documentation",
      icon: FileText,
      path: "/app/docs",
      description: "API & guides",
    },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial={false}
        animate={isMobile ? (isSidebarOpen ? "open" : "closed") : false}
        className={`w-72 bg-gradient-to-br from-themeColor-700 to-themeColor-800 text-white 
          z-30 shadow-2xl rounded-r-3xl
          fixed inset-y-0 left-0 
          md:translate-x-0 md:top-0 md:block`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <h1
                className={`${baumans.className} text-4xl font-bold text-white`}
              >
                cmpct.
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden text-white hover:bg-white/10 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start p-4 h-auto rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? "bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => navigateTo(item.path, item.id)}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 w-1 h-full bg-white rounded-r-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}

                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start p-4 h-auto rounded-xl text-white/80 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300"
              onClick={handleLogout}
            >
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Sign Out</div>
                  <div className="text-xs text-white/60">Logout safely</div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
