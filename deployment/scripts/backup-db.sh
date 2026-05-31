#!/bin/bash

# Carbon 数据库备份脚本
# 用于定期备份 PostgreSQL 数据库

set -e

# 配置
BACKUP_DIR="/var/backups/carbon"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/carbon_$DATE.sql"
KEEP_DAYS=7  # 保留最近 7 天的备份

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 创建备份目录
mkdir -p $BACKUP_DIR

log_info "开始备份数据库..."

# 备份数据库
if docker exec supabase-db pg_dump -U postgres postgres > $BACKUP_FILE; then
    log_info "数据库备份完成: $BACKUP_FILE"
    
    # 压缩备份
    log_info "压缩备份文件..."
    gzip $BACKUP_FILE
    log_info "压缩完成: $BACKUP_FILE.gz"
    
    # 计算文件大小
    SIZE=$(du -h "$BACKUP_FILE.gz" | cut -f1)
    log_info "备份大小: $SIZE"
    
    # 删除旧备份
    log_info "清理 $KEEP_DAYS 天前的备份..."
    find $BACKUP_DIR -name "*.sql.gz" -mtime +$KEEP_DAYS -delete
    
    # 列出当前备份
    log_info "当前备份列表:"
    ls -lh $BACKUP_DIR/*.sql.gz | tail -5
    
    log_info "✅ 备份成功！"
else
    log_error "❌ 备份失败！"
    exit 1
fi
