#!/usr/bin/env node

/**
 * Cloudflare Pages 预览脚本
 * 处理 Windows 上 .vercel/output/static 目录不存在的情况
 */

const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const isWindows = os.platform() === 'win32';
const outputDir = path.join(process.cwd(), '.vercel', 'output', 'static');

console.log('🔍 准备预览 Cloudflare Pages...\n');

// 检查输出目录是否存在
if (!fs.existsSync(outputDir)) {
  if (isWindows) {
    console.log('⚠️  检测到 Windows 系统');
    console.log('⚠️  .vercel/output/static 目录不存在（因为 @cloudflare/next-on-pages 在 Windows 上无法运行）\n');
    console.log('💡 解决方案：');
    console.log('   1. 推荐：使用 Cloudflare Dashboard 的预览功能');
    console.log('      - 推送到 Git 仓库');
    console.log('      - Cloudflare 会自动创建预览部署\n');
    console.log('   2. 或者：使用 WSL（Windows Subsystem for Linux）');
    console.log('      - 在 WSL 中运行: pnpm build:cf && pnpm cf:preview\n');
    console.log('   3. 或者：本地使用 Next.js 开发服务器');
    console.log('      - 运行: pnpm dev\n');
    process.exit(1);
  } else {
    console.log('❌ .vercel/output/static 目录不存在');
    console.log('💡 请先运行: pnpm build:cf\n');
    process.exit(1);
  }
}

try {
  console.log('🔍 启动本地预览服务器...\n');
  execSync('wrangler pages dev .vercel/output/static', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
} catch (error) {
  console.error('\n❌ 预览失败:', error.message);
  process.exit(1);
}

