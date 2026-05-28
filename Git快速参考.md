# Git 快速参考

## 🚀 一键迁移

### 使用脚本（推荐）

**在 Git Bash 中**:
```bash
./migrate-to-my-repo.sh YOUR_GITHUB_USERNAME
```

**在 PowerShell 中**:
```powershell
.\migrate-to-my-repo.ps1 YOUR_GITHUB_USERNAME
```

---

## 📝 手动迁移步骤

### 1. 创建 GitHub 仓库

1. 登录 GitHub
2. 点击 "+" → "New repository"
3. 名称: `carbon-erp-mes-qms`
4. **不要** 初始化 README
5. 创建仓库

### 2. 配置远程仓库

```bash
# 重命名原始仓库
git remote rename origin upstream

# 添加你的仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/carbon-erp-mes-qms.git

# 验证
git remote -v
```

### 3. 推送代码

```bash
git push -u origin main
```

---

## 🔄 日常操作

### 提交更改

```bash
# 查看状态
git status

# 添加所有更改
git add .

# 提交
git commit -m "描述你的更改"

# 推送
git push origin main
```

### 查看历史

```bash
# 查看提交历史
git log --oneline

# 查看最近 5 条
git log --oneline -5

# 查看详细信息
git log -p
```

### 撤销更改

```bash
# 撤销工作区的更改
git checkout -- filename

# 撤销暂存区的更改
git reset HEAD filename

# 撤销最后一次提交（保留更改）
git reset --soft HEAD~1

# 撤销最后一次提交（丢弃更改）
git reset --hard HEAD~1
```

---

## 🔄 从上游获取更新

```bash
# 获取上游更新
git fetch upstream

# 查看差异
git log HEAD..upstream/main --oneline

# 合并更新
git merge upstream/main

# 推送到你的仓库
git push origin main
```

---

## 🌿 分支操作

### 创建和切换分支

```bash
# 创建新分支
git branch feature-name

# 切换分支
git checkout feature-name

# 创建并切换（一步完成）
git checkout -b feature-name

# 查看所有分支
git branch -a
```

### 合并分支

```bash
# 切换到主分支
git checkout main

# 合并功能分支
git merge feature-name

# 删除已合并的分支
git branch -d feature-name
```

---

## 🔍 查看差异

```bash
# 查看工作区和暂存区的差异
git diff

# 查看暂存区和最后一次提交的差异
git diff --staged

# 查看两个分支的差异
git diff main..feature-name
```

---

## 📦 暂存操作

```bash
# 暂存当前更改
git stash

# 查看暂存列表
git stash list

# 恢复最近的暂存
git stash pop

# 恢复特定的暂存
git stash apply stash@{0}

# 删除暂存
git stash drop stash@{0}
```

---

## 🏷️ 标签操作

```bash
# 创建标签
git tag v1.0.0

# 创建带注释的标签
git tag -a v1.0.0 -m "Version 1.0.0"

# 查看所有标签
git tag

# 推送标签
git push origin v1.0.0

# 推送所有标签
git push origin --tags

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
```

---

## 🔧 配置

### 用户信息

```bash
# 设置用户名
git config --global user.name "Your Name"

# 设置邮箱
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
```

### 别名

```bash
# 设置别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --all"

# 使用别名
git st
git lg
```

---

## 🚨 紧急情况

### 恢复已删除的文件

```bash
# 查找文件最后出现的提交
git log --all --full-history -- path/to/file

# 恢复文件
git checkout <commit-hash> -- path/to/file
```

### 修改最后一次提交

```bash
# 修改提交信息
git commit --amend -m "新的提交信息"

# 添加遗漏的文件到最后一次提交
git add forgotten-file
git commit --amend --no-edit
```

### 强制推送（谨慎使用）

```bash
# 强制推送（会覆盖远程历史）
git push origin main --force

# 更安全的强制推送
git push origin main --force-with-lease
```

---

## 📊 查看信息

```bash
# 查看远程仓库信息
git remote show origin

# 查看文件的修改历史
git log --follow -- filename

# 查看谁修改了某一行
git blame filename

# 查看仓库大小
git count-objects -vH
```

---

## 🧹 清理

```bash
# 清理未跟踪的文件（预览）
git clean -n

# 清理未跟踪的文件
git clean -f

# 清理未跟踪的文件和目录
git clean -fd

# 清理被忽略的文件
git clean -fX
```

---

## 🔐 认证

### HTTPS (Personal Access Token)

```bash
# 推送时会提示输入
git push origin main
# Username: YOUR_USERNAME
# Password: YOUR_TOKEN (不是密码！)
```

### SSH

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your.email@example.com"

# 添加到 ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 测试连接
ssh -T git@github.com

# 更改远程 URL 为 SSH
git remote set-url origin git@github.com:YOUR_USERNAME/carbon-erp-mes-qms.git
```

---

## 📚 常用组合

### 完整的功能开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "Add new feature"

# 3. 获取最新的主分支
git checkout main
git pull origin main

# 4. 合并到功能分支
git checkout feature/new-feature
git merge main

# 5. 解决冲突（如果有）

# 6. 推送功能分支
git push origin feature/new-feature

# 7. 在 GitHub 上创建 Pull Request

# 8. 合并后删除分支
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### 同步 Fork

```bash
# 1. 获取上游更新
git fetch upstream

# 2. 切换到主分支
git checkout main

# 3. 合并上游更新
git merge upstream/main

# 4. 推送到你的仓库
git push origin main
```

---

## 🎯 最佳实践

1. **频繁提交** - 小步快跑，便于回滚
2. **清晰的提交信息** - 描述做了什么和为什么
3. **使用分支** - 主分支保持稳定
4. **定期推送** - 避免丢失工作
5. **代码审查** - 使用 Pull Request
6. **保持同步** - 定期从上游获取更新

---

## 📖 提交信息规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**:
```
feat(erp): add customer management module

- Add customer list page
- Add customer detail page
- Add customer creation form

Closes #123
```

---

## 🆘 获取帮助

```bash
# 查看命令帮助
git help <command>
git <command> --help

# 示例
git help commit
git push --help
```

---

## 🔗 有用的链接

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 文档](https://docs.github.com)
- [Git 速查表](https://training.github.com/downloads/github-git-cheat-sheet/)
- [Learn Git Branching](https://learngitbranching.js.org/)
