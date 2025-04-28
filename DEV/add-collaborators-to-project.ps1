# add-collaborators-to-project.ps1
# Script to add repo collaborators to a GitHub Project

# Project settings
$projectNumber = 13  # Project number from gh project list
$projectId = "PVT_kwHOCIpEY84A3Vlm"  # Project ID from gh project list
$ownerOrg = "PowerBridge-ai"
$repoName = "BAD"

# Get collaborators
$collaborators = @("kootie", "Azizudinly", "PowerBridge-ai")

# Display info
Write-Host "Adding collaborators to project $ownerOrg/$repoName Project #$projectNumber" -ForegroundColor Cyan
Write-Host "Project ID: $projectId" -ForegroundColor Cyan
Write-Host "Collaborators to add: $($collaborators -join ', ')" -ForegroundColor Cyan

# Add each collaborator to the project
foreach ($collaborator in $collaborators) {
    Write-Host "Processing collaborator $collaborator..." -ForegroundColor Cyan
    
    # First get the user's node ID
    $userQuery = @"
query {
  user(login: "$collaborator") {
    id
  }
}
"@

    try {
        $userData = gh api graphql -f query="$userQuery"
        $userJson = $userData | ConvertFrom-Json
        $userId = $userJson.data.user.id
        
        if (-not $userId) {
            Write-Warning "Could not find user ID for $collaborator, skipping"
            continue
        }
        
        Write-Host "User ID for $collaborator is $userId" -ForegroundColor Cyan
        
        # Add collaborator using GraphQL mutation
        $mutation = @"
mutation {
  updateProjectV2Collaborators(input: {projectId: "$projectId", userIds: ["$userId"], permission: ADMIN}) {
    projectV2 {
      id
    }
  }
}
"@

        $result = gh api graphql -f query="$mutation"
        $resultObject = $result | ConvertFrom-Json
        
        if ($resultObject.errors) {
            $errorMsg = $resultObject.errors[0].message
            Write-Warning ("Error adding collaborator " + $collaborator + " to project. " + $errorMsg)
        } else {
            Write-Host "✅ Successfully added collaborator $collaborator" -ForegroundColor Green
        }
    }
    catch {
        $errorDetails = $_.Exception.Message
        Write-Warning ("Failed to process collaborator " + $collaborator + ". " + $errorDetails)
    }
}

Write-Host "✅ Process completed" -ForegroundColor Green 