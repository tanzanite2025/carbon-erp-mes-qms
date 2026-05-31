# 🚀 Carbon ERP/MES 生产环境部署指南

本目录包含生产环境部署所需的所有配置文件和脚本。

---

## 📁 目录结构

```
deployment/
├── README.md                    # 本文件
├── 部署改进实施总结.md          # 改进实施总结
├── .env.prod.example            # 生产环境变量模板
├── docker-compose.prod.yml      # 生产环境 Docker Compose（完整版）
├── nginx/
│   ├── nginx.conf               # Nginx 主配置（优化版）
│   └── sites/
│       ├── erp.conf             # ERP 站点配置
│       ├── mes.conf             # MES 站点配置
│       └── api.conf             # API 站点配置
├── postgres/
│   └── postgresql.conf          # PostgreSQL 优化配置
├── redis/
│   └── redis.conf               # Redis 持久化配置
├── pgbouncer/
│   ├── pgbouncer.ini            # PgBouncer 连接池配置
│   └── userlist.txt             # 用户列表模板
├── kong/
│   └── kong.yml                 # Kong API Gateway 配置
├── monitoring/
│   ├── docker-compose.yml       # 监控服务（Prometheus + Grafana）
│   ├── prometheus.yml           # Prometheus 配置
│   ├── alerts.yml               # 告警规则
│   └── grafana/
│       ├── dashboards/
│       │   └── dashboard.yml    # Dashboard 配置
│       └── datasources/
│           └── prometheus.yml   # 数据源配置
├── pm2/
│   └── ecosystem.config.js      # PM2 配置
├── systemd/
│   ├── carbon-erp.service       # ERP systemd 服务
│   └── carbon-mes.service       # MES systemd 服务
└── scripts/
    ├── deploy.sh                # 一键部署脚本
    ├── backup-db.sh             # 数据库备份脚本
    ├── restore-db.sh            # 数据库恢复脚本
    ├── health-check.sh          # 健康检查脚本
    ├── check-env.sh             # 环境变量验证脚本（新增）
    ├── monitor.sh               # 系统监控脚本（新增）
    ├── rollback.sh              # 回滚脚本（新增）
    └── blue-green-deploy.sh     # 蓝绿部署脚本（新增）
```

---

## 🚀 快速开始

### 1. 准备服务器

**最低配置**:
- CPU: 4核
- 内存: 8GB
- 硬盘: 100GB SSD
- 操作系统: Ubuntu 22.04 LTS

### 2. 安装依赖

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 pnpm 和 PM2
npm install -g pnpm pm2

# 安装 Nginx
sudo apt install -y nginx

# 重新登录以应用 docker 组权限
exit
```

### 3. 配置域名

在域名提供商处添加 DNS 解析：

```
A记录: erp.yourcompany.com  → 服务器IP
A记录: mes.yourcompany.com  → 服务器IP
A记录: api.yourcompany.com  → 服务器IP
```

### 4. 部署 Supabase

```bash
# 克隆 Supabase
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# 配置环境变量
cp .env.example .env
nano .env

# 修改以下关键配置:
# POSTGRES_PASSWORD=your-super-secret-password
# JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
# SITE_URL=https://api.yourcompany.com
# API_EXTERNAL_URL=https://api.yourcompany.com

# 启动 Supabase
docker compose up -d

# 查看状态
docker compose ps
```

### 5. 部署 Carbon 应用

```bash
# 克隆项目
cd ~
git clone your-carbon-repo.git carbon
cd carbon

# 复制环境变量模板
cp deployment/.env.prod.example .env

# 编辑环境变量
nano .env

# 验证环境变量（新增）
source .env
./deployment/scripts/check-env.sh

# 安装依赖
pnpm install

# 构建应用
pnpm build

# 运行数据库迁移
pnpm db:migrate

# 启动应用（使用 PM2）
pm2 start deployment/pm2/ecosystem.config.js

# 保存 PM2 配置
pm2 save
pm2 startup
```

### 6. 配置 Nginx

```bash
# 复制配置文件
sudo cp deployment/nginx/sites/*.conf /etc/nginx/sites-available/

# 创建软链接
sudo ln -s /etc/nginx/sites-available/erp.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/mes.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.conf /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 7. 配置 SSL 证书

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx \
  -d erp.yourcompany.com \
  -d mes.yourcompany.com \
  -d api.yourcompany.com

# 测试自动续期
sudo certbot renew --dry-run
```

### 8. 配置自动备份和监控

```bash
# 添加 cron 任务
crontab -e

# 添加以下行
# 每天凌晨 2 点备份数据库
0 2 * * * /home/ubuntu/carbon/deployment/scripts/backup-db.sh

# 每 5 分钟运行一次监控（新增）
*/5 * * * * /home/ubuntu/carbon/deployment/scripts/monitor.sh
```

### 9. 启动监控服务（新增）

```bash
# 启动 Prometheus + Grafana
cd deployment/monitoring
docker compose up -d

# 查看状态
docker compose ps

# 访问监控面板
# Prometheus: http://your-server-ip:9090
# Grafana: http://your-server-ip:3001 (默认: admin/admin)
```

### 10. 健康检查

```bash
# 运行健康检查
./deployment/scripts/health-check.sh

# 运行系统监控
./deployment/scripts/monitor.sh
```

---

## 🚀 高级功能

### 蓝绿部署

零停机部署，自动回滚：

```bash
# 执行蓝绿部署
./deployment/scripts/blue-green-deploy.sh

# 脚本会自动：
# 1. 拉取最新代码
# 2. 构建新版本
# 3. 启动新版本（不同端口）
# 4. 健康检查
# 5. 切换 Nginx 上游
# 6. 停止旧版本
```

### 快速回滚

回滚到任意版本：

```bash
# 回滚到上一个版本
./deployment/scripts/rollback.sh HEAD~1

# 回滚到指定 commit
./deployment/scripts/rollback.sh abc123

# 回滚到指定 tag
./deployment/scripts/rollback.sh v1.0.0

# 可选：同时回滚数据库
# 脚本会提示选择备份文件
```

### 系统监控

实时监控系统状态：

```bash
# 运行监控脚本
./deployment/scripts/monitor.sh

# 输出示例：
# ✅ CPU: 45.2%
# ✅ 内存: 62.8%
# ✅ 磁盘: 38%
# ✅ carbon-erp: 125ms
# ✅ carbon-mes: 98ms
# ✅ PostgreSQL: 45 连接
# ✅ Redis: 128MB
# ✅ Nginx: 运行中
```

### 环境变量验证

部署前验证配置：

```bash
# 加载环境变量
source .env

# 运行验证
./deployment/scripts/check-env.sh

# 检查项：
# - 必需变量是否存在
# - 密码强度（至少 32 字符）
# - 默认值是否被修改
# - Redis 连接测试
# - 数据库连接测试
```

### PgBouncer 连接池

提升数据库性能：

```bash
# 1. 生成密码哈希
echo -n "your-passwordpostgres" | md5sum

# 2. 编辑用户列表
nano deployment/pgbouncer/userlist.txt
# 添加: "postgres" "md5<hash>"

# 3. 启动 PgBouncer（已包含在 docker-compose.prod.yml）
docker compose -f deployment/docker-compose.prod.yml up -d pgbouncer

# 4. 应用连接到 PgBouncer
# 修改 .env 中的数据库连接：
# SUPABASE_DB_URL=postgresql://postgres:password@localhost:6432/postgres
```

### Prometheus + Grafana 监控

完整的监控和可视化：

```bash
# 启动监控服务
cd deployment/monitoring
docker compose up -d

# 访问 Prometheus
# http://your-server-ip:9090

# 访问 Grafana
# http://your-server-ip:3001
# 默认账号: admin/admin

# 导入推荐 Dashboard：
# - Node Exporter Full (ID: 1860)
# - PostgreSQL Database (ID: 9628)
# - Redis Dashboard (ID: 11835)
```

---

## 🔧 日常维护

### 查看应用状态

```bash
# PM2 状态
pm2 status

# PM2 日志
pm2 logs

# Docker 状态
docker compose ps

# Nginx 状态
sudo systemctl status nginx
```

### 更新应用

```bash
# 方式 1: 使用一键部署脚本
./deployment/scripts/deploy.sh

# 方式 2: 使用蓝绿部署（推荐，零停机）
./deployment/scripts/blue-green-deploy.sh

# 方式 3: 手动更新
git pull origin main
pnpm install
pnpm build
pm2 restart all
```

### 重启服务

```bash
# 重启 ERP
pm2 restart carbon-erp

# 重启 MES
pm2 restart carbon-mes

# 重启所有
pm2 restart all

# 重启 Supabase
cd ~/supabase/docker
docker compose restart
```

### 查看日志

```bash
# PM2 日志
pm2 logs carbon-erp
pm2 logs carbon-mes

# Nginx 日志
sudo tail -f /var/log/nginx/erp-access.log
sudo tail -f /var/log/nginx/erp-error.log

# Docker 日志
docker compose logs -f postgres
docker compose logs -f storage

# 监控日志
cd deployment/monitoring
docker compose logs -f prometheus
docker compose logs -f grafana
```

---

## 🔒 安全配置

### 1. 配置防火墙

```bash
# 安装 ufw
sudo apt install -y ufw

# 允许 SSH
sudo ufw allow 22/tcp

# 允许 HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

### 2. 配置 SSH 密钥登录

```bash
# 在本地生成密钥对
ssh-keygen -t ed25519 -C "your_email@example.com"

# 复制公钥到服务器
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server

# 禁用密码登录
sudo nano /etc/ssh/sshd_config
# 修改: PasswordAuthentication no

# 重启 SSH
sudo systemctl restart sshd
```

### 3. 配置 Fail2ban

```bash
# 安装 Fail2ban
sudo apt install -y fail2ban

# 配置
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# 启动
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📊 监控和告警

### 1. PM2 监控

```bash
# 安装 PM2 日志轮转
pm2 install pm2-logrotate

# 配置日志大小
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7

# 查看监控
pm2 monit
```

### 2. 阿里云监控

在阿里云控制台配置：
- CPU 使用率告警（> 80%）
- 内存使用率告警（> 80%）
- 磁盘使用率告警（> 80%）
- 网络流量告警

---

## 🔄 备份和恢复

### 备份数据库

```bash
# 手动备份
./deployment/scripts/backup-db.sh

# 查看备份文件
ls -lh /var/backups/carbon/
```

### 恢复数据库

```bash
# 恢复最新备份
./deployment/scripts/restore-db.sh /var/backups/carbon/carbon_20260530_020000.sql.gz
```

---

## 🐛 故障排查

### 应用无法启动

```bash
# 查看 PM2 日志
pm2 logs carbon-erp --lines 100

# 查看环境变量
pm2 env 0

# 重启应用
pm2 restart carbon-erp
```

### 数据库连接失败

```bash
# 检查 PostgreSQL 状态
docker exec supabase-db pg_isready -U postgres

# 查看 PostgreSQL 日志
docker compose logs postgres

# 重启 PostgreSQL
docker compose restart postgres
```

### Nginx 502 错误

```bash
# 检查应用是否运行
pm2 status

# 检查端口是否监听
netstat -tlnp | grep 4000
netstat -tlnp | grep 4001

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

---

## 📞 获取帮助

如有问题，请：
1. 查看日志文件
2. 运行健康检查脚本
3. 查看本文档的故障排查部分
4. 联系技术支持

---

**祝部署顺利！** 🎉
