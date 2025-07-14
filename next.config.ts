import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "https://media.ed.edmunds-media.com",
        protocol: "https",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
