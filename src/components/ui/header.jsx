"use client";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User } from "lucide-react";
import { Baumans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react"; // Import NextAuth hooks
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
  const [loadingLogout, setLoadingLogout] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

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
    setLoadingLogout(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <header className="bg-blue-950 backdrop-blur-3xl border border-blue-800/25 p-4 flex justify-between items-center mx-4 mt-3 rounded-2xl text-white">
      <Button variant="ghost" onClick={toggleSidebar} className="md:hidden">
        <Menu className="h-6 w-6" />
      </Button>
      <h2
        className={`${baumans.className} text-2xl font-semibold  md:hidden`}
      >
        cmpct.
      </h2>

      <h2 className={`text-xl   max-md:hidden`}>{getTitle()}</h2>

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
              <span>{session?.user?.email}</span>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsLoginModalOpen(true)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{loadingLogout ? "Logging out..." : "Log out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AuthModal
        isOpen={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        onSubmit={handleLogout}
        loading={loadingLogout}
      />
    </header>
  );
};

export default Header;

function AuthModal({ isOpen, onOpenChange, onSubmit, loading }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Do you want to logout?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-4"
          >
            <Button type="submit" className={`bg-red-600 max-md:w-full`} disabled={loading}>
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}