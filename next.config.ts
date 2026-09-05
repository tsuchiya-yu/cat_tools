import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack + next-mdx-remote の互換用。
  // upstream: https://github.com/vercel/next.js/issues/64525
  // remove when next-mdx-remote works with Turbopack without transpilePackages
  transpilePackages: ['next-mdx-remote'],
};

export default nextConfig;
