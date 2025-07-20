import React from "react";
import { motion } from "framer-motion";
import { Zap, LinkIcon, BarChart2 } from "lucide-react";

const LoadingSpinner = ({ 
  size = "default", 
  message = "Loading your links...", 
  variant = "dashboard" 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    default: "w-16 h-16", 
    lg: "w-24 h-24"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8"
  };

  if (variant === "dashboard") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center py-12 space-y-6"
      >
        {/* Animated Icon Container */}
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className={`${sizeClasses[size]} border-4 border-themeColor/20 border-t-themeColor rounded-full`}
          />
          
          {/* Inner pulsing icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="p-3 bg-themeColor/10 rounded-xl">
              <Zap className={`${iconSizes[size]} text-themeColor`} />
            </div>
          </motion.div>
        </div>

        {/* Loading Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <h3 className="text-lg font-medium text-themeColor-text">
            {message}
          </h3>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="text-sm text-gray-600"
          >
            Please wait while we fetch your data...
          </motion.div>
        </motion.div>

        {/* Floating Icons Animation */}
        <div className="relative w-full max-w-sm h-16">
          {[LinkIcon, BarChart2, Zap].map((Icon, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -10, 0],
                x: [0, 5, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.4,
                ease: "easeInOut"
              }}
              className="absolute"
              style={{
                left: `${20 + index * 30}%`,
                top: '50%'
              }}
            >
              <div className="p-2 bg-themeColor/5 rounded-lg">
                <Icon className="w-4 h-4 text-themeColor/60" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Minimal variant for inline loading
  if (variant === "minimal") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center space-x-3 py-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className={`${sizeClasses[size]} border-3 border-themeColor/20 border-t-themeColor rounded-full`}
        />
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="text-sm font-medium text-themeColor-text"
        >
          {message}
        </motion.span>
      </motion.div>
    );
  }

  // Card variant for loading states within cards
  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-8 space-y-4 rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5"
      >
        {/* Spinner with gradient background */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className={`${sizeClasses[size]} border-4 border-transparent bg-gradient-to-r from-themeColor via-themeColor-dark to-themeColor bg-clip-border rounded-full`}
            style={{
              background: `conic-gradient(from 0deg, var(--theme-color), var(--theme-color-dark), var(--theme-color), transparent)`
            }}
          />
          <div className={`absolute inset-1 bg-white rounded-full`} />
          
          {/* Center icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Zap className={`${iconSizes[size]} text-themeColor`} />
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="text-center"
        >
          <div className="text-sm font-medium text-themeColor-text">
            {message}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Default spinner
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-screen"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className={`${sizeClasses[size]} border-4 border-themeColor/20 border-t-themeColor rounded-full`}
      />
    </motion.div>
  );
};

export default LoadingSpinner;