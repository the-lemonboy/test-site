#!/bin/bash

# 状态检查脚本
# 使用方法: ./scripts/status.sh

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
CURRENT_ENV_FILE=".current-env"
BLUE_PORT=3001
GREEN_PORT=3002

# 检查服务状态
check_service() {
    local env=$1
    local port=$2
    local url="http://localhost:${port}/api/health"
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        local response=$(curl -s "$url")
        echo -e "${GREEN}✓ ${env} 环境运行正常${NC}"
        echo "  端口: ${port}"
        echo "  响应: ${response}"
        return 0
    else
        echo -e "${RED}✗ ${env} 环境不可用${NC}"
        return 1
    fi
}

# 获取当前环境
get_current_env() {
    if [ -f "$CURRENT_ENV_FILE" ]; then
        cat "$CURRENT_ENV_FILE"
    else
        echo "blue"
    fi
}

# 主函数
main() {
    local current_env=$(get_current_env)
    
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}服务状态检查${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    echo -e "${YELLOW}当前激活环境: ${current_env}${NC}"
    echo ""
    
    echo -e "${YELLOW}蓝色环境 (Blue):${NC}"
    check_service "blue" "$BLUE_PORT"
    echo ""
    
    echo -e "${YELLOW}绿色环境 (Green):${NC}"
    check_service "green" "$GREEN_PORT"
    echo ""
    
    echo -e "${YELLOW}Docker 容器状态:${NC}"
    docker-compose ps
    echo ""
    
    echo -e "${BLUE}========================================${NC}"
}

# 执行主函数
main "$@"

