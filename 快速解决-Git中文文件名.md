# 快速解决：Git 中文文件名显示问题

## 问题

Git 提交时看到这样的文件名：
```
\3u5\277\253\351\200\237\345\217\202\350\200\203...
```

## 一行命令解决

```bash
git config --global core.quotepath false
```

## 完整配置（推荐）

### Windows PowerShell

```powershell
# 运行配置脚本
.\setup-git-chinese.ps1

# 或者手动配置
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
git config --global core.precomposeunicode true
```

### Linux/Mac/Git Bash

```bash
# 运行配置脚本
chmod +x setup-git-chinese.sh
./setup-git-chinese.sh

# 或者手动配置
git config --global core.quotepath false
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
git config --global core.precomposeunicode true
```

## 验证

配置后运行：

```bash
git status
```

应该能看到正确的中文文件名：
```
modified:   快速参考-超级管理员登录.md
modified:   内置超级管理员账号-使用指南.md
```

## 如果还是不行

### 1. 检查配置

```bash
git config --list | grep quotepath
```

应该显示：`core.quotepath=false`

### 2. 重启终端

关闭并重新打开终端或 IDE

### 3. 检查终端编码

**PowerShell:**
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

**CMD:**
```cmd
chcp 65001
```

## 最佳实践

### 对于新项目

建议使用英文文件名，避免跨平台问题：
```
docs/
  ├── quick-reference.md
  ├── user-guide.md
  └── deployment.md
```

### 对于现有项目

如果已经使用中文文件名：
1. 配置 Git 正确显示
2. 在 README 中说明配置要求
3. 团队成员统一配置

## 相关文档

详细说明请查看：`Git中文文件名显示问题解决.md`
