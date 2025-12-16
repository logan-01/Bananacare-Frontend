import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
    assetPrefix: "/",
  }),
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
