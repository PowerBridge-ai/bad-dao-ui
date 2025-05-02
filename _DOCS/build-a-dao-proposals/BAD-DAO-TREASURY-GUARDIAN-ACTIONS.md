# 🤖 BAD DAO: Treasury Guardian AI - Action Framework

## 📋 Table of Contents
- [🔍 Overview](#-overview)
- [📝 Action Schema](#-action-schema)
- [🔐 Security Actions](#-security-actions)
- [🧠 Analysis Actions](#-analysis-actions)
- [🚨 Alert Actions](#-alert-actions)
- [🔄 Governance Actions](#-governance-actions)
- [🔌 Integration Actions](#-integration-actions)
- [📊 Reporting Actions](#-reporting-actions)

## 🔍 Overview

This document defines the standardized action framework for the Treasury Guardian AI, specifying the precise actions, commands, and protocols it can execute to fulfill its security mandate. These actions are designed with appropriate boundaries to ensure the Guardian can effectively protect treasury assets while maintaining necessary human oversight.

## 📝 Action Schema

Each Treasury Guardian action follows a standardized schema:

```yaml
action_id: Unique identifier for the action
name: Human-readable action name
description: Purpose and function of the action
authorization_level: Required authorization to execute this action
parameters:
  - name: Parameter name
    type: Data type
    required: True/False
    description: Parameter purpose
    validation: Validation rules
execution_context: Where and when this action can be executed
side_effects: Potential consequences of this action
audit_trail: What information is logged about this action
human_oversight: Required human verification/approval
examples:
  - example: Example usage
    context: When this example would be used
```

## 🔐 Security Actions

Actions that enforce security controls and protect treasury assets:

### ⏱️ Timelock Management

```yaml
action_id: TG-SEC-001
name: ExtendTimelock
description: Extends the timelock period for a pending transaction based on risk assessment
authorization_level: Autonomous (Based on risk threshold)
parameters:
  - name: transaction_id
    type: string
    required: true
    description: Unique identifier of the transaction
    validation: Must be a valid pending transaction
  - name: extension_period
    type: integer
    required: true
    description: Additional time in hours to add to timelock
    validation: Must be within allowed range (1-168 hours)
  - name: risk_score
    type: integer
    required: true
    description: Calculated risk score justifying extension
    validation: Must be above minimum threshold (8+)
  - name: justification
    type: string
    required: true
    description: Detailed reason for timelock extension
    validation: Must include specific risk factors identified
execution_context: Only for transactions in pending state with timelock
side_effects: Delays transaction execution, notifies signers
audit_trail: Full record of original timelock, extension, risk factors, and notifications
human_oversight: Can be overridden by Guardian Council with 5/7 approval
examples:
  - example: ExtendTimelock(tx_id="0x1a2b3c...", extension_period=48, risk_score=9, justification="Unusual destination address with recent suspicious activity reported on 3 similar protocols")
    context: High-risk transaction detected with multiple risk factors
```

```yaml
action_id: TG-SEC-002
name: FlagTransaction
description: Marks a transaction with a risk level requiring additional verification
authorization_level: Autonomous
parameters:
  - name: transaction_id
    type: string
    required: true
    description: Unique identifier of the transaction
    validation: Must be a valid transaction
  - name: risk_level
    type: string
    required: true
    description: Assessed risk level
    validation: Must be one of [MODERATE, HIGH, CRITICAL, SEVERE]
  - name: verification_requirements
    type: object
    required: true
    description: Additional verification steps required
    validation: Must follow verification schema
  - name: evidence
    type: array
    required: true
    description: Supporting evidence for risk assessment
    validation: Must include at least one evidence item
execution_context: Any transaction in any state
side_effects: Changes transaction metadata, may trigger notifications
audit_trail: Risk level, evidence, timestamp, and subsequent verifications
human_oversight: Flag can be removed with appropriate verification
examples:
  - example: FlagTransaction(tx_id="0x4d5e6f...", risk_level="HIGH", verification_requirements={require_core_team: 3, require_documentation: ["purpose_verification", "recipient_confirmation"]}, evidence=[{type: "anomaly", description: "Transaction amount 500% above historical average for this recipient"}])
    context: Unusually large transaction detected
```

### 🛑 Circuit Breaker

```yaml
action_id: TG-SEC-003
name: ActivateCircuitBreaker
description: Emergency pause of all treasury transactions
authorization_level: High Risk Autonomous with Confirmation
parameters:
  - name: threat_level
    type: string
    required: true
    description: Severity of detected threat
    validation: Must be "CRITICAL" or "SEVERE"
  - name: evidence_package
    type: object
    required: true
    description: Comprehensive evidence justifying activation
    validation: Must include multiple high-confidence indicators
  - name: freeze_duration
    type: integer
    required: true
    description: Initial freeze duration in hours
    validation: Must be between 24-72 hours
  - name: notification_targets
    type: array
    required: true
    description: Entities to notify of activation
    validation: Must include all core team members and guardian council
execution_context: Only in response to critical security threats
side_effects: Halts all treasury operations, triggers emergency protocols
audit_trail: Comprehensive security event record with all evidence
human_oversight: Requires Guardian Council confirmation within 2 hours or auto-deactivates
examples:
  - example: ActivateCircuitBreaker(threat_level="SEVERE", evidence_package={indicators: [{type: "unauthorized_access", confidence: 0.95, details: "Multiple failed authentication attempts from unknown locations"}, {type: "suspicious_transaction", confidence: 0.92, details: "Unusual pattern matching known exploit"}], analysis: "Potential coordinated attack in progress"}, freeze_duration=72, notification_targets=["all_core_team", "guardian_council", "security_partners"])
    context: Detection of potential sophisticated attack on treasury
```

```yaml
action_id: TG-SEC-004
name: DeactivateCircuitBreaker
description: Restore normal treasury operations after security incident
authorization_level: Guardian Council Only
parameters:
  - name: authorization_proof
    type: object
    required: true
    description: Cryptographic proof of guardian council approval
    validation: Must contain valid signatures from required quorum
  - name: security_assessment
    type: object
    required: true
    description: Post-incident security evaluation
    validation: Must document threat resolution and security status
  - name: recovery_plan
    type: object
    required: false
    description: Steps to fully restore normal operations
    validation: Must include verification measures if provided
execution_context: Only when circuit breaker is active
side_effects: Resumes treasury operations, may implement additional monitoring
audit_trail: Full deactivation record including authorization, assessments, and recovery actions
human_oversight: Requires explicit Guardian Council action, cannot be autonomous
examples:
  - example: DeactivateCircuitBreaker(authorization_proof={signatures: ["0xabcd...", "0xefgh...", "0xijkl...", "0xmnop...", "0xqrst..."], timestamp: 1621234567}, security_assessment={threat_status: "RESOLVED", investigation_summary: "False positive triggered by unusual but legitimate transaction pattern", security_status: "NORMAL"}, recovery_plan={additional_monitoring: "Enhanced oversight of similar patterns for 7 days"}})
    context: After determining a security alert was a false positive
```

### 🔒 Access Control

```yaml
action_id: TG-SEC-005
name: VerifySignerAuthenticity
description: Validates the authenticity of transaction signers
authorization_level: Autonomous
parameters:
  - name: transaction_id
    type: string
    required: true
    description: Transaction being signed
    validation: Must be a valid transaction
  - name: signer_address
    type: string
    required: true
    description: Blockchain address of the signer
    validation: Must be valid address format
  - name: signature_metadata
    type: object
    required: true
    description: Contextual data about the signing event
    validation: Must contain required authentication markers
execution_context: During transaction signing process
side_effects: May flag suspicious signatures for review
audit_trail: Authentication verification results and confidence scores
human_oversight: Autonomous verification, but escalates suspicious cases
examples:
  - example: VerifySignerAuthenticity(transaction_id="0x7a8b9c...", signer_address="0xd1e2f3...", signature_metadata={timestamp: 1621236789, geo_region: "NA-US-CA", device_fingerprint: "a1b2c3d4e5f6", auth_method: "hardware_wallet", ip_hash: "0xabcdef..."})
    context: Routine signature verification during multi-sig transaction
```

## 🧠 Analysis Actions

Actions that analyze treasury data and detect potential issues:

### 🔍 Risk Assessment

```yaml
action_id: TG-ANA-001
name: CalculateTransactionRisk
description: Performs comprehensive risk assessment of a treasury transaction
authorization_level: Autonomous
parameters:
  - name: transaction_id
    type: string
    required: true
    description: Transaction to analyze
    validation: Must be a valid transaction
  - name: contextual_data
    type: object
    required: false
    description: Additional context for analysis
    validation: Must follow contextual data schema if provided
execution_context: Any new transaction or on-demand for existing transactions
side_effects: None (analysis only)
audit_trail: Full analysis details, factors considered, and resulting risk score
human_oversight: No oversight needed for analysis, only for resulting actions
examples:
  - example: CalculateTransactionRisk(transaction_id="0x1a2b3c...", contextual_data={related_proposals: ["BAD-PROP-20230515-0009-TREAS"], market_conditions: "normal", recent_security_events: []})
    context: New treasury transaction submitted for standard risk scoring
```

```yaml
action_id: TG-ANA-002
name: DetectAnomalousPatterns
description: Identifies unusual patterns in treasury activities
authorization_level: Autonomous
parameters:
  - name: analysis_period
    type: object
    required: true
    description: Time period to analyze
    validation: Must specify valid start and end times
  - name: analysis_scope
    type: array
    required: true
    description: Types of patterns to analyze
    validation: Must be valid pattern types
  - name: sensitivity
    type: float
    required: false
    description: Detection sensitivity level
    validation: Must be between 0.1-5.0, default 1.0
execution_context: Regular scheduled analysis and on-demand
side_effects: None (analysis only)
audit_trail: Detected anomalies, confidence scores, and baseline comparisons
human_oversight: No oversight needed for analysis, only for resulting alerts
examples:
  - example: DetectAnomalousPatterns(analysis_period={start: "2023-05-01T00:00:00Z", end: "2023-05-15T23:59:59Z"}, analysis_scope=["transaction_frequency", "amount_distribution", "recipient_patterns", "approval_timing"], sensitivity=1.2)
    context: Bi-weekly anomaly detection scan of treasury activity
```

### 📊 Compliance Verification

```yaml
action_id: TG-ANA-003
name: VerifyPolicyCompliance
description: Checks transaction compliance with treasury governance policies
authorization_level: Autonomous
parameters:
  - name: transaction_id
    type: string
    required: true
    description: Transaction to verify
    validation: Must be a valid transaction
  - name: policy_set
    type: array
    required: false
    description: Specific policies to check
    validation: Must be valid policy identifiers if provided
execution_context: Pre-execution verification for all transactions
side_effects: May prevent non-compliant transactions
audit_trail: Compliance status for each policy rule with justifications
human_oversight: No oversight for verification, only for compliance decisions
examples:
  - example: VerifyPolicyCompliance(transaction_id="0x4d5e6f...", policy_set=["spending_limits", "documentation_requirements", "approval_thresholds", "timelock_requirements"])
    context: Standard pre-execution compliance check
```

```yaml
action_id: TG-ANA-004
name: ValidateTransactionDocumentation
description: Verifies completeness and accuracy of transaction documentation
authorization_level: Autonomous
parameters:
  - name: transaction_id
    type: string
    required: true
    description: Transaction to validate
    validation: Must be a valid transaction
  - name: documentation_requirements
    type: object
    required: false
    description: Specific documentation requirements to check
    validation: Must follow documentation schema if provided
execution_context: During transaction preparation and before execution
side_effects: May flag transactions with incomplete documentation
audit_trail: Documentation completeness score and specific deficiencies
human_oversight: No oversight for validation, only for resulting flags
examples:
  - example: ValidateTransactionDocumentation(transaction_id="0x7a8b9c...", documentation_requirements={required_fields: ["purpose", "recipient_verification", "expected_outcome", "authorization_reference"], optional_fields: ["performance_metrics", "follow_up_actions"]})
    context: Documentation validation for a significant treasury allocation
```

## 🚨 Alert Actions

Actions that notify relevant parties about security issues:

### 📢 Notification Actions

```yaml
action_id: TG-ALT-001
name: IssueSecurityAlert
description: Sends security alerts to authorized recipients
authorization_level: Autonomous
parameters:
  - name: alert_level
    type: string
    required: true
    description: Severity level of the alert
    validation: Must be one of [INFO, WARNING, HIGH, CRITICAL, EMERGENCY]
  - name: alert_content
    type: object
    required: true
    description: Details of the security concern
    validation: Must include description and evidence
  - name: recipients
    type: array
    required: true
    description: Who should receive this alert
    validation: Must be valid recipient groups or individuals
  - name: response_options
    type: array
    required: false
    description: Available response actions
    validation: Must be valid response actions if provided
execution_context: When security concerns are detected
side_effects: Notifications sent to recipients
audit_trail: Full alert details, delivery status, and recipient responses
human_oversight: No oversight for sending alerts, contents reviewed regularly
examples:
  - example: IssueSecurityAlert(alert_level="HIGH", alert_content={title: "Suspicious Transaction Pattern Detected", description: "Multiple large transactions to new addresses detected in short timeframe", evidence: [{type: "transaction_list", data: ["0x1a2b3c...", "0x4d5e6f..."]}, {type: "pattern_description", data: "5 transactions over 1% of treasury value in 30 minutes"}], recommended_action: "Review transactions immediately"}, recipients=["core_team", "treasury_signers"], response_options=["acknowledge", "investigate", "freeze_transactions"])
    context: Detection of potential treasury drain attempt
```

```yaml
action_id: TG-ALT-002
name: GenerateDailySecurityReport
description: Creates and distributes daily treasury security status
authorization_level: Autonomous
parameters:
  - name: report_date
    type: string
    required: true
    description: Date for the report
    validation: Must be a valid date
  - name: report_sections
    type: array
    required: false
    description: Specific sections to include
    validation: Must be valid section types if provided
  - name: distribution_list
    type: array
    required: true
    description: Report recipients
    validation: Must be valid recipient groups or individuals
execution_context: Scheduled daily execution
side_effects: Report distribution to recipients
audit_trail: Report generation details and distribution records
human_oversight: Regular review of report format and content
examples:
  - example: GenerateDailySecurityReport(report_date="2023-05-15", report_sections=["transaction_summary", "risk_assessments", "anomaly_detections", "compliance_status", "security_recommendations"], distribution_list=["treasury_committee", "core_team"])
    context: Regular daily security report
```

### 🚫 Rejection Actions

```yaml
action_id: TG-ALT-003
name: RecommendTransactionRejection
description: Formally recommends rejection of high-risk transaction
authorization_level: High Risk Autonomous
parameters:
  - name: transaction_id
    type: string
    required: true
    description: Transaction to reject
    validation: Must be a valid transaction
  - name: risk_assessment
    type: object
    required: true
    description: Comprehensive risk analysis
    validation: Must have risk score above rejection threshold
  - name: rejection_justification
    type: string
    required: true
    description: Clear explanation for rejection recommendation
    validation: Must be detailed and reference specific risks
  - name: alternative_recommendations
    type: array
    required: false
    description: Suggested safe alternatives
    validation: Must be valid alternatives if provided
execution_context: When critical risk transactions are detected
side_effects: Transaction flagged for rejection, signers notified
audit_trail: Full rejection recommendation record with all evidence
human_oversight: Final rejection decision requires human approval
examples:
  - example: RecommendTransactionRejection(transaction_id="0xabcdef...", risk_assessment={risk_score: 18, risk_factors: [{factor: "destination_address", description: "Address linked to known scam"}, {factor: "transaction_pattern", description: "Matches known exploit sequence"}], confidence: 0.94}, rejection_justification="Transaction matches multiple patterns associated with governance attacks. Destination address has been flagged in 3 security bulletins.", alternative_recommendations=["Implement alternative through contract X with additional verification", "Split transaction into multiple smaller transactions with incremental verification"])
    context: When identifying a likely fraudulent transaction
```

## 🔄 Governance Actions

Actions related to governance processes and rules:

### 📝 Policy Enforcement

```yaml
action_id: TG-GOV-001
name: EnforceApprovalThresholds
description: Ensures transactions have required approval levels
authorization_level: Autonomous
parameters:
  - name: transaction_id
    type: string
    required: true
    description: Transaction to verify
    validation: Must be a valid transaction
  - name: transaction_tier
    type: string
    required: true
    description: Tier level based on transaction value
    validation: Must be one of [TIER_1, TIER_2, TIER_3, TIER_4]
  - name: required_approvals
    type: object
    required: true
    description: Specific approval requirements
    validation: Must follow approval schema
execution_context: Before transaction execution
side_effects: May block execution if requirements not met
audit_trail: Approval verification details and resulting decision
human_oversight: No oversight for verification, only for threshold changes
examples:
  - example: EnforceApprovalThresholds(transaction_id="0x1a2b3c...", transaction_tier="TIER_3", required_approvals={min_total_signers: 4, min_core_team: 2, min_community_signers: 1, special_requirements: [{role: "treasury_committee", required: true}]})
    context: Enforcement of approval requirements for large transaction
```

```yaml
action_id: TG-GOV-002
name: VerifyGovernanceApproval
description: Confirms required governance votes for treasury actions
authorization_level: Autonomous
parameters:
  - name: transaction_id
    type: string
    required: true
    description: Transaction to verify
    validation: Must be a valid transaction
  - name: governance_reference
    type: string
    required: true
    description: Reference to governance decision
    validation: Must be valid proposal or vote
  - name: verification_depth
    type: string
    required: false
    description: How thoroughly to verify
    validation: Must be one of [BASIC, STANDARD, THOROUGH]
execution_context: Before execution of governance-dependent transactions
side_effects: May block execution if verification fails
audit_trail: Verification process details and outcome
human_oversight: No oversight for verification, only for verification failures
examples:
  - example: VerifyGovernanceApproval(transaction_id="0x4d5e6f...", governance_reference="BAD-PROP-20230515-0009-TREAS", verification_depth="THOROUGH")
    context: Verifying governance approval for treasury structure implementation
```

## 🔌 Integration Actions

Actions that connect with other systems:

### 🔗 Blockchain Monitoring

```yaml
action_id: TG-INT-001
name: MonitorBlockchainActivity
description: Monitors blockchain for treasury-related activity
authorization_level: Autonomous
parameters:
  - name: target_addresses
    type: array
    required: true
    description: Addresses to monitor
    validation: Must be valid blockchain addresses
  - name: event_types
    type: array
    required: true
    description: Types of events to monitor
    validation: Must be valid event types
  - name: monitoring_duration
    type: integer
    required: false
    description: How long to monitor in minutes
    validation: Must be positive integer, default continuous
execution_context: Continuous background process
side_effects: None (monitoring only)
audit_trail: Monitoring session details and detected events
human_oversight: No oversight needed for monitoring
examples:
  - example: MonitorBlockchainActivity(target_addresses=["0x1a2b3c...", "0x4d5e6f..."], event_types=["incoming_transaction", "outgoing_transaction", "approval_change", "ownership_change", "contract_interaction"], monitoring_duration=1440)
    context: Daily monitoring of treasury wallet activity
```

```yaml
action_id: TG-INT-002
name: ScanMempoolForTreasury
description: Scans transaction mempool for pending treasury transactions
authorization_level: Autonomous
parameters:
  - name: target_addresses
    type: array
    required: true
    description: Treasury addresses to monitor
    validation: Must be valid blockchain addresses
  - name: risk_patterns
    type: array
    required: false
    description: Specific patterns to watch for
    validation: Must be valid pattern definitions if provided
execution_context: Continuous background process
side_effects: None (monitoring only)
audit_trail: Scan results and identified transactions
human_oversight: No oversight needed for scanning
examples:
  - example: ScanMempoolForTreasury(target_addresses=["0x7a8b9c...", "0xd1e2f3..."], risk_patterns=[{pattern_type: "front_running", description: "Transaction that might front-run treasury operations"}, {pattern_type: "sandwich_attack", description: "Potential price manipulation around treasury transaction"}])
    context: Real-time monitoring for attack vectors against pending treasury transactions
```

### 🗄️ Data Integration

```yaml
action_id: TG-INT-003
name: ImportSecurityIntelligence
description: Imports external security data into Guardian system
authorization_level: Scheduled Autonomous
parameters:
  - name: data_sources
    type: array
    required: true
    description: External intelligence sources
    validation: Must be approved data sources
  - name: data_types
    type: array
    required: true
    description: Types of data to import
    validation: Must be valid data types
  - name: verification_level
    type: string
    required: false
    description: How thoroughly to verify imported data
    validation: Must be one of [BASIC, STANDARD, THOROUGH]
execution_context: Scheduled or on-demand import
side_effects: Updates internal security database
audit_trail: Import session details, data source reliability assessment
human_oversight: Periodic review of data source quality
examples:
  - example: ImportSecurityIntelligence(data_sources=["chainalysis", "consensys_threat_intelligence", "dao_security_alliance"], data_types=["suspicious_addresses", "attack_patterns", "vulnerability_reports", "threat_actor_profiles"], verification_level="THOROUGH")
    context: Weekly security intelligence update
```

## 📊 Reporting Actions

Actions that generate insights and reports:

### 📈 Treasury Health Reports

```yaml
action_id: TG-REP-001
name: GenerateTreasuryHealthReport
description: Creates comprehensive treasury security assessment
authorization_level: Scheduled Autonomous
parameters:
  - name: report_period
    type: object
    required: true
    description: Time period for the report
    validation: Must specify valid start and end times
  - name: report_sections
    type: array
    required: true
    description: Sections to include in report
    validation: Must be valid section types
  - name: report_format
    type: string
    required: false
    description: Format of the generated report
    validation: Must be one of [TEXT, HTML, JSON, PDF]
execution_context: Scheduled or on-demand generation
side_effects: Report stored in documentation system
audit_trail: Report generation details and content hash
human_oversight: Regular review of report quality
examples:
  - example: GenerateTreasuryHealthReport(report_period={start: "2023-04-01T00:00:00Z", end: "2023-04-30T23:59:59Z"}, report_sections=["executive_summary", "risk_metrics", "security_incidents", "compliance_status", "transaction_patterns", "recommendation", "action_items"], report_format="HTML")
    context: Monthly treasury health assessment
```

```yaml
action_id: TG-REP-002
name: GenerateSecurityMetrics
description: Calculates key security performance indicators
authorization_level: Autonomous
parameters:
  - name: metric_period
    type: object
    required: true
    description: Time period for metrics
    validation: Must specify valid start and end times
  - name: metric_categories
    type: array
    required: true
    description: Categories of metrics to generate
    validation: Must be valid metric categories
execution_context: Scheduled or on-demand calculation
side_effects: Updates metrics database
audit_trail: Calculation details and data sources
human_oversight: Regular review of metric relevance
examples:
  - example: GenerateSecurityMetrics(metric_period={start: "2023-05-01T00:00:00Z", end: "2023-05-15T23:59:59Z"}, metric_categories=["transaction_security", "signer_behavior", "policy_compliance", "response_time", "threat_detection", "system_performance"])
    context: Bi-weekly security metrics update
```

---

*Last updated: May 16, 2023* 