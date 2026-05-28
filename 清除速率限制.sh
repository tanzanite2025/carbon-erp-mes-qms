#!/bin/bash

# 清除 Redis 中的速率限制数据

echo "清除速率限制..."

# 连接到 Redis 并清除所有数据
docker exec carbon-redis redis-cli FLUSHDB

echo "✅ 速率限制已清除"
echo ""
echo "现在可以重新登录了"
