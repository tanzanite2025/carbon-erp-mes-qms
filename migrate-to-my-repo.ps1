# Git Repository Migration Script for Windows
# Usage: .\migrate-to-my-repo.ps1 YOUR_GITHUB_USERNAME

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Carbon Repository Migration Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$RepoName = "carbon-erp-mes-qms"
$NewRepoUrl = "https://github.com/$GitHubUsername/$RepoName.git"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  GitHub Username: $GitHubUsername"
Write-Host "  Repository Name: $RepoName"
Write-Host "  New Repository URL: $NewRepoUrl"
Write-Host ""

# Confirm
$confirm = Read-Host "Continue? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Cancelled" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Step 1: Check Git Status" -ForegroundColor Cyan
Write-Host "----------------------------------------"

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "Warning: You have uncommitted changes" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    $commitNow = Read-Host "Commit these changes first? (y/n)"
    if ($commitNow -eq "y") {
        git add .
        $commitMsg = Read-Host "Enter commit message"
        git commit -m $commitMsg
        Write-Host "Changes committed" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Step 2: Configure Remote Repositories" -ForegroundColor Cyan
Write-Host "----------------------------------------"

Write-Host "Current remote repositories:"
git remote -v

Write-Host ""
Write-Host "Renaming origin to upstream..."
git remote rename origin upstream
Write-Host "Renamed" -ForegroundColor Green

Write-Host ""
Write-Host "Adding new origin..."
git remote add origin $NewRepoUrl
Write-Host "Added" -ForegroundColor Green

Write-Host ""
Write-Host "New remote configuration:"
git remote -v

Write-Host ""
Write-Host "Step 3: Push to New Repository" -ForegroundColor Cyan
Write-Host "----------------------------------------"

Write-Host "Pushing main branch to new repository..."
try {
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Push successful!" -ForegroundColor Green
    } else {
        throw "Push failed"
    }
} catch {
    Write-Host "Push failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "  1. Repository doesn't exist - Create it on GitHub first"
    Write-Host "  2. Authentication failed - Check your GitHub credentials"
    Write-Host "  3. Network issue - Check your internet connection"
    Write-Host ""
    Write-Host "Restoring original configuration..." -ForegroundColor Yellow
    git remote remove origin
    git remote rename upstream origin
    Write-Host "Restored" -ForegroundColor Green
    exit 1
}

Write-Host ""
Write-Host "Step 4: Verification" -ForegroundColor Cyan
Write-Host "----------------------------------------"

Write-Host "Remote repositories:"
git remote -v

Write-Host ""
Write-Host "Current branch:"
git branch -vv

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Migration Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Visit your repository: https://github.com/$GitHubUsername/$RepoName"
Write-Host "  2. Verify all files are uploaded"
Write-Host "  3. Add README and description"
Write-Host ""
Write-Host "Get updates from upstream:" -ForegroundColor Cyan
Write-Host "  git fetch upstream"
Write-Host "  git merge upstream/main"
Write-Host "  git push origin main"
Write-Host ""
Write-Host "Daily commits:" -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host '  git commit -m "Your commit message"'
Write-Host "  git push origin main"
Write-Host ""
