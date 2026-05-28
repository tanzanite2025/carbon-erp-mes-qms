# Git 仓库迁移指南

## 🎯 目标

将 Carbon 项目从原始仓库 (crbnos/carbon) 迁移到你自己的 GitHub 仓库。

---

## 📋 前提条件

1. ✅ 已在 GitHub 上创建了新的空仓库
2. ✅ 有 GitHub 账号的访问权限

---

## 🚀 方案 1: 完整迁移（推荐）

保留所有历史记录，但指向你的新仓库。

### 步骤 1: 创建 GitHub 新仓库

1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 填写信息：
   - **Repository name**: `carbon-erp-mes-qms` (或你喜欢的名字)
   - **Description**: `Carbon ERP/MES/QMS 制造管理系统`
   - **Visibility**: Private 或 Public
   - ⚠️ **不要** 勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

### 步骤 2: 更改远程仓库地址

在 Git Bash 中运行：

```bash
cd /c/Users/P16V/Desktop/Github/carbon-erp-mes-qms/carbon

# 查看当前远程仓库
git remote -v

# 删除原始远程仓库
git remote remove origin

# 添加你的新仓库（替换为你的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/carbon-erp-mes-qms.git

# 验证
git remote -v
```

### 步骤 3: 推送到新仓库

```bash
# 推送主分支
git push -u origin main

# 如果有其他分支，也推送
git push --all origin

# 推送所有标签
git push --tags origin
```

---

## 🚀 方案 2: 保留上游连接

如果你想继续从原始仓库获取更新：

### 步骤 1: 创建新仓库（同方案 1）

### 步骤 2: 配置双远程仓库

```bash
cd /c/Users/P16V/Desktop/Github/carbon-erp-mes-qms/carbon

# 重命名原始远程仓库为 upstream
git remote rename origin upstream

# 添加你的仓库为 origin
git remote add origin https://github.com/YOUR_USERNAME/carbon-erp-mes-qms.git

# 验证
git remote -v
# 应该看到：
# origin    https://github.com/YOUR_USERNAME/carbon-erp-mes-qms.git (fetch)
# origin    https://github.com/YOUR_USERNAME/carbon-erp-mes-qms.git (push)
# upstream  https://github.com/crbnos/carbon.git (fetch)
# upstream  https://github.com/crbnos/carbon.git (push)
```

### 步骤 3: 推送到你的仓库

```bash
# 推送到你的仓库
git push -u origin main
```

### 步骤 4: 从上游获取更新（可选）

```bash
# 获取上游更新
git fetch upstream

# 合并上游的 main 分支
git merge upstream/main

# 推送到你的仓库
git push origin main
```

---

## 🚀 方案 3: 全新开始

如果你想要一个干净的历史记录：

### 步骤 1: 创建新仓库（同方案 1）

### 步骤 2: 删除 Git 历史

```bash
cd /c/Users/P16V/Desktop/Github/carbon-erp-mes-qms/carbon

# 删除 .git 目录
rm -rf .git

# 重新初始化
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "Initial commit: Carbon ERP/MES/QMS system"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/carbon-erp-mes-qms.git

# 推送
git branch -M main
git push -u origin main
```

---

## 📝 推荐的提交信息

如果选择方案 3，可以添加一个详细的初始提交：

```bash
git commit -m "Initial commit: Carbon ERP/MES/QMS system

- Cloned from https://github.com/crbnos/carbon
- Configured for local development
- Modified Redis port to 6380 to avoid conflicts
- Added Chinese localization support
- Created development documentation in Chinese
- Added startup scripts for Windows

Features:
- ERP (Enterprise Resource Planning)
- MES (Manufacturing Execution System)
- QMS (Quality Management System)
- Multi-tenant architecture
- Real-time data synchronization
- Full Chinese language support
"
```

---

## 🔧 配置 Git 用户信息

确保你的 Git 配置正确：

```bash
# 设置全局用户名
git config --global user.name "Your Name"

# 设置全局邮箱
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
```

---

## 🔐 GitHub 认证

### 方式 1: HTTPS + Personal Access Token (推荐)

1. 在 GitHub 上创建 Personal Access Token:
   - Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token
   - 勾选 `repo` 权限
   - 复制 token

2. 推送时使用 token:
   ```bash
   git push origin main
   # Username: YOUR_USERNAME
   # Password: YOUR_TOKEN (不是密码！)
   ```

### 方式 2: SSH

1. 生成 SSH 密钥:
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```

2. 添加到 GitHub:
   - Settings → SSH and GPG keys → New SSH key
   - 粘贴 `~/.ssh/id_ed25519.pub` 的内容

3. 使用 SSH URL:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/carbon-erp-mes-qms.git
   ```

---

## 📂 .gitignore 检查

确保敏感文件不会被提交：

```bash
# 查看 .gitignore
cat .gitignore

# 应该包含：
# .env
# .env.local
# node_modules/
# dist/
# .DS_Store
# *.log
```

如果 `.env` 已经被提交，需要移除：

```bash
# 从 Git 中移除但保留本地文件
git rm --cached .env

# 提交更改
git commit -m "Remove .env from version control"
```

---

## 🎯 推荐流程（方案 2）

我推荐使用**方案 2**，原因：

✅ **保留历史** - 完整的提交历史
✅ **可追溯** - 知道代码来源
✅ **可更新** - 可以从上游获取更新
✅ **灵活** - 可以自定义修改

### 完整命令（复制粘贴）

```bash
# 1. 进入项目目录
cd /c/Users/P16V/Desktop/Github/carbon-erp-mes-qms/carbon

# 2. 重命名原始远程仓库
git remote rename origin upstream

# 3. 添加你的仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/carbon-erp-mes-qms.git

# 4. 推送到你的仓库
git push -u origin main

# 5. 验证
git remote -v
```

---

## 📊 验证迁移成功

1. **检查远程仓库**:
   ```bash
   git remote -v
   ```

2. **查看分支**:
   ```bash
   git branch -a
   ```

3. **访问 GitHub**:
   - 打开你的仓库页面
   - 应该看到所有文件和提交历史

4. **测试克隆**:
   ```bash
   # 在另一个目录测试
   git clone https://github.com/YOUR_USERNAME/carbon-erp-mes-qms.git test-clone
   cd test-clone
   ls -la
   ```

---

## 🔄 日常工作流程

### 提交更改

```bash
# 查看状态
git status

# 添加文件
git add .

# 提交
git commit -m "描述你的更改"

# 推送
git push origin main
```

### 从上游获取更新（如果使用方案 2）

```bash
# 获取上游更新
git fetch upstream

# 查看差异
git log HEAD..upstream/main --oneline

# 合并更新
git merge upstream/main

# 解决冲突（如果有）
# 编辑冲突文件，然后：
git add .
git commit -m "Merge upstream changes"

# 推送到你的仓库
git push origin main
```

---

## 📝 添加自定义文档

将你创建的文档提交到仓库：

```bash
# 添加所有新文档
git add *.md

# 提交
git commit -m "Add Chinese documentation

- 端口冲突分析.md
- ERP与MES架构分析.md
- CHINESE_LOCALIZATION_ANALYSIS.md
- 启动步骤.md
- Windows启动指南.md
- 配置完成总结.md
- Git仓库迁移指南.md
"

# 推送
git push origin main
```

---

## ⚠️ 注意事项

1. **不要提交敏感信息**
   - `.env` 文件
   - API 密钥
   - 密码
   - 个人信息

2. **大文件处理**
   - 如果有大文件，考虑使用 Git LFS
   - 或者添加到 `.gitignore`

3. **许可证**
   - Carbon 使用 AGPL-3.0 许可证
   - 如果公开发布，需要遵守许可证条款
   - 私有使用通常没问题

4. **定期备份**
   - 定期推送到 GitHub
   - 考虑设置自动备份

---

## 🎉 完成！

现在你有了自己的 Carbon 仓库，可以：

- ✅ 自由修改代码
- ✅ 添加自定义功能
- ✅ 保存你的配置
- ✅ 与团队协作
- ✅ 持续获取上游更新（如果使用方案 2）

祝你使用愉快！🚀
