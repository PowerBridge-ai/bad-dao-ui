# 📱 BAD DAO UI Specification for AI-Generation

## 📋 Table of Contents
- [🎯 Project Overview](#project-overview)
- [🎨 Design System](#design-system)
- [🧩 Component Library](#component-library)
- [📐 Layout Framework](#layout-framework)
- [📱 Responsive Design Requirements](#responsive-design-requirements)
- [♿ Accessibility Requirements](#accessibility-requirements)
- [🗣️ Localization Requirements](#localization-requirements)
- [🔄 User Flows](#user-flows)
- [🔐 Authentication](#authentication)
- [⚙️ ThirdWeb Integration](#thirdweb-integration)
- [🤖 AI Features](#ai-features)
- [📋 Implementation Priority](#implementation-priority)

## 🎯 Project Overview

BAD DAO UI is a comprehensive decentralized autonomous organization (DAO) governance interface that enables users to participate in proposal creation, voting, treasury management, and other governance activities through an intuitive, accessible interface with advanced AI capabilities.

The UI should be:
- Modern and intuitive for both blockchain experts and newcomers
- Fully responsive across all device types
- Accessible to users with disabilities
- Internationalized for global audiences
- Seamlessly integrated with blockchain functionality via ThirdWeb
- Enhanced with AI-powered features for smart contract interaction

### Key Features
1. User authentication (including Google Sign-in)
2. DAO proposal creation and voting
3. Treasury management and analytics
4. Smart contract interaction through conversational AI
5. Community discussion and delegation
6. User profile and governance statistics

## 🎨 Design System

### Color Palette

**Primary Colors**
- Primary Blue: `#2E5BFF` (RGB: 46, 91, 255)
- Secondary Blue: `#6E8EFA` (RGB: 110, 142, 250)
- Dark Blue: `#1A2B63` (RGB: 26, 43, 99)

**Secondary Colors**
- Accent Gold: `#F5A623` (RGB: 245, 166, 35)
- Accent Green: `#28C96F` (RGB: 40, 201, 111)
- Accent Red: `#FF4D4D` (RGB: 255, 77, 77)

**Neutral Colors**
- Dark Grey: `#1E1E1E` (RGB: 30, 30, 30)
- Medium Grey: `#6E6E6E` (RGB: 110, 110, 110)
- Light Grey: `#E5E5E5` (RGB: 229, 229, 229)
- Off White: `#F9F9F9` (RGB: 249, 249, 249)

**Color Usage Guidelines**
- Primary Blue: Main actions, links, highlights
- Secondary Blue: Secondary elements
- Dark Blue: Backgrounds, dark mode elements
- Accent Gold: Highlights, notifications, warnings
- Accent Green: Success states, positive indicators
- Accent Red: Error states, alerts, destructive actions
- Dark Grey: Text, icons in light mode
- Medium Grey: Secondary text, disabled states
- Light Grey: Borders, dividers, subtle UI elements
- Off White: Backgrounds, containers

### Typography

**Font Families**
- Heading Font: Inter, sans-serif
- Body Font: Inter, sans-serif
- Monospace Font: Roboto Mono, monospace (for code, data)

**Type Scale**
- Heading 1: 32px, 700 weight, 40px line height
- Heading 2: 24px, 700 weight, 32px line height
- Heading 3: 20px, 600 weight, 28px line height
- Heading 4: 18px, 600 weight, 24px line height
- Body Large: 16px, 400 weight, 24px line height
- Body: 14px, 400 weight, 22px line height
- Body Small: 12px, 400 weight, 18px line height
- Label: 14px, 600 weight, 20px line height
- Button: 14px, 600 weight, 20px line height
- Caption: 12px, 400 weight, 16px line height

### Spacing System
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Grid System
- 12-column grid layout
- Gutter width: 24px
- Margin width: 24px (desktop), 16px (tablet), 16px (mobile)

### Animation
- Fast duration: 150ms
- Medium duration: 250ms
- Slow duration: 350ms
- Standard easing: cubic-bezier(0.4, 0.0, 0.2, 1)
- In-out easing: cubic-bezier(0.4, 0.0, 0.6, 1)

## 🧩 Component Library

### Core Components

#### Buttons
- **Primary Button**: Filled with primary blue background
- **Secondary Button**: Outlined with primary blue border
- **Tertiary Button**: Text-only with primary blue text
- **Icon Button**: Square button with centered icon
- **Loading Button**: Any button type with loading spinner

```
Primary button properties:
- Min height: 44px
- Padding: 12px 16px
- Border radius: 8px
- Font: Button (14px, 600 weight)
- States: default, hover, focus, disabled, loading
```

#### Form Controls
- **Text Input**: Standard text field with label
- **Select Dropdown**: Custom select with options
- **Checkbox**: Square checkbox with label
- **Radio Button**: Circular option selector
- **Switch/Toggle**: Toggle for binary options
- **Textarea**: Multi-line text input

```
Input field properties:
- Min height: 44px
- Padding: 12px 16px
- Border: 1px solid Light Grey
- Border radius: 8px
- Font: Body (14px, 400 weight)
- Label position: Above input
- Error state: Red border, error message below
```

#### Navigation
- **Header**: App-wide navigation bar
- **Sidebar**: Collapsible navigation panel
- **Tabs**: Horizontal content switcher
- **Breadcrumbs**: Page location indicator
- **Pagination**: Multi-page navigation

#### Data Display
- **Card**: Content container with optional header
- **Table**: Structured data display
- **List**: Vertical item listing
- **Chart**: Data visualization (bar, line, pie)
- **Badge**: Status indicator
- **Avatar**: User profile image

#### Feedback
- **Alert**: Important message banner
- **Notification**: Temporary status message
- **Progress Indicators**: Linear and circular
- **Skeleton Loaders**: Content loading placeholders
- **Toast Messages**: Brief notifications

#### Modals & Dialogs
- **Modal Dialog**: Centered overlay window
- **Side Panel**: Edge-anchored overlay panel
- **Confirmation Dialog**: Action verification
- **Toast Notification**: Temporary feedback

#### Specialized DAO Components
- **Proposal Card**: Summary of governance proposal
- **Voting Interface**: Yes/No/Abstain controls
- **Treasury Widget**: Financial summary
- **Delegation Panel**: Voting power delegation

## 📐 Layout Framework

### Page Templates

#### Dashboard Layout
```
+---------------------------------------+
|              HEADER/NAV               |
+---------------------------------------+
|                                       |
|           SUMMARY METRICS             |
|                                       |
+------------------+--------------------+
|                  |                    |
|   ACTIVE         |    TREASURY        |
|   PROPOSALS      |    OVERVIEW        |
|                  |                    |
+------------------+--------------------+
|                                       |
|           VOTING HISTORY              |
|                                       |
+---------------------------------------+
|                                       |
|        RECENT TRANSACTIONS            |
|                                       |
+---------------------------------------+
|              FOOTER                   |
+---------------------------------------+
```

#### Proposal Detail Layout
```
+---------------------------------------+
|              HEADER/NAV               |
+---------------------------------------+
|                                       |
|           PROPOSAL TITLE              |
|           PROPOSAL META               |
|                                       |
+------------------+--------------------+
|                  |                    |
|   PROPOSAL       |    VOTING          |
|   CONTENT        |    INTERFACE       |
|                  |                    |
+------------------+--------------------+
|                                       |
|           DISCUSSION                  |
|                                       |
+---------------------------------------+
|              FOOTER                   |
+---------------------------------------+
```

#### Treasury Layout
```
+---------------------------------------+
|              HEADER/NAV               |
+---------------------------------------+
|                                       |
|           TREASURY SUMMARY            |
|                                       |
+---------------------------------------+
|                                       |
|           ASSET BREAKDOWN             |
|                                       |
+---------------------------------------+
|                                       |
|           TRANSACTION HISTORY         |
|                                       |
+---------------------------------------+
|              FOOTER                   |
+---------------------------------------+
```

#### Smart Contract AI Layout
```
+---------------------------------------+
|              HEADER/NAV               |
+---------------------------------------+
|                                       |
|           CONTRACT SELECTOR           |
|                                       |
+------------------+--------------------+
|                  |                    |
|   CONTRACT       |    AI CHAT         |
|   INFO           |    INTERFACE       |
|                  |                    |
+------------------+--------------------+
|                                       |
|           TRANSACTION HISTORY         |
|                                       |
+---------------------------------------+
|              FOOTER                   |
+---------------------------------------+
```

## 📱 Responsive Design Requirements

### Breakpoint System
- xs (mobile): <480px
- sm (tablet-small): 480px - 767px
- md (tablet): 768px - 1023px
- lg (desktop): 1024px - 1439px
- xl (desktop-large): ≥1440px

### Mobile Adaptations
1. **Navigation**: Convert desktop navigation to bottom bar or hamburger menu
2. **Layout**: Stack multi-column layouts vertically
3. **Tables**: Convert to card view for rows
4. **Charts**: Simplified views with essential data
5. **Touch Targets**: Minimum 44px × 44px for all interactive elements

### Tablet Adaptations
1. **Navigation**: Collapsible sidebar
2. **Layout**: Reduce column counts
3. **Forms**: Balance between inline and stacked fields
4. **Data Density**: Medium data density

### Desktop Enhancements
1. **Navigation**: Persistent sidebar
2. **Layout**: Multi-column with detailed information
3. **Data Tables**: Full featured with inline actions
4. **Advanced Features**: Detailed charts, tooltips, keyboard shortcuts

### Implementation Requirements
- Mobile-first CSS approach
- Responsive images with appropriate srcset
- Touch-friendly interactions on mobile
- Progressive enhancement for advanced features
- No horizontal scrolling at any breakpoint
- Critical content visible without scrolling on initial load
- Support for both portrait and landscape orientations

## ♿ Accessibility Requirements

### Compliance Standards
- WCAG 2.1 Level AA compliance required
- Aim for AAA compliance where feasible

### Key Requirements
1. **Keyboard Navigation**: All features must be accessible via keyboard
2. **Screen Reader Support**: All content must be readable by screen readers
3. **Color Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
4. **Text Resizing**: Support 200% text size without loss of functionality
5. **Focus Indicators**: Clear visual indicators for keyboard focus
6. **Alternative Text**: All images must have appropriate alt text
7. **Form Labels**: All form controls must have associated labels
8. **Error Identification**: Clear error messages for form validation
9. **Aria Attributes**: Proper ARIA roles and attributes
10. **Skip Links**: Skip navigation link for keyboard users

### Testing Requirements
- Screen reader testing with NVDA and VoiceOver
- Keyboard-only navigation testing
- Color contrast verification
- Automated accessibility testing with axe-core
- User testing with individuals with disabilities

## 🗣️ Localization Requirements

### Language Support
- **Phase 1 (Launch)**: English, Spanish, Chinese, Russian, Korean
- **Phase 2**: Japanese, German, French, Portuguese, Turkish

### Localization Implementation
1. **Text Content**: All UI text must be externalized in language files
2. **Date/Time Formats**: Follow locale-specific formats
3. **Number Formats**: Support locale-specific number formatting
4. **RTL Support**: Implement for Arabic and Hebrew in Phase 2
5. **Layout Expansion**: Design for text expansion (30-40%)
6. **Cultural Considerations**: Neutral imagery and icons

### Technical Requirements
- Implement i18next and react-i18next
- Enable language detection and switching
- Support pluralization and formatting
- Implement locale-specific date/time/number formatting with Intl API
- Bundle size optimization with on-demand language loading

## 🔄 User Flows

### Authentication Flow
1. User arrives at landing page
2. Clicks "Connect" button
3. Selects authentication method (Wallet, Google, Email)
4. Completes authentication
5. Returns to app with personalized experience

### Proposal Creation Flow
1. User navigates to Proposals section
2. Clicks "Create Proposal" button
3. Fills proposal form with title, description, and voting parameters
4. Adds supporting documents (optional)
5. Previews proposal
6. Submits proposal
7. Signs transaction with wallet
8. Receives confirmation of proposal creation

### Voting Flow
1. User browses active proposals
2. Opens proposal details
3. Reviews proposal content and discussion
4. Selects voting option (For/Against/Abstain)
5. Confirms vote
6. Signs transaction with wallet
7. Receives confirmation of vote recording

### Smart Contract AI Interaction Flow
1. User navigates to Contract Manager
2. Enters contract address or selects from saved contracts
3. Views contract information
4. Types natural language prompt in AI chat
5. Reviews AI-generated response
6. Approves or modifies suggested action
7. Confirms transaction if required
8. Views transaction result

## 🔐 Authentication

### Authentication Methods
1. **Wallet Connection**
   - Support for MetaMask, WalletConnect, Coinbase Wallet
   - Sign-in with Ethereum

2. **Social Authentication**
   - Google Sign-In (high priority)
   - Twitter (optional)
   - Discord (optional)

3. **Email Authentication**
   - Email/password registration
   - Email verification
   - Password reset flow

### Implementation Requirements
- Implement OAuth 2.0 for Google Sign-In
- Session management with secure storage
- Connection between social accounts and wallet addresses
- Authentication state persistence
- Secure logout process
- Account linking between multiple auth methods
- Profile data synchronization

## ⚙️ ThirdWeb Integration

### Core SDK Integration
- Implement ThirdWeb wallet connection
- Contract interaction for governance/voting
- Treasury management features
- Transaction signing and confirmation

### Nebula AI Integration
- Conversational interface for smart contract interaction
- Smart contract analysis and explanation
- Transaction generation from natural language
- Error handling and explanation

### Implementation Requirements
- Install ThirdWeb SDK and dependencies
- Set up Nebula API client
- Implement session management for AI interaction
- Build transaction preview and confirmation UI
- Create contract management interface
- Implement wallet connection with proper error handling

## 🤖 AI Features

### Smart Contract Assistant
- Natural language interaction with smart contracts
- Contract analysis and explanation
- Transaction creation and execution
- Error diagnosis and troubleshooting

### Governance Assistant
- Proposal summarization and analysis
- Explanation of governance parameters
- Voting recommendations (with clear disclaimers)
- Treasury management suggestions

### Implementation Requirements
- Create chat interface for AI interaction
- Implement session management for conversation context
- Add transaction preview and confirmation steps
- Ensure clear explanation of AI-generated actions
- Provide help and examples for effective prompting

## 📋 Implementation Priority

1. **Foundation (P0)**
   - Authentication system with Google Sign-In
   - Core layout and navigation
   - Basic component library
   - Responsive framework

2. **Core Features (P1)**
   - Wallet connection
   - Dashboard view
   - Proposal listing and detail views
   - Basic voting functionality
   - Treasury overview

3. **Enhanced Features (P2)**
   - ThirdWeb Nebula AI integration
   - Advanced proposal creation
   - Delegation system
   - Transaction history
   - User profiles

4. **Advanced Features (P3)**
   - Advanced analytics
   - Community features
   - Additional language support
   - Enhanced accessibility features
   - Performance optimizations

## 📲 Final Requirements

1. The UI must be fully responsive, following the mobile-first approach
2. All components must be accessible according to WCAG 2.1 AA standards
3. Google Sign-In must be fully implemented and functional
4. Text content must be localizable, starting with English
5. ThirdWeb integration must be complete for core blockchain functionality
6. AI features should be integrated with proper security and confirmation flows
7. The design system must be consistently applied
8. User flows must be intuitive and thoroughly tested
9. Performance must be optimized for all device types

---

This specification provides comprehensive guidelines for the BAD DAO UI implementation. The AI development system should create a fully functional, responsive, accessible interface that follows these specifications while maintaining high standards of usability and performance. 