# Git 中文文件名显示问题解决

## 问题描述

在 Windows 上使用 Git 时，中文文件名会显示为转义的 Unicode 编码，例如：

```
\3u5\277\253\351\200\237\345\217\202\350\200\203...
```

实际文件名是：`快速参考-超级管理员登录.md`

## 原因

Git 默认会转义非 ASCII 字符，这是为了兼容不同的终端和系统。但在 Windows 上，这会导致中文文件名显示为乱码。

## 解决方案

### 方法 1：全局配置（推荐）

配置 Git 不转义中文文件名：

```bash
git config --global core.quotepath false
```

**说明：**
- `core.quotepath false` - 禁用路径引用转义
- `--global` - 全局配置，对所有仓库生效

### 方法 2：仅当前仓库配置

如果只想在当前仓库生效：

```bash
git config core.quotepath false
```

### 方法 3：临时查看

如果只是临时查看，可以使用：

```bash
git -c core.quotepath=false status
```

## 验证配置

配置后，再次查看 Git 状态：

```bash
git status
```

应该能正确显示中文文件名：

```
modified:   快速参考-超级管理员登录.md
modified:   内置超级管理员账号-使用指南.md
```

## 其他相关配置

### 1. 配置 Git 支持中文日志

```bash
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
```

### 2. 配置 Windows 终端编码

在 PowerShell 中：

```powershell
# 设置输出编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 或者在 PowerShell 配置文件中添加
# 编辑 $PROFILE 文件
notepad $PROFILE

# 添加以下内容：
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

在 CMD 中：

```cmd
chcp 65001
```

### 3. 配置 Git Bash

编辑 `~/.bashrc` 或 `~/.bash_profile`：

```bash
export LANG=zh_CN.UTF-8
export LC_ALL=zh_CN.UTF-8
```

## 常见问题

### Q1: 配置后仍然显示乱码？

**解决方法：**

1. 检查终端编码：
   ```bash
   chcp
   ```
   应该显示 `65001` (UTF-8)

2. 重启终端或 IDE

3. 检查 Git 配置：
   ```bash
   git config --list | grep quotepath
   ```
   应该显示 `core.quotepath=false`

### Q2: 提交时文件名乱码？

**解决方法：**

```bash
# 配置文件名编码
git config --global core.precomposeunicode true
```

### Q3: 在不同系统间协作时文件名问题？

**建议：**

1. **统一使用英文文件名**（推荐）
   - 避免跨平台问题
   - 更好的兼容性

2. **如果必须使用中文：**
   - 确保所有团队成员都配置了 `core.quotepath false`
   - 使用 UTF-8 编码
   - 在 `.gitattributes` 中指定编码

## 最佳实践

### 1. 项目文档命名建议

**推荐：**
```
docs/
  ├── quick-reference-super-admin.md
  ├── super-admin-guide.md
  └── deployment-guide.md
```

**不推荐：**
```
docs/
  ├── 快速参考-超级管理员.md
  ├── 超级管理员指南.md
  └── 部署指南.md
```

### 2. 如果必须使用中文

在项目根目录创建 `.gitattributes`：

```
*.md text eol=lf encoding=utf-8
```

### 3. 团队协作配置

在项目 README 中添加配置说明：

```markdown
## 开发环境配置

### Git 中文支持

```bash
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
```
```

## 完整配置脚本

创建一个配置脚本 `setup-git-chinese.sh`：

```bash
#!/bin/bash

echo "配置 Git 中文支持..."

# 禁用路径转义
git config --global core.quotepath false

# 配置编码
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
git config --global core.precomposeunicode true

echo "配置完成！"
echo ""
echo "当前配置："
git config --list | grep -E "(quotepath|encoding|unicode)"
```

Windows PowerShell 版本 `setup-git-chinese.ps1`：

```powershell
Write-Host "配置 Git 中文支持..." -ForegroundColor Green

# 禁用路径转义
git config --global core.quotepath false

# 配置编码
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
git config --global core.precomposeunicode true

Write-Host "配置完成！" -ForegroundColor Green
Write-Host ""
Write-Host "当前配置："
git config --list | Select-String -Pattern "(quotepath|encoding|unicode)"
```

## 使用配置脚本

### Linux/Mac:

```bash
chmod +x setup-git-chinese.sh
./setup-git-chinese.sh
```

### Windows PowerShell:

```powershell
.\setup-git-chinese.ps1
```

## 检查配置

查看所有相关配置：

```bash
git config --list | grep -E "(quotepath|encoding|unicode)"
```

应该看到：

```
core.quotepath=false
i18n.commitencoding=utf-8
i18n.logoutputencoding=utf-8
core.precomposeunicode=true
```

## 总结

### 快速解决

```bash
# 一行命令解决
git config --global core.quotepath false
```

### 完整配置

```bash
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
git config --global core.precomposeunicode true
```

### 最佳实践

1. ✅ 配置 Git 正确显示中文
2. ✅ 统一团队配置
3. ⚠️ 考虑使用英文文件名（跨平台项目）
4. ✅ 在 README 中说明配置要求

---

**相关文档：**
- [Git 官方文档 - core.quotepath](https://git-scm.com/docs/git-config#Documentation/git-config.txt-corequotePath)
- [Git 中文支持](https://git-scm.com/book/zh/v2)
