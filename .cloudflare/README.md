# Cloudflare Pages 部署指南

## 📋 前置要求

1. Cloudflare 账户
2. 已安装 `@cloudflare/next-on-pages` 和 `wrangler`
3. 配置好环境变量

## 🚀 部署步骤

### 方式一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 进入 Pages 部分

2. **连接 Git 仓库**
   - 点击 "Create a project"
   - 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
   - 授权并选择仓库

3. **配置构建设置**
   - **框架预设**: Next.js
   - **构建命令**: `pnpm build:cf`
   - **构建输出目录**: `.vercel/output/static`
   - **根目录**: `/` (项目根目录)
   - **Node.js 版本**: 18 或 20

4. **配置环境变量**
   在 Cloudflare Pages 设置中添加以下环境变量：
   ```
   STORE_URL=https://store.camthink.ai
   WOO_CONSUMER_KEY=your_consumer_key
   WOO_CONSUMER_SECRET=your_consumer_secret
   CF_PAGES=1
   NODE_ENV=production
   ```

5. **保存并部署**
   - 点击 "Save and Deploy"
   - Cloudflare 会自动构建并部署

### 方式二：使用 Wrangler CLI

**注意**：在 Windows 上，`@cloudflare/next-on-pages` 无法运行，因此无法使用 CLI 部署。请使用方式一（Cloudflare Dashboard）。

**在 Linux/Mac 上**：

1. **登录 Cloudflare**
   ```bash
   pnpm wrangler login
   ```

2. **构建项目**
   ```bash
   pnpm build:cf
   ```

3. **部署到生产环境**
   ```bash
   pnpm cf:deploy
   ```

4. **本地预览**
   ```bash
   pnpm cf:preview
   ```

## 🔧 环境变量配置

### 必需的环境变量

- `STORE_URL`: WooCommerce 商店 URL
- `WOO_CONSUMER_KEY`: WooCommerce API Consumer Key
- `WOO_CONSUMER_SECRET`: WooCommerce API Consumer Secret

### 可选的环境变量

- `CF_PAGES`: 设置为 `1` 以启用 Cloudflare Pages 模式
- `NODE_ENV`: 设置为 `production`

## 📝 注意事项

1. **Windows 本地构建问题**
   - `@cloudflare/next-on-pages` 在 Windows 上**无法正确识别 pnpm**（工具内部使用 shellac 执行命令）
   - 这是工具本身的限制，**完全不影响 Cloudflare 部署**
   - 解决方案：
     - ✅ **推荐**：直接在 Cloudflare Dashboard 中部署，Cloudflare 的 Linux 构建环境会自动处理
     - ✅ 本地只需运行 `pnpm build:cf` 验证 Next.js 构建是否成功（会跳过适配步骤）
     - ✅ 如需完整本地测试，使用 WSL（Windows Subsystem for Linux）
   - 在 Cloudflare Pages 的 Linux 构建环境中会自动检测 `pnpm-lock.yaml` 并使用 pnpm，完全正常工作

2. **Next.js 16 兼容性**
   - `@cloudflare/next-on-pages` 可能不完全支持 Next.js 16
   - 如果遇到问题，考虑降级到 Next.js 15 或使用 OpenNext 适配器

3. **API 路由**
   - Cloudflare Pages 支持 Next.js API 路由
   - 确保所有 API 路由都使用标准的 Next.js 格式

4. **静态资源**
   - 静态文件会自动从 `public/` 目录提供
   - 确保所有资源路径使用相对路径

5. **构建时间限制**
   - Cloudflare Pages 免费版构建时间限制为 20 分钟
   - 如果构建超时，考虑优化构建过程

6. **包管理器自动检测**
   - Cloudflare Pages 会自动检测 `pnpm-lock.yaml` 文件并使用 pnpm
   - `package.json` 中已设置 `packageManager` 字段确保使用正确的版本

## 🐛 故障排除

### 构建失败

1. 检查 Node.js 版本是否兼容
2. 确认所有依赖都已正确安装
3. 查看 Cloudflare 构建日志

### API 路由不工作

1. 确认使用了 `@cloudflare/next-on-pages` 适配器
2. 检查路由文件格式是否正确
3. 查看 Cloudflare Functions 日志

### 环境变量未生效

1. 在 Cloudflare Dashboard 中重新设置环境变量
2. 确认变量名称拼写正确
3. 重新部署项目

## 📚 相关资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

