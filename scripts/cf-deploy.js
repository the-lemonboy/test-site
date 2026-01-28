#!/usr/bin/env node

/**
 * Cloudflare Pages 部署脚本
 * 处理 Windows 上 .vercel/output/static 目录不存在的情况
 */

const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const isWindows = os.platform() === 'win32';
const outputDir = path.join(process.cwd(), '.vercel', 'output', 'static');

console.log('🚀 准备部署到 Cloudflare Pages...\n');

// 检查输出目录是否存在
if (!fs.existsSync(outputDir)) {
  if (isWindows) {
    console.log('⚠️  检测到 Windows 系统');
    console.log('⚠️  .vercel/output/static 目录不存在（因为 @cloudflare/next-on-pages 在 Windows 上无法运行）\n');
    console.log('💡 解决方案：');
    console.log('   1. 推荐：直接在 Cloudflare Dashboard 中部署');
    console.log('      - 访问 https://dash.cloudflare.com');
    console.log('      - 进入 Pages → Create a project');
    console.log('      - 连接 Git 仓库，Cloudflare 会自动构建和部署\n');
    console.log('   2. 或者：使用 WSL（Windows Subsystem for Linux）');
    console.log('      - 在 WSL 中运行: pnpm build:cf && pnpm cf:deploy\n');
    console.log('   3. 或者：手动上传构建产物');
    console.log('      - 在 Linux/Mac 环境中构建后上传\n');
    process.exit(1);
  } else {
    console.log('❌ .vercel/output/static 目录不存在');
    console.log('💡 请先运行: pnpm build:cf\n');
    process.exit(1);
  }
}

try {
  console.log('📤 部署到 Cloudflare Pages...\n');
  execSync('wrangler pages deploy .vercel/output/static', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  console.log('\n✅ 部署完成！');
} catch (error) {
  console.error('\n❌ 部署失败:', error.message);
  process.exit(1);
}

