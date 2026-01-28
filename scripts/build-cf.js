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
    const env = {
      ...process.env,
      CF_PAGES: '1',
      CI: process.env.CI || 'true',
      CLOUDFLARE_PAGES: '1',
    };
    
    const outputDir = path.join(process.cwd(), '.vercel', 'output', 'static');
    
    try {
      // 运行 @cloudflare/next-on-pages
      // 它可能会尝试自动部署，但我们会捕获错误
      execSync('npx @cloudflare/next-on-pages', {
        stdio: 'inherit',
        cwd: process.cwd(),
        env,
      });
    } catch (error) {
      // 检查是否是部署相关的错误
      const errorMessage = error.message || error.toString();
      const isDeployError = 
        errorMessage.includes('wrangler deploy') ||
        errorMessage.includes('Workers-specific command') ||
        errorMessage.includes('wrangler.jsonc');
      
      if (isDeployError) {
        console.log('\n⚠️  检测到部署相关错误（这是预期的）');
        console.log('⚠️  @cloudflare/next-on-pages 尝试自动部署，但这是 Pages 项目');
        console.log('⚠️  正在检查构建输出...\n');
        
        // 检查输出目录是否存在
        if (fs.existsSync(outputDir)) {
          console.log('✅ 构建输出目录已生成！');
          console.log('✅ 构建成功，可以忽略部署错误');
          console.log('💡 Cloudflare Pages 会自动从输出目录部署\n');
        } else {
          // 如果输出目录不存在，说明构建真的失败了
          throw new Error('构建失败：输出目录未生成');
        }
      } else {
        // 如果不是部署错误，说明构建真的失败了
        throw error;
      }
    }
    
    // 最终验证输出目录
    if (fs.existsSync(outputDir)) {
      console.log('\n✅ Cloudflare Pages 构建完成！');
      console.log('📁 输出目录: .vercel/output/static');
      console.log('💡 Cloudflare Pages 会自动从该目录部署');
    } else {
      throw new Error('构建失败：输出目录未生成');
    }
  }
} catch (error) {
  console.error('\n❌ 构建失败:', error.message);
  if (isWindows && error.message.includes('pnpm')) {
    console.error('\n💡 提示：这是 Windows 上的已知问题');
    console.error('💡 Next.js 构建已完成，Cloudflare 会在部署时自动处理适配');
  }
  process.exit(1);
}

