import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack + next-mdx-remote の互換用（upstream issue 回避）
  transpilePackages: ['next-mdx-remote'],
};

export default nextConfig;
