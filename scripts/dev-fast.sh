#!/bin/bash

# ============================================
# Carbon 快速启动脚本
# ============================================
# 
# 用途: 检查 Docker 服务是否运行，如果运行则只重启应用
#       如果未运行则完整启动所有服务
#
# 使用: ./scripts/dev-fast.sh
# ============================================

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}🚀 Carbon 快速启动模式${NC}"
echo ""

# 检查 Docker 服务是否运行
if docker compose ps 2>/dev/null | grep -q "Up"; then
  echo -e "${GREEN}✅ Docker 服务已运行，跳过启动${NC}"
  echo -e "${YELLOW}🔄 只重启应用 (ERP + MES)...${NC}"
  echo ""
  
  # 只启动应用，不启动 Docker 服务
  pnpm dev:fast
else
  echo -e "${YELLOW}🐳 Docker 服务未运行，首次完整启动...${NC}"
  echo ""
  
  # 完整启动所有服务
  pnpm dev
fi
