/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Moved from experimental.serverComponentsExternalPackages to serverExternalPackages
  serverExternalPackages: [
    "geoip-lite",
    "mongoose", 
    "bcrypt",
    "jsonwebtoken",
    "nodemailer",
    "winston",
    "maxmind"
  ],
  
  // Keep experimental section for any actual experimental features
  experimental: {
    // Add any Next.js 15 experimental features here if needed
    // ppr: true, // Partial Prerendering
    // reactCompiler: true, // React Compiler
  },
};

export default nextConfig;