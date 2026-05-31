#!/bin/bash

# Carbon ERP/MES 一键部署脚本
# 用于生产环境的自动化部署

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 未安装，请先安装"
        exit 1
    fi
}

# 主函数
main() {
    log_info "开始部署 Carbon ERP/MES..."
    
    # 1. 检查环境
    log_info "1/8 检查环境..."
    check_command git
    check_command node
    check_command pnpm
    check_command pm2
    check_command docker
    
    # 2. 备份当前版本
    log_info "2/8 备份当前版本..."
    if [ -d ".git" ]; then
        CURRENT_COMMIT=$(git rev-parse --short HEAD)
        log_info "当前版本: $CURRENT_COMMIT"
    fi
    
    # 3. 拉取最新代码
    log_info "3/8 拉取最新代码..."
    git fetch origin
    git pull origin main
    NEW_COMMIT=$(git rev-parse --short HEAD)
    log_info "新版本: $NEW_COMMIT"
    
    # 4. 安装依赖
    log_info "4/8 安装依赖..."
    pnpm install --frozen-lockfile
    
    # 5. 构建应用
    log_info "5/8 构建应用..."
    pnpm build
    
    # 6. 运行数据库迁移
    log_info "6/8 运行数据库迁移..."
    pnpm db:migrate
    
    # 7. 重启应用
    log_info "7/8 重启应用..."
    pm2 reload deployment/pm2/ecosystem.config.js
    
    # 等待应用启动
    sleep 5
    
    # 8. 健康检查
    log_info "8/8 健康检查..."
    if ./deployment/scripts/health-check.sh; then
        log_info "✅ 部署成功！"
        log_info "版本: $CURRENT_COMMIT → $NEW_COMMIT"
    else
        log_error "❌ 健康检查失败，请检查日志"
        log_warn "回滚命令: git reset --hard $CURRENT_COMMIT && pm2 reload all"
        exit 1
    fi
}

# 运行主函数
main
