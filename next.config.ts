import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 根据环境变量决定输出模式
  // Vercel 部署：不需要 standalone（Vercel 自动处理）
  // Cloudflare Pages 部署：不需要 standalone
  // Docker 部署：使用 standalone
  ...(process.env.CF_PAGES === '1' || process.env.VERCEL === '1' || process.env.CI === 'true'
    ? {} 
    : { output: 'standalone' } // Docker 部署时使用 standalone
  ),
};

export default nextConfig;
