#!/bin/bash

# 直接清理所有历史记录，重新开始

echo "🗑️  清理所有 Git 历史记录"
echo ""

# 1. 删除 .git 目录
echo "1️⃣  删除 .git 目录..."
rm -rf .git
echo "✅ 已删除"
echo ""

# 2. 重新初始化
echo "2️⃣  重新初始化 Git..."
git init
echo "✅ 已初始化"
echo ""

# 3. 添加所有文件
echo "3️⃣  添加所有文件..."
git add .
echo "✅ 已添加"
echo ""

# 4. 创建初始提交
echo "4️⃣  创建初始提交..."
git commit -m "初始提交：Carbon ERP/MES/QMS 本地开发环境"
echo "✅ 已提交"
echo ""

# 5. 设置分支
echo "5️⃣  设置主分支..."
git branch -M main
echo "✅ 已设置"
echo ""

# 6. 添加远程仓库
echo "6️⃣  添加远程仓库..."
git remote add origin https://github.com/tanzanite2025/carbon-erp-mes-qms.git
echo "✅ 已添加"
echo ""

# 7. 强制推送
echo "7️⃣  强制推送到远程仓库..."
git push -u origin main --force
echo ""

echo "✅ 完成！"
echo ""
echo "📊 现在只有 1 个提交，仓库很小了！"
