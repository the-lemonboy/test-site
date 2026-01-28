# 快速启动指南

## 🚀 在阿里云 ECS 上部署

### 1. 连接到服务器

```bash
ssh root@your-server-ip
```

### 2. 安装 Docker 和 Docker Compose

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | bash
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 3. 上传项目文件

```bash
# 方式1: 使用 Git
git clone <your-repo-url>
cd nexttemplate

# 方式2: 使用 SCP (从本地)
scp -r . root@your-server-ip:/opt/camthink
ssh root@your-server-ip
cd /opt/camthink
```

### 4. 给脚本添加执行权限

```bash
chmod +x scripts/*.sh
```

### 5. 首次部署

```bash
# 启动所有服务
docker-compose up -d

# 检查状态
./scripts/status.sh

# 查看日志
docker-compose logs -f
```

### 6. 部署新版本

```bash
# 自动部署（推荐）
./scripts/deploy.sh

# 或指定环境
./scripts/deploy.sh green
```

### 7. 回滚（如需要）

```bash
./scripts/rollback.sh
```

## 📋 常用命令

```bash
# 查看服务状态
./scripts/status.sh

# 查看日志
docker-compose logs -f app-blue
docker-compose logs -f app-green
docker-compose logs -f nginx

# 停止所有服务
docker-compose down

# 重启服务
docker-compose restart

# 查看容器
docker-compose ps

# 进入容器
docker-compose exec app-blue sh
```

## 🔧 配置阿里云安全组

在阿里云控制台配置安全组规则：

| 端口 | 协议 | 授权对象 | 说明 |
|------|------|----------|------|
| 80 | TCP | 0.0.0.0/0 | HTTP |
| 443 | TCP | 0.0.0.0/0 | HTTPS |
| 22 | TCP | 你的IP | SSH（限制访问） |

## ⚠️ 注意事项

1. **首次部署**: 确保服务器有足够的资源（推荐 2核4G 或更高）
2. **域名配置**: 如有域名，配置 DNS 解析到服务器 IP
3. **SSL 证书**: 生产环境建议配置 HTTPS
4. **备份**: 定期备份 `.current-env` 文件和 nginx 配置
5. **监控**: 建议配置监控和告警

## 🆘 故障排查

### 容器无法启动

```bash
# 检查 Docker 服务
systemctl status docker

# 查看详细错误
docker-compose logs app-blue
```

### 端口被占用

```bash
# 检查端口占用
netstat -tulpn | grep :80
netstat -tulpn | grep :3001

# 停止占用端口的服务
docker-compose down
```

### 健康检查失败

```bash
# 手动测试
curl http://localhost:3001/api/health
curl http://localhost:3002/api/health

# 检查容器是否运行
docker-compose ps
```

---

更多详细信息请查看 [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)

