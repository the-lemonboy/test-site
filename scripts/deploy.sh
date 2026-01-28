#!/bin/bash

# 蓝绿部署脚本
# 使用方法: ./scripts/deploy.sh [blue|green]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
CURRENT_ENV_FILE=".current-env"
BLUE_PORT=3001
GREEN_PORT=3002
HEALTH_CHECK_URL="http://localhost"
HEALTH_CHECK_TIMEOUT=60

# 获取当前运行的环境
get_current_env() {
    if [ -f "$CURRENT_ENV_FILE" ]; then
        cat "$CURRENT_ENV_FILE"
    else
        echo "blue"  # 默认蓝色环境
    fi
}

# 设置当前环境
set_current_env() {
    echo "$1" > "$CURRENT_ENV_FILE"
}

# 健康检查
health_check() {
    local env=$1
    local port=$2
    local url="${HEALTH_CHECK_URL}:${port}/api/health"
    
    echo -e "${YELLOW}检查 ${env} 环境健康状态...${NC}"
    
    for i in {1..30}; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ ${env} 环境健康检查通过${NC}"
            return 0
        fi
        echo -e "${YELLOW}等待 ${env} 环境启动... (${i}/30)${NC}"
        sleep 2
    done
    
    echo -e "${RED}✗ ${env} 环境健康检查失败${NC}"
    return 1
}

# 部署到指定环境
deploy_to_env() {
    local target_env=$1
    local compose_file="docker-compose.${target_env}.yml"
    
    echo -e "${YELLOW}开始部署到 ${target_env} 环境...${NC}"
    
    # 构建并启动目标环境
    docker-compose -f docker-compose.yml -f "$compose_file" build --no-cache
    docker-compose -f docker-compose.yml -f "$compose_file" up -d "app-${target_env}"
    
    # 等待容器启动
    echo -e "${YELLOW}等待容器启动...${NC}"
    sleep 10
    
    # 健康检查
    local port=$([ "$target_env" == "blue" ] && echo "$BLUE_PORT" || echo "$GREEN_PORT")
    if ! health_check "$target_env" "$port"; then
        echo -e "${RED}部署失败: ${target_env} 环境健康检查未通过${NC}"
        docker-compose -f docker-compose.yml -f "$compose_file" down
        exit 1
    fi
    
    echo -e "${GREEN}✓ ${target_env} 环境部署成功${NC}"
}

# 切换流量
switch_traffic() {
    local target_env=$1
    local nginx_conf="nginx/conf.d/default.conf"
    
    echo -e "${YELLOW}切换流量到 ${target_env} 环境...${NC}"
    
    # 更新 nginx 配置
    if [ "$target_env" == "green" ]; then
        # 切换到绿色环境
        sed -i.bak 's/server app-blue:3000 max_fails=3 fail_timeout=30s;/server app-blue:3000 max_fails=3 fail_timeout=30s backup;/' "$nginx_conf"
        sed -i.bak 's/server app-green:3000 max_fails=3 fail_timeout=30s backup;/server app-green:3000 max_fails=3 fail_timeout=30s;/' "$nginx_conf"
    else
        # 切换回蓝色环境
        sed -i.bak 's/server app-green:3000 max_fails=3 fail_timeout=30s;/server app-green:3000 max_fails=3 fail_timeout=30s backup;/' "$nginx_conf"
        sed -i.bak 's/server app-blue:3000 max_fails=3 fail_timeout=30s backup;/server app-blue:3000 max_fails=3 fail_timeout=30s;/' "$nginx_conf"
    fi
    
    # 重新加载 nginx
    docker-compose exec -T nginx nginx -s reload || docker-compose restart nginx
    
    # 设置当前环境
    set_current_env "$target_env"
    
    echo -e "${GREEN}✓ 流量已切换到 ${target_env} 环境${NC}"
}

# 主部署流程
main() {
    local current_env=$(get_current_env)
    local target_env=$([ "$current_env" == "blue" ] && echo "green" || echo "blue")
    
    # 如果指定了环境，使用指定的环境
    if [ -n "$1" ]; then
        if [ "$1" == "blue" ] || [ "$1" == "green" ]; then
            target_env=$1
        else
            echo -e "${RED}错误: 无效的环境参数。请使用 'blue' 或 'green'${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}蓝绿部署脚本${NC}"
    echo -e "${GREEN}当前环境: ${current_env}${NC}"
    echo -e "${GREEN}目标环境: ${target_env}${NC}"
    echo -e "${GREEN}========================================${NC}"
    
    # 1. 部署到目标环境
    deploy_to_env "$target_env"
    
    # 2. 切换流量
    read -p "是否切换流量到 ${target_env} 环境? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        switch_traffic "$target_env"
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}部署完成！当前运行环境: ${target_env}${NC}"
        echo -e "${GREEN}========================================${NC}"
    else
        echo -e "${YELLOW}流量未切换，${target_env} 环境已部署但未激活${NC}"
    fi
}

# 执行主函数
main "$@"

