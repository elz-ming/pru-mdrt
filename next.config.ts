import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "h6o7e2zxiywutuwc.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
