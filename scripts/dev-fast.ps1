# ============================================
# Carbon 快速启动脚本 (PowerShell)
# ============================================
# 
# 用途: 检查 Docker 服务是否运行，如果运行则只重启应用
#       如果未运行则完整启动所有服务
#
# 使用: .\scripts\dev-fast.ps1
# ============================================

Write-Host ""
Write-Host "🚀 Carbon 快速启动模式" -ForegroundColor Blue
Write-Host ""

# 检查 Docker 服务是否运行
try {
    $dockerStatus = docker compose ps 2>$null | Select-String "Up"
    
    if ($dockerStatus) {
        Write-Host "✅ Docker 服务已运行，跳过启动" -ForegroundColor Green
        Write-Host "🔄 只重启应用 (ERP + MES)..." -ForegroundColor Yellow
        Write-Host ""
        
        # 只启动应用，不启动 Docker 服务
        pnpm dev:fast
    }
    else {
        Write-Host "🐳 Docker 服务未运行，首次完整启动..." -ForegroundColor Yellow
        Write-Host ""
        
        # 完整启动所有服务
        pnpm dev
    }
}
catch {
    Write-Host "🐳 Docker 服务未运行，首次完整启动..." -ForegroundColor Yellow
    Write-Host ""
    
    # 完整启动所有服务
    pnpm dev
}
