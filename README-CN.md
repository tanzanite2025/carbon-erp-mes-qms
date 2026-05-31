# Carbon ERP/MES/QMS 开发环境

## 🚀 快速启动

```bash
# 在 Git Bash 中运行
./dev.sh
```

访问地址：
- **ERP**: http://localhost:4000
- **MES**: http://localhost:4001
- **邮件测试**: https://mail.dev

---

## 📚 文档

### 开发文档
- **[开发指南.md](./开发指南.md)** - 开发环境配置和常用命令
- **[配置完成总结.md](./配置完成总结.md)** - 已完成的配置说明
- **[文档索引.md](./文档索引.md)** - 所有文档的索引

### 架构文档
- **[ERP与MES架构分析.md](./ERP与MES架构分析.md)** - 系统架构分析（为什么需要两个端口）
- **[CHINESE_LOCALIZATION_ANALYSIS.md](./CHINESE_LOCALIZATION_ANALYSIS.md)** - 中文本地化分析

### 部署文档
- **[deployment/快速部署指南.md](./deployment/快速部署指南.md)** - 生产环境快速部署（1 小时）
- **[deployment/README.md](./deployment/README.md)** - 完整的部署和维护指南
- **[部署改进建议.md](./部署改进建议.md)** - 部署架构分析和成本对比

### Git 文档
- **[Git仓库迁移指南.md](./Git仓库迁移指南.md)** - 迁移到自己仓库的方法
- **[Git快速参考.md](./Git快速参考.md)** - Git 常用命令

---

## ⚙️ 配置说明

### 端口（已修改避免冲突）
- Redis: **6380** (原 6379)
- ERP: **4000** (原 3000)
- MES: **4001** (原 3001)

### 环境变量
- 默认语言: **中文** (`DEFAULT_LANGUAGE="zh"`)
- 登录方式: **邮箱** (`AUTH_PROVIDERS="email"`)

---

## 🔧 常用命令

```bash
pnpm dev              # 启动开发环境
crbn status           # 查看状态
crbn down             # 停止服务
crbn reset            # 重置数据
```

---

## 💡 提示

- 必须在 **Git Bash** 中运行 `./dev.sh`
- 首次启动需要 5-10 分钟（下载镜像、初始化数据库）
- 邮件不会发送到真实邮箱，在 https://mail.dev 查看
- 默认显示中文界面

---

## 📖 官方资源

- **文档**: https://docs.carbon.ms
- **GitHub**: https://github.com/crbnos/carbon
- **Discord**: https://discord.gg/yGUJWhNqzy
