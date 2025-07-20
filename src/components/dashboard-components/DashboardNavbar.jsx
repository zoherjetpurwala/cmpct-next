"use client";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User, Bell, Search, Settings } from "lucide-react";
import { Baumans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const baumans = Baumans({
  weight: "400",
  subsets: ["latin"],
});

const Header = ({ toggleSidebar, activeTab }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <header className="bg-gradient-to-r from-themeColor-light/20 to-themeColor-muted/30 backdrop-blur-xl border border-themeColor/20 p-4 mx-4 mt-3 rounded-2xl">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-themeColor/30 border-t-themeColor rounded-full animate-spin" />
        </div>
      </header>
    );
  }

  const getTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      myLinks: "My Links",
      analytics: "Analytics",
      profile: "Profile",
      docs: "Documentation",
      settings: "Settings"
    };
    return titles[activeTab] || "Dashboard";
  };

  const getSubtitle = () => {
    const subtitles = {
      dashboard: "Overview of your link performance",
      myLinks: "Manage and organize your links",
      analytics: "Detailed insights and metrics",
      profile: "Account settings and preferences",
      docs: "API documentation and guides",
      settings: "Application preferences"
    };
    return subtitles[activeTab] || "Welcome back";
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoadingLogout(false);
      setIsLogoutModalOpen(false);
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-r from-white via-themeColor-light/10 to-white backdrop-blur-xl border border-themeColor/20 p-4 mx-4 mt-3 rounded-2xl shadow-lg shadow-themeColor/10"
      >
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={toggleSidebar} 
              className="md:hidden hover:bg-themeColor/10 rounded-xl p-2"
            >
              <Menu className="h-6 w-6 text-themeColor-text" />
            </Button>
            
            {/* Mobile Logo */}
            <div className="md:hidden">
              <h2 className={`${baumans.className} text-2xl font-bold text-themeColor`}>
                cmpct.
              </h2>
            </div>

            {/* Desktop Title */}
            <div className="hidden md:block">
              <h2 className="text-2xl font-bold text-themeColor-text">{getTitle()}</h2>
              <p className="text-sm text-gray-600">{getSubtitle()}</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Button (Desktop) */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex hover:bg-themeColor/10 rounded-xl"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </Button> */}

            {/* Notifications Button */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-themeColor/10 rounded-xl"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-themeColor rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </Button> */}

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-3 hover:bg-themeColor/10 rounded-xl px-3 py-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-themeColor to-themeColor-dark rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-themeColor-text">
                      {session?.user?.name || "User"}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[120px]">
                      {session?.user?.email}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-84 p-2 bg-white border border-themeColor/20 rounded-2xl" align="end">
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-themeColor to-themeColor-dark rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-themeColor-text">
                        {session?.user?.name || "User"}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {session?.user?.email}
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="my-2" />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer rounded-lg">
                    <User className="mr-3 h-4 w-4 text-gray-500" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg">
                    <Settings className="mr-3 h-4 w-4 text-gray-500" />
                    <span>Preferences</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator className="my-2" />
                
                <DropdownMenuItem 
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>{loadingLogout ? "Logging out..." : "Sign out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={handleLogout}
        loading={loadingLogout}
      />
    </>
  );
};

const LogoutModal = ({ isOpen, onOpenChange, onConfirm, loading }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-themeColor/20 rounded-2xl max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="h-8 w-8 text-red-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Sign out of your account?
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            You will be redirected to the login page and will need to sign in again to access your dashboard.
          </p>
        </DialogHeader>
        <DialogFooter className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-gray-300 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Signing out...
              </div>
            ) : (
              "Sign out"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Header;