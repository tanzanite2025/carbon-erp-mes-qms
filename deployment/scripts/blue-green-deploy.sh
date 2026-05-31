#!/bin/bash

# ============================================
# Carbon ERP/MES 蓝绿部署脚本
# ============================================

set -e

echo "🚀 开始蓝绿部署..."
echo ""

# 配置
DEPLOY_DIR="/root/carbon"
CURRENT_FILE="/var/run/carbon-current"
HEALTH_CHECK_TIMEOUT=30
HEALTH_CHECK_INTERVAL=5

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查当前运行的版本
if [ ! -f "$CURRENT_FILE" ]; then
    echo "blue" > "$CURRENT_FILE"
fi

CURRENT=$(cat "$CURRENT_FILE")

if [ "$CURRENT" = "blue" ]; then
    NEW="green"
    NEW_PORT_ERP=4002
    NEW_PORT_MES=4003
    OLD_PORT_ERP=4000
    OLD_PORT_MES=4001
else
    NEW="blue"
    NEW_PORT_ERP=4000
    NEW_PORT_MES=4001
    OLD_PORT_ERP=4002
    OLD_PORT_MES=4003
fi

echo -e "${YELLOW}当前版本: $CURRENT${NC}"
echo -e "${GREEN}新版本: $NEW${NC}"
echo ""

# 进入项目目录
cd "$DEPLOY_DIR"

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main
echo ""

# 安装依赖
echo "📦 安装依赖..."
pnpm install --frozen-lockfile
echo ""

# 构建应用
echo "🔨 构建应用..."
pnpm build
echo ""

# 运行数据库迁移
echo "🗄️  运行数据库迁移..."
pnpm db:migrate
echo ""

# 启动新版本
echo "🚀 启动新版本 ($NEW)..."

# 启动 ERP
PORT=$NEW_PORT_ERP pm2 start apps/erp/npm --name "carbon-erp-$NEW" -- start

# 启动 MES
PORT=$NEW_PORT_MES pm2 start apps/mes/npm --name "carbon-mes-$NEW" -- start

echo ""

# 健康检查
echo "🔍 健康检查..."
ELAPSED=0
ERP_HEALTHY=false
MES_HEALTHY=false

while [ $ELAPSED -lt $HEALTH_CHECK_TIMEOUT ]; do
    # 检查 ERP
    if ! $ERP_HEALTHY && curl -f -s "http://localhost:$NEW_PORT_ERP/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ ERP 健康检查通过${NC}"
        ERP_HEALTHY=true
    fi
    
    # 检查 MES
    if ! $MES_HEALTHY && curl -f -s "http://localhost:$NEW_PORT_MES/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ MES 健康检查通过${NC}"
        MES_HEALTHY=true
    fi
    
    # 如果都健康，退出循环
    if $ERP_HEALTHY && $MES_HEALTHY; then
        break
    fi
    
    sleep $HEALTH_CHECK_INTERVAL
    ELAPSED=$((ELAPSED + HEALTH_CHECK_INTERVAL))
done

echo ""

# 检查健康状态
if ! $ERP_HEALTHY || ! $MES_HEALTHY; then
    echo -e "${RED}❌ 健康检查失败，回滚部署${NC}"
    
    # 停止新版本
    pm2 stop "carbon-erp-$NEW" || true
    pm2 stop "carbon-mes-$NEW" || true
    pm2 delete "carbon-erp-$NEW" || true
    pm2 delete "carbon-mes-$NEW" || true
    
    exit 1
fi

# 切换 Nginx 上游
echo "🔄 切换 Nginx 上游..."

# 备份当前配置
sudo cp /etc/nginx/sites-available/erp.conf /etc/nginx/sites-available/erp.conf.bak
sudo cp /etc/nginx/sites-available/mes.conf /etc/nginx/sites-available/mes.conf.bak

# 更新 ERP 配置
sudo sed -i "s/server 127.0.0.1:[0-9]*;/server 127.0.0.1:$NEW_PORT_ERP;/" /etc/nginx/sites-available/erp.conf

# 更新 MES 配置
sudo sed -i "s/server 127.0.0.1:[0-9]*;/server 127.0.0.1:$NEW_PORT_MES;/" /etc/nginx/sites-available/mes.conf

# 测试 Nginx 配置
if ! sudo nginx -t; then
    echo -e "${RED}❌ Nginx 配置测试失败，恢复配置${NC}"
    sudo mv /etc/nginx/sites-available/erp.conf.bak /etc/nginx/sites-available/erp.conf
    sudo mv /etc/nginx/sites-available/mes.conf.bak /etc/nginx/sites-available/mes.conf
    
    # 停止新版本
    pm2 stop "carbon-erp-$NEW"
    pm2 stop "carbon-mes-$NEW"
    pm2 delete "carbon-erp-$NEW"
    pm2 delete "carbon-mes-$NEW"
    
    exit 1
fi

# 重载 Nginx
sudo systemctl reload nginx

echo ""

# 等待一段时间，确保流量切换成功
echo "⏳ 等待流量切换..."
sleep 10

# 再次健康检查
echo "🔍 验证新版本..."
if curl -f -s "http://localhost:$NEW_PORT_ERP/health" > /dev/null 2>&1 && \
   curl -f -s "http://localhost:$NEW_PORT_MES/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 新版本运行正常${NC}"
else
    echo -e "${RED}❌ 新版本异常，回滚${NC}"
    
    # 恢复 Nginx 配置
    sudo mv /etc/nginx/sites-available/erp.conf.bak /etc/nginx/sites-available/erp.conf
    sudo mv /etc/nginx/sites-available/mes.conf.bak /etc/nginx/sites-available/mes.conf
    sudo systemctl reload nginx
    
    # 停止新版本
    pm2 stop "carbon-erp-$NEW"
    pm2 stop "carbon-mes-$NEW"
    pm2 delete "carbon-erp-$NEW"
    pm2 delete "carbon-mes-$NEW"
    
    exit 1
fi

echo ""

# 停止旧版本
echo "🛑 停止旧版本 ($CURRENT)..."
pm2 stop "carbon-erp-$CURRENT" || true
pm2 stop "carbon-mes-$CURRENT" || true
pm2 delete "carbon-erp-$CURRENT" || true
pm2 delete "carbon-mes-$CURRENT" || true

echo ""

# 更新当前版本标记
echo "$NEW" > "$CURRENT_FILE"

# 保存 PM2 配置
pm2 save

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ 蓝绿部署完成！${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "当前版本: $NEW"
echo "ERP 端口: $NEW_PORT_ERP"
echo "MES 端口: $NEW_PORT_MES"
echo ""
