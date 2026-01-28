# Docker 蓝绿部署指南

本文档说明如何在阿里云上使用 Docker Compose 实现蓝绿部署。

## 📋 目录结构

```
.
├── Dockerfile                 # Docker 镜像构建文件
├── .dockerignore              # Docker 忽略文件
├── docker-compose.yml         # 主配置文件
├── docker-compose.blue.yml    # 蓝色环境配置
├── docker-compose.green.yml   # 绿色环境配置
├── nginx/
│   ├── nginx.conf            # Nginx 主配置
│   └── conf.d/
│       └── default.conf      # Nginx 站点配置
└── scripts/
    ├── deploy.sh             # 部署脚本
    ├── rollback.sh           # 回滚脚本
    └── status.sh             # 状态检查脚本
```

## 🚀 快速开始

### 1. 前置要求

- Docker 20.10+
- Docker Compose 2.0+
- 阿里云 ECS 实例（推荐 2核4G 或更高配置）

### 2. 安装 Docker 和 Docker Compose

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | bash

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. 配置项目

```bash
# 克隆项目
git clone <your-repo-url>
cd nexttemplate

# 给脚本添加执行权限
chmod +x scripts/*.sh
```

## 📦 部署流程

### 初始部署

```bash
# 1. 启动所有服务（包括 nginx、blue、green）
docker-compose up -d

# 2. 检查服务状态
./scripts/status.sh

# 3. 默认流量指向蓝色环境
# 首次部署后，蓝色环境为生产环境
```

### 蓝绿部署新版本

```bash
# 方式1: 自动选择环境（推荐）
# 脚本会自动选择与当前环境相反的环境进行部署
./scripts/deploy.sh

# 方式2: 指定部署到绿色环境
./scripts/deploy.sh green

# 方式3: 指定部署到蓝色环境
./scripts/deploy.sh blue
```

部署流程：
1. 构建新版本镜像
2. 启动目标环境容器
3. 执行健康检查
4. 确认后切换流量

### 回滚到上一个版本

```bash
# 快速回滚到上一个环境
./scripts/rollback.sh
```

回滚流程：
1. 检查目标环境是否可用
2. 确认后切换流量
3. 完成回滚

## 🔍 监控和检查

### 检查服务状态

```bash
# 查看所有服务状态
./scripts/status.sh

# 查看 Docker 容器状态
docker-compose ps

# 查看日志
docker-compose logs -f app-blue
docker-compose logs -f app-green
docker-compose logs -f nginx
```

### 健康检查端点

- 主健康检查: `http://your-domain/health`
- 蓝色环境: `http://your-domain:3001/api/health`
- 绿色环境: `http://your-domain:3002/api/health`
- Nginx 健康检查: `http://your-domain/health/blue` 和 `/health/green`

## 🔧 配置说明

### 端口配置

- `80`: Nginx HTTP 端口
- `443`: Nginx HTTPS 端口（需要配置 SSL）
- `3001`: 蓝色环境端口
- `3002`: 绿色环境端口

### 环境变量

可以在 `docker-compose.yml` 中添加环境变量：

```yaml
environment:
  - NODE_ENV=production
  - DATABASE_URL=your-database-url
  - API_KEY=your-api-key
```

### Nginx 配置

Nginx 配置位于 `nginx/conf.d/default.conf`，默认配置：
- 主流量指向蓝色环境
- 绿色环境作为备用
- 支持健康检查
- 静态文件缓存

## 🔐 安全配置

### 1. 配置 HTTPS

```bash
# 将 SSL 证书放到 nginx/ssl/ 目录
mkdir -p nginx/ssl
cp your-cert.crt nginx/ssl/
cp your-key.key nginx/ssl/
```

更新 `nginx/conf.d/default.conf` 添加 HTTPS 配置。

### 2. 防火墙配置

```bash
# 阿里云安全组配置
# 开放端口: 80, 443
# 限制 SSH: 22 (仅允许特定 IP)
```

### 3. 环境变量安全

使用阿里云密钥管理服务（KMS）或 Docker Secrets 管理敏感信息。

## 📊 蓝绿部署策略

### 部署流程

```
1. 当前生产环境: Blue (端口 3001)
   ↓
2. 部署新版本到: Green (端口 3002)
   ↓
3. 健康检查通过
   ↓
4. 切换流量到: Green
   ↓
5. 观察运行情况
   ↓
6. 如有问题，回滚到: Blue
```

### 回滚策略

- **自动回滚**: 如果新环境健康检查失败，自动停止部署
- **手动回滚**: 使用 `rollback.sh` 脚本快速回滚
- **保留旧版本**: 旧环境容器保持运行，便于快速切换

## 🐛 故障排查

### 容器无法启动

```bash
# 查看容器日志
docker-compose logs app-blue
docker-compose logs app-green

# 检查镜像
docker images | grep camthink

# 重新构建
docker-compose build --no-cache
```

### 健康检查失败

```bash
# 手动检查健康端点
curl http://localhost:3001/api/health
curl http://localhost:3002/api/health

# 检查容器状态
docker-compose ps
```

### Nginx 配置问题

```bash
# 测试 Nginx 配置
docker-compose exec nginx nginx -t

# 重新加载配置
docker-compose exec nginx nginx -s reload
```

## 📝 最佳实践

1. **版本标签**: 使用 Git 标签标记每个部署版本
2. **备份**: 部署前备份当前环境配置
3. **监控**: 集成监控系统（如 Prometheus + Grafana）
4. **日志**: 配置日志收集（如 ELK Stack）
5. **测试**: 在测试环境验证部署流程
6. **文档**: 记录每次部署的变更内容

## 🔄 持续集成

### GitHub Actions 示例

```yaml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        run: |
          ssh user@your-server "cd /path/to/app && ./scripts/deploy.sh"
```

## 📞 支持

如有问题，请查看：
- Docker 日志: `docker-compose logs`
- Nginx 日志: `docker-compose logs nginx`
- 应用日志: 查看容器内部日志

---

**注意**: 生产环境部署前，请务必在测试环境验证所有配置和脚本。

