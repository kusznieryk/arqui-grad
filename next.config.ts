import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds on Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore type checking errors during builds on Vercel
    ignoreBuildErrors: false,
  },
  /* config options here */
};

export default nextConfig;
