import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config) => {
    config.externals.push("oracledb", "pg-query-stream", "pg");
    config.ignoreWarnings = [
      (warning: any) =>
        typeof warning.message === "string" &&
        warning.message.includes(
          "Critical dependency: the request of a dependency is an expression"
        ),
    ];
    return config;
  },
};

export default nextConfig;