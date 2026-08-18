import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/digitaler-werkzeugschrank",
  assetPrefix: "/digitaler-werkzeugschrank/",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
