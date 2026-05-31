#!/bin/bash

# ============================================
# Carbon ERP/MES 回滚脚本
# ============================================

set -e

echo "🔄 开始回滚..."
echo ""

# 配置
DEPLOY_DIR="/root/carbon"
BACKUP_DIR="/var/backups/carbon"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查参数
if [ $# -eq 0 ]; then
    echo "用法: $0 <commit-hash|tag>"
    echo ""
    echo "示例:"
    echo "  $0 abc123          # 回滚到指定 commit"
    echo "  $0 v1.0.0          # 回滚到指定 tag"
    echo "  $0 HEAD~1          # 回滚到上一个 commit"
    echo ""
    exit 1
fi

TARGET=$1

# 进入项目目录
cd "$DEPLOY_DIR"

# 显示当前版本
echo "当前版本:"
git log -1 --oneline
echo ""

# 显示目标版本
echo "目标版本:"
git log -1 --oneline "$TARGET"
echo ""

# 确认回滚
read -p "确认回滚到 $TARGET? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "取消回滚"
    exit 0
fi

# 备份当前代码
echo "📦 备份当前代码..."
BACKUP_FILE="$BACKUP_DIR/code_$(date +%Y%m%d_%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" --exclude=node_modules --exclude=.git .
echo "备份保存到: $BACKUP_FILE"
echo ""

# 停止应用
echo "🛑 停止应用..."
pm2 stop all
echo ""

# 回滚代码
echo "🔄 回滚代码..."
git checkout "$TARGET"
echo ""

# 安装依赖
echo "📦 安装依赖..."
pnpm install --frozen-lockfile
echo ""

# 构建应用
echo "🔨 构建应用..."
pnpm build
echo ""

# 数据库回滚（如果需要）
read -p "是否需要回滚数据库? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  回滚数据库..."
    
    # 列出可用的备份
    echo "可用的数据库备份:"
    ls -lh "$BACKUP_DIR"/*.sql.gz | tail -5
    echo ""
    
    read -p "请输入备份文件路径: " BACKUP_FILE
    
    if [ -f "$BACKUP_FILE" ]; then
        ./deployment/scripts/restore-db.sh "$BACKUP_FILE"
    else
        echo -e "${RED}❌ 备份文件不存在${NC}"
        exit 1
    fi
    echo ""
fi

# 启动应用
echo "🚀 启动应用..."
pm2 start deployment/pm2/ecosystem.config.js
pm2 save
echo ""

# 健康检查
echo "🔍 健康检查..."
sleep 10

if curl -f -s http://localhost:4000/health > /dev/null 2>&1 && \
   curl -f -s http://localhost:4001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 应用运行正常${NC}"
else
    echo -e "${RED}❌ 应用健康检查失败${NC}"
    echo ""
    echo "查看日志:"
    echo "  pm2 logs"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ 回滚完成！${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "当前版本:"
git log -1 --oneline
echo ""
