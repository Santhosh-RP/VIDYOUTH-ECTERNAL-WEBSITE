import type { NextConfig } from "next";

// Static export so the marketing/landing site can be hosted on S3 + CloudFront
// (same pattern as the SPA) — `next build` emits a static `out/` folder.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // required for static export (no Image Optimizer)
  trailingSlash: true,           // each route -> /route/index.html (clean on S3)
};

export default nextConfig;
