import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Timeweb serves the exported files directly; no persistent Node.js process
  // is required after the build finishes.
  output: process.env.NODE_ENV === "development" ? undefined : "export",
  ...(process.env.NODE_ENV === "development" ? {
    async rewrites() {
      return [
        { source: "/content/:path*", destination: "http://127.0.0.1:8081/content/:path*" },
        { source: "/media/:path*", destination: "http://127.0.0.1:8081/media/:path*" },
      ];
    },
  } : {}),
  trailingSlash: true,
};

export default nextConfig;
