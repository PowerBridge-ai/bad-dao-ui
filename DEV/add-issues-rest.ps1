# add-issues-rest.ps1
# Script to add issues to a GitHub project using REST API

# Project settings
$projectNumber = 14
$ownerOrg = "PowerBridge-ai"
$repoName = "BAD"

# Issue numbers (from the screenshot)
$issueNumbers = @(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)

# Display info
Write-Host "Adding issues to project $ownerOrg/$repoName Project #$projectNumber" -ForegroundColor Cyan
Write-Host "Issues to add: $($issueNumbers -join ', ')" -ForegroundColor Cyan

# First, get the project ID using the GitHub API
Write-Host "Fetching project information..." -ForegroundColor Cyan
$projects = gh api "orgs/$ownerOrg/projects"
$projectsData = $projects | ConvertFrom-Json
$project = $projectsData | Where-Object { $_.number -eq $projectNumber }

if (-not $project) {
    Write-Error "Project #$projectNumber not found. Please check the project number."
    exit 1
}

$projectId = $project.id
Write-Host "Project ID: $projectId" -ForegroundColor Green

# Add each issue to the project
foreach ($issueNumber in $issueNumbers) {
    Write-Host "Adding issue #$issueNumber to project..." -ForegroundColor Cyan
    
    # Get the issue ID
    $issueInfo = gh api "repos/$ownerOrg/$repoName/issues/$issueNumber"
    $issue = $issueInfo | ConvertFrom-Json
    
    if (-not $issue) {
        Write-Warning "Issue #$issueNumber not found, skipping"
        continue
    }
    
    # Add issue to project using REST API
    $data = @{
        content_id = $issue.id
        content_type = "Issue"
        project_id = $projectId
    } | ConvertTo-Json
    
    gh api "projects/columns/cards" --method POST -f "data=$data"
    
    Write-Host "✅ Successfully added issue #$issueNumber" -ForegroundColor Green
}

Write-Host "✅ Process completed" -ForegroundColor Green 