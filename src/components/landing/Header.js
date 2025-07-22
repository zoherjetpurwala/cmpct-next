import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Baumans } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";

const baumans = Baumans({ weight: "400", subsets: ["latin"] });

const Header = ({ onLoginClick, onSignUpClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "API", href: "#api" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-4 w-[95%] max-w-4xl z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 shadow-xl shadow-themeColor/20 border-themeColor-border/50"
            : "bg-white/60 shadow-lg shadow-themeColor/15 border-themeColor-border/30"
        } backdrop-blur-md rounded-2xl border`}
      >
<div className="flex items-center justify-between px-6 py-4 w-full">
  {/* Logo (Left) */}
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex-1 flex items-center gap-2 cursor-pointer"
  >
    <h1 className={`${baumans.className} text-3xl md:text-4xl text-themeColor-text font-bold`}>
      cmpct.
    </h1>
  </motion.div>

  {/* Navigation (Center) */}
  <nav className="hidden lg:flex flex-1 items-center justify-center gap-8">
    {navItems.map((item, index) => (
      <motion.a
        key={item.label}
        href={item.href}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 * index }}
        className="relative text-gray-700 hover:text-themeColor font-medium transition-colors duration-300 group"
      >
        {item.label}
        <motion.div
          className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-themeColor to-themeColor-dark group-hover:w-full transition-all duration-300"
        />
      </motion.a>
    ))}
  </nav>

  {/* Auth Buttons (Right) */}
  <div className="flex-1 hidden lg:flex items-center justify-end gap-3">
    <Button
      variant="ghost"
      onClick={onLoginClick}
      className="text-gray-700 hover:text-themeColor hover:bg-themeColor-light font-medium transition-all duration-300"
    >
      Login
    </Button>
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={onSignUpClick}
        className="bg-gradient-to-r from-themeColor to-themeColor-dark hover:from-themeColor-dark hover:to-themeColor text-white shadow-lg shadow-themeColor/25 font-medium px-6 transition-all duration-300"
      >
        Sign Up
      </Button>
    </motion.div>
  </div>

  {/* Mobile Menu Button */}
  <Button
    variant="ghost"
    size="sm"
    className="lg:hidden p-2 hover:bg-themeColor-light"
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  >
    <AnimatePresence mode="wait">
      <motion.div
        key={isMobileMenuOpen ? "close" : "menu"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </motion.div>
    </AnimatePresence>
  </Button>
</div>

      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-20 w-[92%] max-w-md bg-white/50 mt-5 backdrop-blur-xl rounded-2xl shadow-2xl border border-themeColor-border/80 z-50 lg:hidden overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {/* Navigation Links */}
                <nav className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      className="block px-4 py-3 text-gray-700 hover:text-themeColor hover:bg-themeColor-light/50 font-medium text-lg transition-all duration-200 rounded-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="space-y-3 pt-4 border-t border-themeColor-border/60"
                >
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onLoginClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-gray-700 hover:text-themeColor hover:bg-themeColor-light font-medium py-3 text-lg"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      onSignUpClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-themeColor to-themeColor-dark hover:from-themeColor-dark hover:to-themeColor text-white shadow-lg shadow-themeColor/25 font-medium py-3 text-lg"
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;