#!/usr/bin/env bash
# Git 仓库迁移脚本
# 使用方法: ./migrate-to-my-repo.sh YOUR_GITHUB_USERNAME

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Carbon 仓库迁移脚本${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# 检查参数
if [ -z "$1" ]; then
    echo -e "${RED}错误: 请提供你的 GitHub 用户名${NC}"
    echo ""
    echo "使用方法:"
    echo "  ./migrate-to-my-repo.sh YOUR_GITHUB_USERNAME"
    echo ""
    echo "示例:"
    echo "  ./migrate-to-my-repo.sh P16V"
    exit 1
fi

GITHUB_USERNAME="$1"
REPO_NAME="carbon-erp-mes-qms"
NEW_REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo -e "${YELLOW}配置信息:${NC}"
echo "  GitHub 用户名: ${GITHUB_USERNAME}"
echo "  仓库名称: ${REPO_NAME}"
echo "  新仓库地址: ${NEW_REPO_URL}"
echo ""

# 确认
read -p "是否继续? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}已取消${NC}"
    exit 0
fi

echo ""
echo -e "${CYAN}步骤 1: 检查当前 Git 状态${NC}"
echo "----------------------------------------"

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}警告: 有未提交的更改${NC}"
    git status --short
    echo ""
    read -p "是否先提交这些更改? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "请输入提交信息: " commit_msg
        git commit -m "$commit_msg"
        echo -e "${GREEN}✓ 更改已提交${NC}"
    fi
fi

echo ""
echo -e "${CYAN}步骤 2: 配置远程仓库${NC}"
echo "----------------------------------------"

# 检查当前远程仓库
echo "当前远程仓库:"
git remote -v

echo ""
echo "重命名 origin 为 upstream..."
git remote rename origin upstream
echo -e "${GREEN}✓ 已重命名${NC}"

echo ""
echo "添加新的 origin..."
git remote add origin "$NEW_REPO_URL"
echo -e "${GREEN}✓ 已添加${NC}"

echo ""
echo "新的远程仓库配置:"
git remote -v

echo ""
echo -e "${CYAN}步骤 3: 推送到新仓库${NC}"
echo "----------------------------------------"

echo "推送主分支到新仓库..."
if git push -u origin main; then
    echo -e "${GREEN}✓ 推送成功！${NC}"
else
    echo -e "${RED}✗ 推送失败${NC}"
    echo ""
    echo -e "${YELLOW}可能的原因:${NC}"
    echo "  1. 新仓库不存在 - 请先在 GitHub 上创建仓库"
    echo "  2. 认证失败 - 请检查 GitHub 凭据"
    echo "  3. 网络问题 - 请检查网络连接"
    echo ""
    echo -e "${YELLOW}恢复原始配置...${NC}"
    git remote remove origin
    git remote rename upstream origin
    echo -e "${GREEN}✓ 已恢复${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}步骤 4: 验证${NC}"
echo "----------------------------------------"

echo "远程仓库配置:"
git remote -v

echo ""
echo "当前分支:"
git branch -vv

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  迁移完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${CYAN}下一步:${NC}"
echo "  1. 访问你的仓库: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo "  2. 验证所有文件都已上传"
echo "  3. 添加 README 和描述"
echo ""
echo -e "${CYAN}从上游获取更新:${NC}"
echo "  git fetch upstream"
echo "  git merge upstream/main"
echo "  git push origin main"
echo ""
echo -e "${CYAN}日常提交:${NC}"
echo "  git add ."
echo "  git commit -m \"你的提交信息\""
echo "  git push origin main"
echo ""
