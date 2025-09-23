import type { NextConfig } from "next";

const isCapacitorBuild = process.env.CAPACITOR_BUILD === "true";

const nextConfig: NextConfig = {
  output: isCapacitorBuild ? "export" : undefined,
  images: {
    unoptimized: isCapacitorBuild,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(isCapacitorBuild && {
    trailingSlash: true,
    assetPrefix: "./",
  }),
};

export default nextConfig;
