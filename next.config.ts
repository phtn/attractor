import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  hostname: ["media.ed.edmunds-media.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.ed.edmunds-media.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
