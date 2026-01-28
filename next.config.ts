import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 根据环境变量决定输出模式
  // Cloudflare Pages 部署时不需要 standalone 模式
  // 使用 CF_PAGES 环境变量来区分部署环境
  ...(process.env.CF_PAGES === '1' || process.env.CI === 'true'
    ? {} 
    : { output: 'standalone' } // Docker 部署时使用 standalone
  ),
};

export default nextConfig;
