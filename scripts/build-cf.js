#!/usr/bin/env node

/**
 * Cloudflare Pages 构建脚本
 * 注意：@cloudflare/next-on-pages 在 Windows 上有已知问题
 * 在 Cloudflare 的 Linux 构建环境中会自动处理，无需本地运行
 */

const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const isWindows = os.platform() === 'win32';

console.log('🚀 开始 Cloudflare Pages 构建...\n');

// 设置环境变量
process.env.CF_PAGES = '1';

try {
  // 第一步：构建 Next.js
  console.log('📦 构建 Next.js 应用...');
  execSync('pnpm build', {
    stdio: 'inherit',
    env: { ...process.env, CF_PAGES: '1' },
  });

  // 第二步：运行 @cloudflare/next-on-pages
  if (isWindows) {
    console.log('\n⚠️  检测到 Windows 系统');
    console.log('⚠️  @cloudflare/next-on-pages 在 Windows 上无法正确识别 pnpm');
    console.log('⚠️  这是工具本身的限制，不影响 Cloudflare 部署');
    console.log('⚠️  在 Cloudflare Pages 的 Linux 构建环境中会自动处理\n');
    
    // 检查 .vercel 目录是否存在
    const vercelDir = path.join(process.cwd(), '.vercel');
    if (!fs.existsSync(vercelDir)) {
      console.log('📝 提示：本地构建已完成 Next.js 部分');
      console.log('📝 Cloudflare 会在部署时自动运行 @cloudflare/next-on-pages');
      console.log('📝 你可以直接推送到 Git 仓库，让 Cloudflare 自动部署\n');
    }
    
    console.log('✅ Next.js 构建完成！');
    console.log('📁 输出目录: .next/');
    console.log('💡 提示：完整的 Cloudflare 适配将在 Cloudflare 构建环境中自动完成');
  } else {
    // Linux/Mac 上正常使用
    console.log('\n⚡️ 运行 @cloudflare/next-on-pages...');
    // 设置环境变量防止自动部署
    // 在 Cloudflare Pages 构建环境中，CI 环境变量会被设置
    const env = {
      ...process.env,
      CF_PAGES: '1',
      // 确保在 CI 环境中（Cloudflare Pages 会自动设置）
      // 这可以防止 @cloudflare/next-on-pages 尝试自动部署
      CI: process.env.CI || 'true',
      // 明确告诉工具这是 Pages 项目，不是 Workers
      CLOUDFLARE_PAGES: '1',
    };
    
    // 运行 @cloudflare/next-on-pages
    // 注意：即使它尝试部署，Cloudflare Pages 构建环境会阻止 Workers 命令
    execSync('npx @cloudflare/next-on-pages', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env,
    });
    
    console.log('\n✅ Cloudflare Pages 构建完成！');
    console.log('📁 输出目录: .vercel/output/static');
    console.log('💡 Cloudflare Pages 会自动从该目录部署');
    console.log('⚠️  如果看到部署错误，可以忽略 - Cloudflare Pages 会自动处理部署');
  }
} catch (error) {
  console.error('\n❌ 构建失败:', error.message);
  if (isWindows && error.message.includes('pnpm')) {
    console.error('\n💡 提示：这是 Windows 上的已知问题');
    console.error('💡 Next.js 构建已完成，Cloudflare 会在部署时自动处理适配');
  }
  process.exit(1);
}

