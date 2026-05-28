# Carbon ERP/MES/QMS 本地开发环境

基于 [Carbon](https://github.com/crbnos/carbon) 配置的本地开发环境。

## 🚀 快速启动

```bash
./dev.sh
```

访问：
- ERP: http://localhost:4000
- MES: http://localhost:4001

## ⚙️ 配置修改

- Redis 端口: 6380（避免冲突）
- ERP 端口: 4000（避免冲突）
- MES 端口: 4001（避免冲突）
- 默认语言: 中文

## 📚 文档

- [开发指南](./开发指南.md)
- [配置总结](./配置完成总结.md)

## 🔧 常用命令

```bash
pnpm dev        # 启动开发环境
crbn status     # 查看状态
crbn down       # 停止服务
crbn reset      # 重置数据
```
