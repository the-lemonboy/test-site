# Cloudflare Pages 部署快速指南

## 🚀 推荐部署方式（Windows 用户）

由于 `@cloudflare/next-on-pages` 在 Windows 上有已知限制，**强烈推荐使用 Cloudflare Dashboard 自动部署**。

### 步骤 1: 准备 Git 仓库

确保你的代码已推送到 Git 仓库（GitHub/GitLab/Bitbucket）。

### 步骤 2: 在 Cloudflare Dashboard 中配置

1. **访问 Cloudflare Dashboard**
   - 打开 https://dash.cloudflare.com
   - 登录你的账户

2. **创建 Pages 项目**
   - 点击左侧菜单的 **Pages**
   - 点击 **Create a project**
   - 选择 **Connect to Git**

3. **连接 Git 仓库**
   - 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
   - 授权 Cloudflare 访问你的仓库
   - 选择 `test-site` 仓库（或你的实际仓库名）

4. **配置构建设置**
   ```
   框架预设: Next.js (Cloudflare) 或 不使用框架预设
   构建命令: pnpm build:cf
   构建输出目录: .vercel/output/static
   根目录: /
   Node.js 版本: 20
   ```
   
   **重要提示**：
   - Cloudflare Pages 会自动从输出目录部署，**不需要手动运行部署命令**
   - 如果遇到 "Workers-specific command" 错误：
     - 确保没有 `wrangler.toml` 文件（已删除）
     - 确保构建命令只包含构建步骤，不包含部署步骤
     - Cloudflare Pages 会自动处理部署，不需要 `wrangler deploy`

5. **配置环境变量**
   在 **Environment variables** 部分添加：
   ```
   STORE_URL = https://store.camthink.ai
   WOO_CONSUMER_KEY = your_consumer_key
   WOO_CONSUMER_SECRET = your_consumer_secret
   CF_PAGES = 1
   NODE_ENV = production
   ```

6. **保存并部署**
   - 点击 **Save and Deploy**
   - Cloudflare 会自动：
     - 检测 `pnpm-lock.yaml` 并使用 pnpm
     - 运行 `pnpm build:cf`
     - 自动处理 `@cloudflare/next-on-pages` 适配
     - 从 `.vercel/output/static` 目录自动部署
   
   **注意**：如果构建日志中出现 "wrangler deploy" 相关错误：
   - 这是 `@cloudflare/next-on-pages` 尝试自动部署导致的
   - **可以忽略这个错误**，只要构建完成并生成了 `.vercel/output/static` 目录
   - Cloudflare Pages 会自动从输出目录部署，不需要 `wrangler deploy` 命令

### 步骤 3: 等待部署完成

- 构建通常需要 2-5 分钟
- 可以在 Dashboard 中查看实时构建日志
- 部署完成后会获得一个免费域名：`your-project.pages.dev`

### 步骤 4: 配置自定义域名（可选）

1. 在项目设置中点击 **Custom domains**
2. 添加你的域名
3. 按照提示配置 DNS 记录

---

## 🔧 其他部署方式

### 方式 A: 使用 WSL（Windows Subsystem for Linux）

如果你安装了 WSL，可以在 Linux 环境中完整运行：

```bash
# 在 WSL 中
cd /mnt/c/Users/admin/Desktop/camthink-site
pnpm install
pnpm build:cf
pnpm cf:deploy
```

### 方式 B: 使用 GitHub Actions

创建一个 GitHub Actions 工作流自动部署：

```yaml
# .github/workflows/cloudflare-pages.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10.12.1
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build:cf
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: camthink-site
          directory: .vercel/output/static
```

---

## 📝 本地验证构建（Windows）

虽然无法在 Windows 上完整运行 `@cloudflare/next-on-pages`，但可以验证 Next.js 构建：

```bash
# 验证 Next.js 构建是否成功
pnpm build:cf
```

这会：
- ✅ 完成 Next.js 构建
- ⚠️ 跳过 `@cloudflare/next-on-pages`（Windows 限制）
- 💡 显示提示：Cloudflare 会在部署时自动处理

---

## 🐛 常见问题

### Q: 为什么 Windows 上无法部署？

A: `@cloudflare/next-on-pages` 内部使用的 `shellac` 工具在 Windows 上无法正确识别 pnpm。这是工具本身的限制，不影响 Cloudflare 的 Linux 构建环境。

### Q: 构建失败怎么办？

A: 
1. 检查 Cloudflare Dashboard 中的构建日志
2. 确认环境变量配置正确
3. 检查 Node.js 版本是否为 20
4. 确认 `pnpm-lock.yaml` 文件存在

### Q: 遇到 "Workers-specific command" 或 "wrangler deploy" 错误？

A: 
1. **已修复**：已删除 `wrangler.toml` 文件（Cloudflare Pages 不需要它）
2. 确保构建命令只包含构建步骤：`pnpm build:cf`
3. **不要**在构建命令中包含 `wrangler deploy` 或任何部署命令
4. Cloudflare Pages 会自动从输出目录部署，不需要手动部署命令
5. **重要**：如果 `@cloudflare/next-on-pages` 在构建后尝试自动部署并报错：
   - 这个错误**通常不会阻止构建完成**
   - `@cloudflare/next-on-pages` 会先完成适配工作，然后才尝试部署
   - 只要 `.vercel/output/static` 目录已生成，Cloudflare Pages 就能正常部署
   - 可以忽略这个部署错误，因为 Cloudflare Pages 会自动处理部署
6. 如果构建完全失败，检查构建日志中 `.vercel/output/static` 目录是否已生成

### Q: API 路由不工作？

A:
1. 确认使用了 `@cloudflare/next-on-pages` 适配器（Cloudflare 会自动处理）
2. 检查 API 路由文件格式是否正确
3. 查看 Cloudflare Functions 日志

### Q: 如何更新部署？

A: 只需推送到 Git 仓库，Cloudflare 会自动检测并重新部署。

---

## 📚 相关资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

---

## ✅ 检查清单

部署前确认：

- [ ] 代码已推送到 Git 仓库
- [ ] 在 Cloudflare Dashboard 中创建了项目
- [ ] 配置了正确的构建命令：`pnpm build:cf`
- [ ] 设置了所有必需的环境变量
- [ ] Node.js 版本设置为 20
- [ ] 构建输出目录设置为 `.vercel/output/static`

部署后验证：

- [ ] 网站可以正常访问
- [ ] API 路由正常工作
- [ ] 静态资源加载正常
- [ ] 环境变量正确生效

