#!/bin/bash

# ============================================
# Carbon ERP/MES 监控脚本
# ============================================

# 配置
ALERT_EMAIL="admin@yourcompany.com"
ALERT_WEBHOOK=""  # Slack/钉钉 webhook URL

# 阈值
CPU_THRESHOLD=80
MEMORY_THRESHOLD=80
DISK_THRESHOLD=80
RESPONSE_TIME_THRESHOLD=2000  # 毫秒

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 发送告警
send_alert() {
    local title=$1
    local message=$2
    local level=$3  # info, warning, critical
    
    echo -e "${RED}🚨 告警: $title${NC}"
    echo "$message"
    
    # 发送邮件（如果配置了）
    if [ -n "$ALERT_EMAIL" ] && command -v mail &> /dev/null; then
        echo "$message" | mail -s "[$level] $title" "$ALERT_EMAIL"
    fi
    
    # 发送 Webhook（如果配置了）
    if [ -n "$ALERT_WEBHOOK" ]; then
        curl -X POST "$ALERT_WEBHOOK" \
            -H 'Content-Type: application/json' \
            -d "{\"title\":\"$title\",\"message\":\"$message\",\"level\":\"$level\"}"
    fi
}

# 检查 CPU 使用率
check_cpu() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    local cpu_int=${cpu_usage%.*}
    
    if [ "$cpu_int" -gt "$CPU_THRESHOLD" ]; then
        send_alert "CPU 使用率过高" "当前 CPU 使用率: ${cpu_usage}%" "warning"
        return 1
    fi
    
    echo -e "${GREEN}✅ CPU: ${cpu_usage}%${NC}"
    return 0
}

# 检查内存使用率
check_memory() {
    local memory_usage=$(free | grep Mem | awk '{print ($3/$2) * 100.0}')
    local memory_int=${memory_usage%.*}
    
    if [ "$memory_int" -gt "$MEMORY_THRESHOLD" ]; then
        send_alert "内存使用率过高" "当前内存使用率: ${memory_usage}%" "warning"
        return 1
    fi
    
    echo -e "${GREEN}✅ 内存: ${memory_usage}%${NC}"
    return 0
}

# 检查磁盘使用率
check_disk() {
    local disk_usage=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -gt "$DISK_THRESHOLD" ]; then
        send_alert "磁盘使用率过高" "当前磁盘使用率: ${disk_usage}%" "warning"
        return 1
    fi
    
    echo -e "${GREEN}✅ 磁盘: ${disk_usage}%${NC}"
    return 0
}

# 检查应用状态
check_app() {
    local app_name=$1
    local port=$2
    
    # 检查进程
    if ! pm2 list | grep -q "$app_name.*online"; then
        send_alert "应用离线" "$app_name 进程不在运行" "critical"
        return 1
    fi
    
    # 检查端口
    if ! nc -z localhost "$port" 2>/dev/null; then
        send_alert "应用端口不可达" "$app_name 端口 $port 不可达" "critical"
        return 1
    fi
    
    # 检查健康端点
    local response_time=$(curl -o /dev/null -s -w '%{time_total}' "http://localhost:$port/health" || echo "999")
    local response_time_ms=$(echo "$response_time * 1000" | bc | cut -d. -f1)
    
    if [ "$response_time_ms" -gt "$RESPONSE_TIME_THRESHOLD" ]; then
        send_alert "应用响应慢" "$app_name 响应时间: ${response_time_ms}ms" "warning"
        return 1
    fi
    
    echo -e "${GREEN}✅ $app_name: ${response_time_ms}ms${NC}"
    return 0
}

# 检查数据库
check_database() {
    if ! docker exec carbon-postgres pg_isready -U postgres &>/dev/null; then
        send_alert "数据库离线" "PostgreSQL 不可达" "critical"
        return 1
    fi
    
    # 检查连接数
    local connections=$(docker exec carbon-postgres psql -U postgres -t -c "SELECT count(*) FROM pg_stat_activity;" | xargs)
    
    if [ "$connections" -gt 150 ]; then
        send_alert "数据库连接数过高" "当前连接数: $connections" "warning"
    fi
    
    echo -e "${GREEN}✅ PostgreSQL: $connections 连接${NC}"
    return 0
}

# 检查 Redis
check_redis() {
    if ! docker exec carbon-redis redis-cli ping &>/dev/null; then
        send_alert "Redis 离线" "Redis 不可达" "critical"
        return 1
    fi
    
    # 检查内存使用
    local memory_usage=$(docker exec carbon-redis redis-cli info memory | grep used_memory_human | cut -d: -f2 | tr -d '\r')
    
    echo -e "${GREEN}✅ Redis: $memory_usage${NC}"
    return 0
}

# 检查 Nginx
check_nginx() {
    if ! systemctl is-active --quiet nginx; then
        send_alert "Nginx 离线" "Nginx 服务未运行" "critical"
        return 1
    fi
    
    echo -e "${GREEN}✅ Nginx: 运行中${NC}"
    return 0
}

# 主函数
main() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 Carbon ERP/MES 系统监控"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    # 系统资源
    echo "📊 系统资源:"
    check_cpu
    check_memory
    check_disk
    echo ""
    
    # 应用状态
    echo "🚀 应用状态:"
    check_app "carbon-erp" 4000
    check_app "carbon-mes" 4001
    echo ""
    
    # 基础设施
    echo "🗄️  基础设施:"
    check_database
    check_redis
    check_nginx
    echo ""
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ 监控完成"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# 运行监控
main
