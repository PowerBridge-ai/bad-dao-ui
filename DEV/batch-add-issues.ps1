# batch-add-issues.ps1
# Batch script to add BAD issues to the BUILD A DAO : BOOT STRAP 14 project

# Project settings
[int]$projectNumber = 14
$ownerOrg = "PowerBridge-ai"
$repoName = "BAD"

# Issue numbers (from the screenshot)
$issueNumbers = @(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)

# Display info
Write-Host "Adding issues to project $ownerOrg/$repoName Project #$projectNumber" -ForegroundColor Cyan
Write-Host "Issues to add: $($issueNumbers -join ', ')" -ForegroundColor Cyan

# Call the main script with these parameters
.\github-project-issue-tool.ps1 -ProjectNumber $projectNumber -OwnerOrg $ownerOrg -RepoName $repoName -IssueNumbers $issueNumbers

Write-Host "✅ Added issues to BUILD A DAO : BOOT STRAP 14 project" -ForegroundColor Green 