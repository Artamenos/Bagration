import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Timeweb serves the exported files directly; no persistent Node.js process
  // is required after the build finishes.
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
