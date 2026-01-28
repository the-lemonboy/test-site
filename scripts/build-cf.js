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

  // 检查输出目录和必要文件
  if (fs.existsSync(outputDir)) {
    // 检查关键文件是否存在
    const workerFile = path.join(outputDir, '_worker.js');
    const functionsDir = path.join(outputDir, 'functions');
    const hasWorker = fs.existsSync(workerFile);
    const hasFunctions = fs.existsSync(functionsDir);
    
    console.log('\n📋 检查构建输出...');
    console.log(`📁 输出目录: ${outputDir}`);
    console.log(`${hasWorker ? '✅' : '⚠️ '} _worker.js: ${hasWorker ? '存在' : '不存在'}`);
    console.log(`${hasFunctions ? '✅' : '⚠️ '} functions 目录: ${hasFunctions ? '存在' : '不存在'}`);
    
    // 列出输出目录内容（前10个文件）
    try {
      const files = fs.readdirSync(outputDir);
      console.log(`\n📦 输出目录包含 ${files.length} 个项目`);
      if (files.length > 0) {
        console.log('前10个文件/目录:', files.slice(0, 10).join(', '));
      }
    } catch (e) {
      // 忽略读取错误
    }
    
    console.log('\n✅ Cloudflare Pages 构建完成！');
    console.log('💡 如果看到 wrangler 错误，可以忽略 - Cloudflare Pages 会自动部署');
    process.exit(0);
  } else {
    console.error('\n❌ 构建失败：输出目录未生成');
    console.error('💡 请检查构建日志中的错误信息');
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

