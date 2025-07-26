import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const HeroSection = ({ onSignUpClick }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center relative overflow-hidden max-md:pt-24 pt-52"
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-2 h-2 bg-themeColor/20 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [20, -20, 20], rotate: [0, -5, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-40 right-20 w-3 h-3 bg-themeColor/15 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-40 left-1/4 w-1 h-1 bg-themeColor/25 rounded-full blur-sm"
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-6 text-center relative z-10 max-w-6xl"
      >
        {/* Headline with Different Font Options */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight ${poppins.className}`}
        >
          <span className="bg-gradient-to-br from-gray-800 via-themeColor-800 to-themeColor-400 bg-clip-text text-transparent">
            Shrink Your Links,
          </span>
          <br />
          <span className="bg-gradient-to-br from-themeColor to-themeColor-dark bg-clip-text text-transparent">
            Expand Your Reach
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Transform long URLs into powerful, trackable links that drive
          engagement. Built for modern teams who value{" "}
          <span className="text-themeColor font-medium">simplicity</span> and{" "}
          <span className="text-themeColor font-medium">performance</span>.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            onClick={onSignUpClick}
            className="group bg-themeColor hover:bg-themeColor-dark text-white px-8 py-4 text-lg font-medium shadow-lg shadow-themeColor/25 hover:shadow-xl hover:shadow-themeColor/35 transition-all duration-300 transform hover:scale-105"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-themeColor/20 to-themeColor-dark/15 blur-3xl opacity-30 rounded-3xl" />

          {/* Desktop Image */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative hidden md:block border-[8px] border-themeColor/40 ring-8 ring-themeColor/20 rounded-3xl"
          >
            <img
              src="/dashboard.png"
              alt="Dashboard preview"
              className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm"
            />

            {/* Floating UI Elements */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200/50"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Live</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 bg-themeColor-light rounded-lg shadow-lg p-3 border border-themeColor-border/50"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-themeColor" />
                <span className="text-sm font-medium text-themeColor-text">
                  +127% CTR
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile Image */}
          <div className="md:hidden relative border-[8px] border-themeColor/40 ring-8 ring-themeColor/20 rounded-3xl">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              src="/dashboard.png"
              alt="Dashboard preview"
              className="w-full h-auto rounded-xl shadow-xl border border-gray-200/50"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
