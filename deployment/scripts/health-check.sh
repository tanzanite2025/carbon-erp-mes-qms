#!/bin/bash

# Carbon 健康检查脚本
# 检查所有服务是否正常运行

set -e

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# 检查 HTTP 状态
check_http() {
    local url=$1
    local name=$2
    local status=$(curl -s -o /dev/null -w "%{http_code}" $url)
    
    if [ $status -eq 200 ]; then
        log_info "$name 正常 (HTTP $status)"
        return 0
    else
        log_error "$name 异常 (HTTP $status)"
        return 1
    fi
}

# 检查 PM2 进程
check_pm2() {
    local app=$1
    local status=$(pm2 jlist | jq -r ".[] | select(.name==\"$app\") | .pm2_env.status")
    
    if [ "$status" = "online" ]; then
        log_info "PM2 $app 正常"
        return 0
    else
        log_error "PM2 $app 异常 (状态: $status)"
        return 1
    fi
}

# 检查 Docker 容器
check_docker() {
    local container=$1
    local status=$(docker inspect -f '{{.State.Status}}' $container 2>/dev/null || echo "not found")
    
    if [ "$status" = "running" ]; then
        log_info "Docker $container 正常"
        return 0
    else
        log_error "Docker $container 异常 (状态: $status)"
        return 1
    fi
}

# 主函数
main() {
    echo "========================================="
    echo "Carbon ERP/MES 健康检查"
    echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "========================================="
    echo ""
    
    local failed=0
    
    # 检查 PM2 应用
    echo "检查 PM2 应用..."
    check_pm2 "carbon-erp" || ((failed++))
    check_pm2 "carbon-mes" || ((failed++))
    echo ""
    
    # 检查 Docker 容器
    echo "检查 Docker 容器..."
    check_docker "supabase-db" || ((failed++))
    check_docker "supabase-storage" || ((failed++))
    check_docker "supabase-kong" || ((failed++))
    echo ""
    
    # 检查 HTTP 端点
    echo "检查 HTTP 端点..."
    check_http "http://localhost:4000" "ERP (本地)" || ((failed++))
    check_http "http://localhost:4001" "MES (本地)" || ((failed++))
    
    # 如果配置了域名，检查 HTTPS
    if [ -n "$DOMAIN" ]; then
        check_http "https://erp.$DOMAIN" "ERP (HTTPS)" || ((failed++))
        check_http "https://mes.$DOMAIN" "MES (HTTPS)" || ((failed++))
    fi
    echo ""
    
    # 检查数据库
    echo "检查数据库..."
    if docker exec supabase-db pg_isready -U postgres > /dev/null 2>&1; then
        log_info "PostgreSQL 正常"
    else
        log_error "PostgreSQL 异常"
        ((failed++))
    fi
    echo ""
    
    # 总结
    echo "========================================="
    if [ $failed -eq 0 ]; then
        log_info "所有服务正常运行 ✅"
        exit 0
    else
        log_error "发现 $failed 个异常 ❌"
        exit 1
    fi
}

# 运行主函数
main
