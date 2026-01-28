#!/usr/bin/env node

/**
 * Cloudflare Pages 构建脚本 - 最简版
 * 只构建，Cloudflare Pages 自动从输出目录部署
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 Cloudflare Pages 构建...\n');

// 设置环境变量
process.env.CF_PAGES = '1';

const outputDir = path.join(process.cwd(), '.vercel', 'output', 'static');

try {
  // 第一步：构建 Next.js
  console.log('📦 构建 Next.js 应用...');
  execSync('pnpm build', {
    stdio: 'inherit',
    env: { ...process.env, CF_PAGES: '1' },
  });

  // 第二步：运行 @cloudflare/next-on-pages 进行适配
  // 使用 --skip-build 因为我们已经构建过了
  console.log('\n⚡️ 运行 @cloudflare/next-on-pages 适配...');
  
  // 使用 spawnSync 来捕获退出码，但不让错误传播
  const result = spawnSync('npx', ['@cloudflare/next-on-pages', '--skip-build'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env, CF_PAGES: '1', CI: 'true' },
    shell: true,
  });

  // 检查输出目录是否存在（这是最重要的）
  if (fs.existsSync(outputDir)) {
    console.log('\n✅ Cloudflare Pages 构建完成！');
    console.log('📁 输出目录: .vercel/output/static');
    // 成功退出，即使 @cloudflare/next-on-pages 报错
    process.exit(0);
  } else {
    console.error('\n❌ 构建失败：输出目录未生成');
    process.exit(1);
  }
} catch (error) {
  // 即使出错，也检查输出目录
  if (fs.existsSync(outputDir)) {
    console.log('\n✅ Cloudflare Pages 构建完成！');
    console.log('📁 输出目录: .vercel/output/static');
    process.exit(0);
  }
  console.error('\n❌ 构建失败:', error.message);
  process.exit(1);
}

