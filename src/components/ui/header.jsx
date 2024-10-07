"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { LogOut, Mail, Menu, User, Users, Loader2 } from "lucide-react";
import { Baumans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const { user, setUserWithToken } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { logoutFunction } = useUser();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Ensure this only runs on the client
    }
  }, [user, router]);

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "myLinks":
        return "My Links";
      case "analytics":
        return "Analytics";
      case "profile":
        return "Profile";
      default:
        return "Dashboard";
    }
  };

  const handleLogout = async () => {
    logoutFunction();
  };

  return (
    <header className="bg-blue-800/5 backdrop-blur-3xl border border-blue-800/25 p-4 flex justify-between items-center mx-4 mt-3 rounded-2xl">
      <Button variant="ghost" onClick={toggleSidebar} className="md:hidden">
        <Menu className="h-6 w-6" />
      </Button>
      <h2
        className={`${baumans.className} text-2xl font-semibold text-blue-800 md:hidden`}
      >
        cmpct.
      </h2>

      <h2 className={`text-xl  text-blue-800 max-md:hidden`}>{getTitle()}</h2>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <User className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <span>{user?.email}</span>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsLoginModalOpen(true)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AuthModal
        isOpen={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        onSubmit={handleLogout}
        buttonText="Logout"
        isLoading={isLoading}
      />
    </header>
  );
};

export default Header;

function AuthModal({ isOpen, onOpenChange, onSubmit, buttonText, isLoading }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Do you want to logout?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <form onSubmit={onSubmit} className="space-y-4">
            <Button type="submit" className="bg-red-600 ">
              Logout
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
