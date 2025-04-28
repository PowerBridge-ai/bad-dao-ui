# update-issue-status.ps1
# Tool for updating issue statuses in GitHub projects using GitHub CLI
param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectNumber,
    
    [Parameter(Mandatory=$true)]
    [string]$OwnerOrg,
    
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    
    [Parameter(Mandatory=$true)]
    [int]$IssueNumber,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("Todo", "In Progress", "Done")]
    [string]$Status
)

# Get the project ID
$projectInfo = gh api graphql -f query='
query($org: String!, $number: Int!) {
  organization(login: $org) {
    projectV2(number: $number) {
      id
      fields(first: 20) {
        nodes {
          ... on ProjectV2SingleSelectField {
            id
            name
            options {
              id
              name
            }
          }
        }
      }
    }
  }
}' -f org=$OwnerOrg -f number=$ProjectNumber

# Parse the JSON response to get project ID and status field details
$projectData = $projectInfo | ConvertFrom-Json
$projectId = $projectData.data.organization.projectV2.id

# Find the status field (usually called "Status")
$statusField = $projectData.data.organization.projectV2.fields.nodes | Where-Object { $_.name -eq "Status" }
$statusFieldId = $statusField.id

# Find the status option ID that matches the requested status
$statusOptionId = ($statusField.options | Where-Object { $_.name -eq $Status }).id

if (-not $statusOptionId) {
    Write-Error "Status '$Status' not found in project. Available statuses: $($statusField.options.name -join ', ')"
    exit 1
}

# Get the item ID for the issue
$issueItemInfo = gh api graphql -f query='
query($projectId: ID!, $owner: String!, $repo: String!, $issueNumber: Int!) {
  organization(login: $owner) {
    projectV2(number: $projectId) {
      items(first: 1, filter: {for: [{field: content_repository, equals: $repo}, {field: issue_number, equals: $issueNumber}]}) {
        nodes {
          id
        }
      }
    }
  }
}' -f projectId=$ProjectNumber -f owner=$OwnerOrg -f repo=$RepoName -f issueNumber=$IssueNumber

$itemData = $issueItemInfo | ConvertFrom-Json
$itemId = $itemData.data.organization.projectV2.items.nodes[0].id

if (-not $itemId) {
    Write-Error "Issue #$IssueNumber not found in project. Make sure it's added to the project first."
    exit 1
}

# Update the status
$updateResult = gh api graphql -f query='
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { 
        singleSelectOptionId: $optionId
      }
    }
  ) {
    projectV2Item {
      id
    }
  }
}' -f projectId=$projectId -f itemId=$itemId -f fieldId=$statusFieldId -f optionId=$statusOptionId

echo "Updated issue #$IssueNumber status to '$Status' in project" 