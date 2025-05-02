# PowerShell script to set up GitHub project board and create initial issues

# Project number from previous command
$PROJECT_NUMBER = "19"
$REPO = "PowerBridge-ai/bad-dao-ui"

# Create labels
$LABELS = @(
    @{ name = "backend"; color = "0052CC"; description = "Backend related tasks" },
    @{ name = "frontend"; color = "5319E7"; description = "Frontend related tasks" },
    @{ name = "blockchain"; color = "1D76DB"; description = "Blockchain related tasks" },
    @{ name = "ai"; color = "D4C5F9"; description = "AI related tasks" },
    @{ name = "high-priority"; color = "B60205"; description = "High priority tasks" },
    @{ name = "medium-priority"; color = "D93F0B"; description = "Medium priority tasks" },
    @{ name = "low-priority"; color = "FBCA04"; description = "Low priority tasks" },
    @{ name = "governance"; color = "0E8A16"; description = "Governance related tasks" },
    @{ name = "treasury"; color = "006B75"; description = "Treasury related tasks" },
    @{ name = "vesting"; color = "5319E7"; description = "Vesting related tasks" },
    @{ name = "delegation"; color = "1D76DB"; description = "Delegation related tasks" }
)

foreach ($label in $LABELS) {
    gh label create $label.name --color $label.color --description $label.description --repo $REPO
}

# Create initial issues based on task log
$ISSUES = @(
    @{
        Title = "Complete Thirdweb Integration"
        Body = "Implement smart contract deployment and interaction with Thirdweb SDK"
        Labels = @("backend", "blockchain", "high-priority")
    },
    @{
        Title = "Implement Governance Interface"
        Body = "Create UI components for DAO governance, voting, and proposal management"
        Labels = @("frontend", "governance", "high-priority")
    },
    @{
        Title = "Develop Treasury Management"
        Body = "Build interface for managing DAO treasury, funds, and payouts"
        Labels = @("frontend", "treasury", "high-priority")
    },
    @{
        Title = "Create Vesting System"
        Body = "Implement token vesting schedules and management interface"
        Labels = @("frontend", "vesting", "medium-priority")
    },
    @{
        Title = "Build Delegation System"
        Body = "Develop interface for voting power delegation and management"
        Labels = @("frontend", "delegation", "medium-priority")
    },
    @{
        Title = "Integrate AI Features"
        Body = "Implement AI-powered proposal generation and natural language processing"
        Labels = @("ai", "frontend", "high-priority")
    },
    @{
        Title = "Add Voice Command Support"
        Body = "Implement voice command interface for DAO management"
        Labels = @("ai", "frontend", "low-priority")
    }
)

# Create issues and add to project
foreach ($issue in $ISSUES) {
    $issueUrl = gh issue create --title $issue.Title --body $issue.Body --label $issue.Labels[0] --label $issue.Labels[1] --label $issue.Labels[2] --repo $REPO
    gh project item-add $PROJECT_NUMBER --owner PowerBridge-ai --url $issueUrl
}

# Set up project fields
gh project field-create $PROJECT_NUMBER --owner PowerBridge-ai --name "Status" --data-type "SINGLE_SELECT" --single-select-options "Not Started" --single-select-options "In Progress" --single-select-options "Review" --single-select-options "Completed"
gh project field-create $PROJECT_NUMBER --owner PowerBridge-ai --name "Priority" --data-type "SINGLE_SELECT" --single-select-options "High" --single-select-options "Medium" --single-select-options "Low"
gh project field-create $PROJECT_NUMBER --owner PowerBridge-ai --name "Type" --data-type "SINGLE_SELECT" --single-select-options "Feature" --single-select-options "Bug" --single-select-options "Documentation" --single-select-options "Enhancement" 