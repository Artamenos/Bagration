import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Timeweb virtual hosting serves static files and cannot keep a Next.js
  // Node.js server running. `next build` will therefore create an `out`
  // directory that can be uploaded directly to the test domain.
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
