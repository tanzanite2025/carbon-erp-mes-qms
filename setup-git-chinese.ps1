# Git 中文支持配置脚本
# 适用于 Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Git 中文支持配置脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Git 是否安装
try {
    $gitVersion = git --version
    Write-Host "✓ 检测到 Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 未检测到 Git，请先安装 Git" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "开始配置..." -ForegroundColor Yellow
Write-Host ""

# 1. 禁用路径转义（最重要）
Write-Host "1. 配置 core.quotepath = false" -ForegroundColor White
git config --global core.quotepath false
Write-Host "   ✓ 完成" -ForegroundColor Green

# 2. 配置提交编码
Write-Host "2. 配置 i18n.commitencoding = utf-8" -ForegroundColor White
git config --global i18n.commitencoding utf-8
Write-Host "   ✓ 完成" -ForegroundColor Green

# 3. 配置日志输出编码
Write-Host "3. 配置 i18n.logoutputencoding = utf-8" -ForegroundColor White
git config --global i18n.logoutputencoding utf-8
Write-Host "   ✓ 完成" -ForegroundColor Green

# 4. 配置 Unicode 预组合
Write-Host "4. 配置 core.precomposeunicode = true" -ForegroundColor White
git config --global core.precomposeunicode true
Write-Host "   ✓ 完成" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  配置完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 显示当前配置
Write-Host "当前 Git 配置：" -ForegroundColor Yellow
Write-Host ""
git config --list | Select-String -Pattern "(quotepath|encoding|unicode)" | ForEach-Object {
    Write-Host "  $_" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  测试" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "现在可以运行以下命令测试：" -ForegroundColor White
Write-Host "  git status" -ForegroundColor Cyan
Write-Host ""
Write-Host "中文文件名应该能正确显示了！" -ForegroundColor Green
Write-Host ""
