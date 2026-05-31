#!/bin/bash

# Carbon 数据库恢复脚本
# 用于从备份恢复 PostgreSQL 数据库

set -e

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 检查参数
if [ $# -eq 0 ]; then
    log_error "用法: $0 <备份文件路径>"
    log_info "示例: $0 /var/backups/carbon/carbon_20260530_020000.sql.gz"
    exit 1
fi

BACKUP_FILE=$1

# 检查备份文件是否存在
if [ ! -f "$BACKUP_FILE" ]; then
    log_error "备份文件不存在: $BACKUP_FILE"
    exit 1
fi

log_warn "⚠️  警告：此操作将覆盖当前数据库！"
log_warn "⚠️  请确保已经备份当前数据库！"
echo ""
read -p "确认恢复数据库？(输入 yes 继续): " confirm

if [ "$confirm" != "yes" ]; then
    log_info "取消恢复"
    exit 0
fi

log_info "开始恢复数据库..."

# 解压备份文件（如果是压缩的）
if [[ $BACKUP_FILE == *.gz ]]; then
    log_info "解压备份文件..."
    TEMP_FILE="/tmp/carbon_restore_$(date +%s).sql"
    gunzip -c $BACKUP_FILE > $TEMP_FILE
else
    TEMP_FILE=$BACKUP_FILE
fi

# 停止应用（避免数据库连接冲突）
log_info "停止应用..."
pm2 stop all

# 恢复数据库
log_info "恢复数据库..."
if docker exec -i supabase-db psql -U postgres postgres < $TEMP_FILE; then
    log_info "数据库恢复完成"
    
    # 清理临时文件
    if [[ $BACKUP_FILE == *.gz ]]; then
        rm -f $TEMP_FILE
    fi
    
    # 重启应用
    log_info "重启应用..."
    pm2 restart all
    
    # 等待应用启动
    sleep 5
    
    # 健康检查
    log_info "健康检查..."
    if ./deployment/scripts/health-check.sh; then
        log_info "✅ 恢复成功！"
    else
        log_error "❌ 健康检查失败，请检查日志"
    fi
else
    log_error "❌ 恢复失败！"
    
    # 清理临时文件
    if [[ $BACKUP_FILE == *.gz ]]; then
        rm -f $TEMP_FILE
    fi
    
    # 重启应用
    log_warn "尝试重启应用..."
    pm2 restart all
    
    exit 1
fi
