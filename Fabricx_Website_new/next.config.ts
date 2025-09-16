import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // esmExternals: 'loose' - removed for Turbopack compatibility
  },
  output: "export",
  trailingSlash: true,
  transpilePackages: ["@chatscope/chat-ui-kit-react"],
  images: {
    unoptimized: true, // Added to fix Image Optimization error with static export
  },

  // 🚫 Disable linting & type-check errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withFlowbiteReact(nextConfig);
