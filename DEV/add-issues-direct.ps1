# add-issues-direct.ps1
# Script to add issues to a GitHub project using direct GitHub CLI commands

# Project settings
$projectNumber = 14
$ownerOrg = "PowerBridge-ai"
$repoName = "BAD"

# Issue numbers (from the screenshot)
$issueNumbers = @(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)

# Display info
Write-Host "Adding issues to project $ownerOrg/$repoName Project #$projectNumber" -ForegroundColor Cyan
Write-Host "Issues to add: $($issueNumbers -join ', ')" -ForegroundColor Cyan

# First, get the project ID using the GitHub CLI
Write-Host "Fetching project information..." -ForegroundColor Cyan
$projectData = gh project view $projectNumber --owner $ownerOrg --json id
$projectId = ($projectData | ConvertFrom-Json).id

if (-not $projectId) {
    Write-Error "Could not retrieve project ID. Make sure the project exists and you have proper permissions."
    exit 1
}

Write-Host "Project ID: $projectId" -ForegroundColor Green

# Add each issue to the project using the CLI
foreach ($issueNumber in $issueNumbers) {
    try {
        Write-Host "Adding issue #$issueNumber to project..." -ForegroundColor Cyan
        gh project item-add $projectId --owner $ownerOrg --url "https://github.com/$ownerOrg/$repoName/issues/$issueNumber"
        Write-Host "✅ Successfully added issue #$issueNumber" -ForegroundColor Green
    }
    catch {
        Write-Warning "Failed to add issue #$issueNumber to project"
    }
}

Write-Host "✅ Process completed" -ForegroundColor Green 