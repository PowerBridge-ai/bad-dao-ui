# github-project-issue-tool.ps1
# Tool for adding issues to GitHub projects using GitHub CLI
param(
    [Parameter(Mandatory=$true)]
    [int]$ProjectNumber,
    
    [Parameter(Mandatory=$true)]
    [string]$OwnerOrg,
    
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    
    [Parameter(Mandatory=$true)]
    [int[]]$IssueNumbers
)

# First, get the project ID - convert number to integer explicitly for GraphQL
$projectInfo = gh api graphql -f query='
query($org: String!, $number: Int!) {
  organization(login: $org) {
    projectV2(number: $number) {
      id
    }
  }
}' -f org=$OwnerOrg -f number=$ProjectNumber --jq '.data.organization.projectV2.id'

if (-not $projectInfo) {
    Write-Error "Project not found: Project #$ProjectNumber in $OwnerOrg"
    exit 1
}

$projectId = $projectInfo.Trim()
Write-Host "Project ID: $projectId" -ForegroundColor Cyan

# Add each issue to the project
foreach ($issueNumber in $IssueNumbers) {
    # Get the issue node ID - convert number to integer explicitly for GraphQL
    $issueInfo = gh api graphql -f query='
    query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $number) {
          id
        }
      }
    }' -f owner=$OwnerOrg -f repo=$RepoName -f number=$issueNumber --jq '.data.repository.issue.id'

    if (-not $issueInfo) {
        Write-Warning "Issue #$issueNumber not found in repository $OwnerOrg/$RepoName, skipping"
        continue
    }
    
    $issueId = $issueInfo.Trim()
    Write-Host "Adding Issue #$issueNumber (ID: $issueId) to project" -ForegroundColor Cyan
    
    # Add issue to project
    $result = gh api graphql -f query='
    mutation($project:ID!, $item:ID!) {
      addProjectV2ItemById(input: {projectId: $project, contentId: $item}) {
        item {
          id
        }
      }
    }' -f project=$projectId -f item=$issueId

    if ($result -match "error") {
        Write-Warning "Error adding issue #$issueNumber to project: $result"
    } else {
        Write-Host "✅ Successfully added issue #$issueNumber to project" -ForegroundColor Green
    }
}

Write-Host "Issues added to project successfully!" -ForegroundColor Green 