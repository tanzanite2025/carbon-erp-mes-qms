#!/bin/bash

# Git 中文支持配置脚本
# 适用于 Linux/Mac/Git Bash

echo "========================================"
echo "  Git 中文支持配置脚本"
echo "========================================"
echo ""

# 检查 Git 是否安装
if ! command -v git &> /dev/null; then
    echo "✗ 未检测到 Git，请先安装 Git"
    exit 1
fi

GIT_VERSION=$(git --version)
echo "✓ 检测到 Git: $GIT_VERSION"
echo ""

echo "开始配置..."
echo ""

# 1. 禁用路径转义（最重要）
echo "1. 配置 core.quotepath = false"
git config --global core.quotepath false
echo "   ✓ 完成"

# 2. 配置提交编码
echo "2. 配置 i18n.commitencoding = utf-8"
git config --global i18n.commitencoding utf-8
echo "   ✓ 完成"

# 3. 配置日志输出编码
echo "3. 配置 i18n.logoutputencoding = utf-8"
git config --global i18n.logoutputencoding utf-8
echo "   ✓ 完成"

# 4. 配置 Unicode 预组合
echo "4. 配置 core.precomposeunicode = true"
git config --global core.precomposeunicode true
echo "   ✓ 完成"

echo ""
echo "========================================"
echo "  配置完成！"
echo "========================================"
echo ""

# 显示当前配置
echo "当前 Git 配置："
echo ""
git config --list | grep -E "(quotepath|encoding|unicode)" | while read line; do
    echo "  $line"
done

echo ""
echo "========================================"
echo "  测试"
echo "========================================"
echo ""
echo "现在可以运行以下命令测试："
echo "  git status"
echo ""
echo "中文文件名应该能正确显示了！"
echo ""
