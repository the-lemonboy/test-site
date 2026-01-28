#!/bin/bash

# 回滚脚本
# 使用方法: ./scripts/rollback.sh

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

# 获取当前运行的环境
get_current_env() {
    if [ -f "$CURRENT_ENV_FILE" ]; then
        cat "$CURRENT_ENV_FILE"
    else
        echo "blue"
    fi
}

# 健康检查
health_check() {
    local env=$1
    local port=$2
    local url="http://localhost:${port}/api/health"
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        return 0
    fi
    return 1
}

# 切换流量
switch_traffic() {
    local target_env=$1
    local nginx_conf="nginx/conf.d/default.conf"
    
    echo -e "${YELLOW}切换流量到 ${target_env} 环境...${NC}"
    
    if [ "$target_env" == "green" ]; then
        sed -i.bak 's/server app-blue:3000 max_fails=3 fail_timeout=30s;/server app-blue:3000 max_fails=3 fail_timeout=30s backup;/' "$nginx_conf"
        sed -i.bak 's/server app-green:3000 max_fails=3 fail_timeout=30s backup;/server app-green:3000 max_fails=3 fail_timeout=30s;/' "$nginx_conf"
    else
        sed -i.bak 's/server app-green:3000 max_fails=3 fail_timeout=30s;/server app-green:3000 max_fails=3 fail_timeout=30s backup;/' "$nginx_conf"
        sed -i.bak 's/server app-blue:3000 max_fails=3 fail_timeout=30s backup;/server app-blue:3000 max_fails=3 fail_timeout=30s;/' "$nginx_conf"
    fi
    
    docker-compose exec -T nginx nginx -s reload || docker-compose restart nginx
    echo "$target_env" > "$CURRENT_ENV_FILE"
    
    echo -e "${GREEN}✓ 流量已切换到 ${target_env} 环境${NC}"
}

# 主回滚流程
main() {
    local current_env=$(get_current_env)
    local rollback_env=$([ "$current_env" == "blue" ] && echo "green" || echo "blue")
    
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}回滚脚本${NC}"
    echo -e "${YELLOW}当前环境: ${current_env}${NC}"
    echo -e "${YELLOW}回滚到: ${rollback_env}${NC}"
    echo -e "${YELLOW}========================================${NC}"
    
    # 检查回滚环境是否健康
    local port=$([ "$rollback_env" == "blue" ] && echo "$BLUE_PORT" || echo "$GREEN_PORT")
    if ! health_check "$rollback_env" "$port"; then
        echo -e "${RED}✗ ${rollback_env} 环境不可用，无法回滚${NC}"
        echo -e "${YELLOW}请先部署 ${rollback_env} 环境${NC}"
        exit 1
    fi
    
    # 确认回滚
    read -p "确认回滚到 ${rollback_env} 环境? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}回滚已取消${NC}"
        exit 0
    fi
    
    # 执行回滚
    switch_traffic "$rollback_env"
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}回滚完成！当前运行环境: ${rollback_env}${NC}"
    echo -e "${GREEN}========================================${NC}"
}

# 执行主函数
main "$@"

