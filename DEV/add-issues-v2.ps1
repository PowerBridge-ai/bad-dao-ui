# add-issues-v2.ps1
# Script to add issues to a GitHub Project v2 using GraphQL API

# Project settings
$projectNumber = 14  # "BAD: Token Dev & launch" project number
$projectId = "PVT_kwHOCIpEY84A3V3D"  # Direct project ID from gh project list
$ownerOrg = "PowerBridge-ai"
$repoName = "BAD"

# Issue numbers (issues #13 to #33 for this project)
$issueNumbers = @(13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33)

# Display info
Write-Host "Adding issues to project $ownerOrg/$repoName Project #$projectNumber (BAD: Token Dev & launch)" -ForegroundColor Cyan
Write-Host "Project ID: $projectId" -ForegroundColor Cyan
Write-Host "Issues to add: $($issueNumbers -join ', ')" -ForegroundColor Cyan

# Add each issue to the project
foreach ($issueNumber in $issueNumbers) {
    Write-Host "Adding issue #$issueNumber to project..." -ForegroundColor Cyan
    
    # Get the issue node ID
    $issueQuery = @"
query {
  repository(owner: "$ownerOrg", name: "$repoName") {
    issue(number: $issueNumber) {
      id
    }
  }
}
"@

    $issueData = gh api graphql -f query="$issueQuery"
    $issueJson = $issueData | ConvertFrom-Json
    $issueId = $issueJson.data.repository.issue.id
    
    if (-not $issueId) {
        Write-Warning "Issue #$issueNumber not found, skipping"
        continue
    }
    
    Write-Host "Issue ID: $issueId" -ForegroundColor Cyan
    
    # Add issue to project using GraphQL mutation
    $mutation = @"
mutation {
  addProjectV2ItemById(input: {projectId: "$projectId", contentId: "$issueId"}) {
    item {
      id
    }
  }
}
"@

    $result = gh api graphql -f query="$mutation"
    $resultObject = $result | ConvertFrom-Json
    
    if ($resultObject.errors) {
        Write-Warning "Error adding issue #$issueNumber to project"
        Write-Warning $resultObject.errors[0].message
    } else {
        Write-Host "✅ Successfully added issue #$issueNumber" -ForegroundColor Green
    }
}

Write-Host "✅ Process completed" -ForegroundColor Green 