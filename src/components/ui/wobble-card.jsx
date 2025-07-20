"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const WobbleCard = ({
  children,
  containerClassName,
  className
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };
  
  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1.02, 1.02, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.15s ease-out",
      }}
      className={cn(
        "mx-auto w-full bg-gradient-to-br from-white via-themeColor-light/20 to-themeColor-muted/30 relative rounded-2xl overflow-hidden group cursor-pointer",
        containerClassName
      )}
    >
      {/* Animated border glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-themeColor/20 to-themeColor-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      
      <div
        className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.8),rgba(255,255,255,0.1))] sm:mx-0 sm:rounded-2xl overflow-hidden"
        style={{
          boxShadow: isHovering
            ? "0 20px 40px rgba(235, 103, 83, 0.15), 0 8px 32px rgba(235, 103, 83, 0.1), 0 0 0 1px rgba(235, 103, 83, 0.1)"
            : "0 10px 32px rgba(235, 103, 83, 0.08), 0 1px 1px rgba(235, 103, 83, 0.03), 0 0 0 1px rgba(235, 103, 83, 0.05), 0 4px 6px rgba(235, 103, 83, 0.06)",
        }}
      >
        <motion.div
          style={{
            transform: isHovering
              ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.01, 1.01, 1)`
              : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
            transition: "transform 0.15s ease-out",
          }}
          className={cn("h-full px-6 py-8 sm:px-8", className)}
        >
          <Noise />
          <ShimmerEffect />
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

const Noise = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-[0.03] [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage: "url(/noise.webp)",
        backgroundSize: "30%",
      }}
    />
  );
};

const ShimmerEffect = () => {
  return (
    <div className="absolute inset-0 -top-40 -bottom-40 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
      <div
        className="absolute inset-0 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm animate-shimmer"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          transform: "translateX(-100%)",
          animation: "shimmer 3s ease-in-out infinite",
        }}
      />
    </div>
  );
};

export default WobbleCard;