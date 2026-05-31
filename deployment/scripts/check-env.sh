#!/bin/bash

# ============================================
# Carbon ERP/MES 环境变量验证脚本
# ============================================

set -e

echo "🔍 检查环境变量..."
echo ""

# 必需的环境变量列表
REQUIRED_VARS=(
  "NODE_ENV"
  "SESSION_SECRET"
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "SUPABASE_DB_URL"
  "POSTGRES_PASSWORD"
  "JWT_SECRET"
  "SUPER_ADMIN_EMAIL"
  "SUPER_ADMIN_PASSWORD"
  "REDIS_URL"
)

# 推荐的环境变量列表
RECOMMENDED_VARS=(
  "RESEND_API_KEY"
  "SMTP_HOST"
  "GOOGLE_PLACES_API_KEY"
)

# 检查必需的环境变量
missing=()
weak_passwords=()

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    missing+=("$var")
  else
    # 检查密码强度
    if [[ "$var" == *"PASSWORD"* ]] || [[ "$var" == *"SECRET"* ]]; then
      value="${!var}"
      if [ ${#value} -lt 32 ]; then
        weak_passwords+=("$var (长度: ${#value}, 建议: >= 32)")
      fi
    fi
  fi
done

# 检查推荐的环境变量
missing_recommended=()

for var in "${RECOMMENDED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    missing_recommended+=("$var")
  fi
done

# 输出结果
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 检查结果"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 必需变量检查结果
if [ ${#missing[@]} -gt 0 ]; then
  echo "❌ 缺少必需的环境变量:"
  for var in "${missing[@]}"; do
    echo "  - $var"
  done
  echo ""
  exit 1
else
  echo "✅ 所有必需的环境变量已配置 (${#REQUIRED_VARS[@]}/${#REQUIRED_VARS[@]})"
  echo ""
fi

# 密码强度检查结果
if [ ${#weak_passwords[@]} -gt 0 ]; then
  echo "⚠️  以下密钥/密码强度不足:"
  for var in "${weak_passwords[@]}"; do
    echo "  - $var"
  done
  echo ""
  echo "  建议: 使用至少 32 个字符的强随机字符串"
  echo ""
fi

# 推荐变量检查结果
if [ ${#missing_recommended[@]} -gt 0 ]; then
  echo "ℹ️  缺少推荐的环境变量 (可选):"
  for var in "${missing_recommended[@]}"; do
    echo "  - $var"
  done
  echo ""
fi

# 特定配置检查
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 配置检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查 NODE_ENV
if [ "$NODE_ENV" != "production" ]; then
  echo "⚠️  NODE_ENV 不是 'production' (当前: $NODE_ENV)"
  echo ""
fi

# 检查超级管理员密码
if [ "$SUPER_ADMIN_PASSWORD" == "ChangeThisToAVeryStrongPassword123!@#" ]; then
  echo "❌ 超级管理员密码使用了默认值，必须修改！"
  echo ""
  exit 1
fi

# 检查 SESSION_SECRET
if [ "$SESSION_SECRET" == "change-this-to-a-random-string-at-least-32-characters-long" ]; then
  echo "❌ SESSION_SECRET 使用了默认值，必须修改！"
  echo ""
  exit 1
fi

# 检查 Supabase URL
if [[ "$SUPABASE_URL" == *"yourcompany.com"* ]]; then
  echo "⚠️  SUPABASE_URL 可能未正确配置 (包含 'yourcompany.com')"
  echo ""
fi

# 检查邮件配置
if [ -z "$RESEND_API_KEY" ] && [ -z "$SMTP_HOST" ]; then
  echo "⚠️  未配置邮件服务 (RESEND_API_KEY 或 SMTP_HOST)"
  echo "  - 用户将无法接收邮件通知"
  echo ""
fi

# 检查 Redis 连接
if [ -n "$REDIS_URL" ]; then
  echo "🔍 测试 Redis 连接..."
  if command -v redis-cli &> /dev/null; then
    if redis-cli -u "$REDIS_URL" ping &> /dev/null; then
      echo "✅ Redis 连接成功"
    else
      echo "❌ Redis 连接失败"
      exit 1
    fi
  else
    echo "⚠️  redis-cli 未安装，跳过 Redis 连接测试"
  fi
  echo ""
fi

# 检查数据库连接
if [ -n "$SUPABASE_DB_URL" ]; then
  echo "🔍 测试数据库连接..."
  if command -v psql &> /dev/null; then
    if psql "$SUPABASE_DB_URL" -c "SELECT 1" &> /dev/null; then
      echo "✅ 数据库连接成功"
    else
      echo "❌ 数据库连接失败"
      exit 1
    fi
  else
    echo "⚠️  psql 未安装，跳过数据库连接测试"
  fi
  echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 环境变量验证完成"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 如果有弱密码，返回警告状态码
if [ ${#weak_passwords[@]} -gt 0 ]; then
  exit 2
fi

exit 0
