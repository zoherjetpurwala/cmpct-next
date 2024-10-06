"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Menu, User } from "lucide-react";
import { Baumans } from "next/font/google";
import { useRouter } from "next/navigation";

const baumans = Baumans({
  weight: "400",
  subsets: ["latin"],
});

const Header = ({ toggleSidebar, activeTab }) => {
  const { user, loading } = useUser();
  const { logoutFunction } = useUser();
  const router = useRouter();

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

  if (!user) {
    router.push("/");
  }

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

      <Button
        variant="ghost"
        onClick={() => {
          handleLogout();
        }}
      >
        <User className="h-6 w-6" />
      </Button>

    </header>
  );
};

export default Header;
