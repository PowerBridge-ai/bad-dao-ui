# 🎨 BAD DAO UI - Design System

## 🔍 Overview

This document outlines the comprehensive design system for the BAD DAO UI platform. The design system provides a unified approach to the user interface, ensuring consistency, accessibility, and a cohesive user experience across all aspects of the application.

## 🎯 Design Principles

### Clarity
- Prioritize clear communication over decoration
- Present complex blockchain concepts in simple, understandable ways
- Use visual hierarchy to guide users through workflows

### Consistency
- Apply uniform patterns across the platform
- Maintain predictable interactions and layouts
- Use standardized terminology throughout

### Efficiency
- Design for minimal steps to accomplish tasks
- Prioritize the most common user actions
- Reduce cognitive load through thoughtful design

### Accessibility
- Design for users of all abilities
- Meet WCAG 2.1 AA standards at minimum
- Ensure keyboard navigability throughout

### Community-Centric
- Design patterns that encourage participation
- Create interfaces that build trust and transparency
- Emphasize governance and collaborative decision-making

## 🎭 Brand Identity

### Logo

![BAD DAO UI Logo](../public/logo.svg)

The BAD DAO UI logo represents the fusion of blockchain technology and user-friendly interfaces. The logo can be used in two configurations:

- **Primary Logo**: Full logo with wordmark
- **Icon**: Symbol only for favicons and small spaces

### Color Palette

#### Primary Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Primary Blue** | `#3B82F6` | `59, 130, 246` | Primary actions, key UI elements |
| **Secondary Teal** | `#06B6D4` | `6, 182, 212` | Secondary actions, highlights |
| **Tertiary Purple** | `#8B5CF6` | `139, 92, 246` | Accents, feature highlights |

#### Neutral Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Black** | `#0F172A` | `15, 23, 42` | Text, icons |
| **Dark Gray** | `#334155` | `51, 65, 85` | Secondary text |
| **Medium Gray** | `#64748B` | `100, 116, 139` | Disabled states, tertiary text |
| **Light Gray** | `#CBD5E1` | `203, 213, 225` | Borders, dividers |
| **Off White** | `#F8FAFC` | `248, 250, 252` | Backgrounds, cards |
| **White** | `#FFFFFF` | `255, 255, 255` | Primary background |

#### Functional Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Success Green** | `#10B981` | `16, 185, 129` | Success states, completion |
| **Warning Amber** | `#F59E0B` | `245, 158, 11` | Warnings, pending states |
| **Error Red** | `#EF4444` | `239, 68, 68` | Errors, destructive actions |
| **Info Blue** | `#60A5FA` | `96, 165, 250` | Information, help |

#### Dark Mode Adjustments

| Light Mode | Dark Mode | Usage |
|------------|-----------|-------|
| `#FFFFFF` | `#0F172A` | Background swap |
| `#0F172A` | `#F8FAFC` | Text swap |
| `#CBD5E1` | `#475569` | Border swap |
| `#F8FAFC` | `#1E293B` | Card swap |

### Typography

#### Font Family

Primary Font: **Inter**
- Sans-serif, modern, highly readable
- Available weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- Fallback stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`

Monospace Font: **Fira Code**
- For code snippets, technical information, and addresses
- Fallback stack: `SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

#### Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| **Display** | 48px (3rem) | 1.1 | 700 | Hero sections, major headlines |
| **Heading 1** | 32px (2rem) | 1.2 | 700 | Page titles |
| **Heading 2** | 24px (1.5rem) | 1.25 | 600 | Section headings |
| **Heading 3** | 20px (1.25rem) | 1.3 | 600 | Subsection headings |
| **Heading 4** | 18px (1.125rem) | 1.4 | 600 | Card titles, smaller sections |
| **Body Large** | 18px (1.125rem) | 1.5 | 400 | Lead paragraphs, important info |
| **Body** | 16px (1rem) | 1.5 | 400 | Regular text, main content |
| **Body Small** | 14px (0.875rem) | 1.5 | 400 | Secondary information, metadata |
| **Caption** | 12px (0.75rem) | 1.5 | 400 | Labels, captions, footnotes |
| **Overline** | 12px (0.75rem) | 1.5 | 500 | ALL CAPS section labels |

### Iconography

The BAD DAO UI uses a cohesive icon system with the following characteristics:

- **Style**: Line icons with 1.5px stroke width
- **Size**: Standard 24px × 24px (can be scaled to 16px or 32px)
- **Corner Radius**: 2px for sharp corners, 4px for rounded elements
- **Guidelines**: Consistent optical weight, centered in 24px bounding box
- **Format**: SVG (preferred) or optimized PNG

#### Icon Categories

- **Navigation**: Home, menu, back, forward, settings
- **Actions**: Add, edit, delete, share, download, upload
- **Communication**: Message, notification, email
- **Blockchain**: Wallet, token, transaction, block, contract
- **Governance**: Vote, proposal, delegation, treasury
- **UI**: Search, filter, sort, expand, collapse, more

## 📱 Layout System

### Grid System

The layout is built on a 12-column grid system:

- **Container Max Width**: 1280px
- **Column Width**: Fluid, 1/12 of container
- **Gutter Width**: 24px (12px on each side)
- **Margin**: Auto-centered with minimum 24px edge margins

### Spacing Scale

| Name | Size | Usage |
|------|------|-------|
| **4xs** | 2px (0.125rem) | Minimal spacing, tight adjacent elements |
| **3xs** | 4px (0.25rem) | Very tight spacing, icon padding |
| **2xs** | 8px (0.5rem) | Tight spacing, small component padding |
| **xs** | 12px (0.75rem) | Form element padding |
| **sm** | 16px (1rem) | Standard component spacing |
| **md** | 24px (1.5rem) | Card padding, section spacing |
| **lg** | 32px (2rem) | Large separation between sections |
| **xl** | 48px (3rem) | Major section divisions |
| **2xl** | 64px (4rem) | Page section spacing |
| **3xl** | 96px (6rem) | Large page blocks |

### Breakpoints

| Name | Width | Description |
|------|-------|-------------|
| **xs** | < 640px | Mobile portrait |
| **sm** | ≥ 640px | Mobile landscape, small tablets |
| **md** | ≥ 768px | Tablets |
| **lg** | ≥ 1024px | Small desktops, large tablets |
| **xl** | ≥ 1280px | Desktop |
| **2xl** | ≥ 1536px | Large desktop |

### Responsive Behavior

- Mobile-first approach
- Stacking elements on smaller screens
- Simplified navigation on mobile
- Reduced padding/margins on small screens
- Hidden secondary information on mobile
- Touch-optimized interaction areas (minimum 44×44px)

## 🧩 Component System

### Core Components

#### Buttons

```jsx
// Primary Button
<Button variant="primary" size="md">Connect Wallet</Button>

// Secondary Button
<Button variant="secondary" size="md">Cancel</Button>

// Tertiary/Text Button
<Button variant="tertiary" size="md">Learn More</Button>

// Icon Button
<IconButton icon={<PlusIcon />} aria-label="Add item" />

// Destructive Button
<Button variant="destructive" size="md">Delete</Button>
```

Button sizes:
- **xs**: 24px height, 12px padding
- **sm**: 32px height, 16px padding
- **md**: 40px height, 16px padding
- **lg**: 48px height, 20px padding

Button states:
- Default
- Hover
- Active/Pressed
- Focus
- Disabled

#### Form Controls

```jsx
// Text input
<Input label="Username" placeholder="Enter your username" />

// Select
<Select label="Network" options={networks} />

// Checkbox
<Checkbox label="I agree to the terms" />

// Radio
<RadioGroup label="Voting options">
  <Radio value="for" label="Vote For" />
  <Radio value="against" label="Vote Against" />
  <Radio value="abstain" label="Abstain" />
</RadioGroup>

// Toggle
<Toggle label="Dark mode" />

// Slider
<Slider label="Amount" min={0} max={100} />

// TextArea
<TextArea label="Proposal description" rows={4} />
```

#### Cards

```jsx
// Standard Card
<Card>
  <CardHeader title="Treasury Balance" />
  <CardContent>
    <Text>100,000 TOKENS</Text>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>

// Proposal Card
<ProposalCard
  title="Increase Dev Fund"
  status="active"
  votes={{for: 60, against: 30, abstain: 10}}
  endTime={new Date('2025-06-01')}
/>

// Stats Card
<StatsCard
  title="Total Staked"
  value="43,210"
  unit="TOKENS"
  change="+5.4%"
/>
```

#### Navigation

```jsx
// Tabs
<Tabs>
  <Tab label="Proposals" />
  <Tab label="Treasury" />
  <Tab label="Delegation" />
  <Tab label="Vesting" />
</Tabs>

// Breadcrumbs
<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/governance">Governance</BreadcrumbItem>
  <BreadcrumbItem current>Proposal #123</BreadcrumbItem>
</Breadcrumbs>

// Pagination
<Pagination totalPages={10} currentPage={3} />

// Sidebar Navigation
<SideNav>
  <NavItem icon={<HomeIcon />} href="/">Dashboard</NavItem>
  <NavItem icon={<VoteIcon />} href="/governance">Governance</NavItem>
  <NavItem icon={<WalletIcon />} href="/treasury">Treasury</NavItem>
  <NavItem icon={<ClockIcon />} href="/vesting">Vesting</NavItem>
  <NavItem icon={<UsersIcon />} href="/delegation">Delegation</NavItem>
</SideNav>
```

#### Feedback

```jsx
// Alert
<Alert variant="success">Proposal created successfully!</Alert>
<Alert variant="warning">Voting period ending soon.</Alert>
<Alert variant="error">Transaction failed.</Alert>
<Alert variant="info">Connect your wallet to participate.</Alert>

// Toast
<Toast message="Tokens claimed successfully" action="View" onAction={() => {}} />

// Progress
<Progress value={75} max={100} />
<Spinner size="md" />

// Empty State
<EmptyState
  icon={<DocumentIcon />}
  title="No proposals yet"
  description="Create the first proposal for your DAO."
  action={<Button>Create Proposal</Button>}
/>
```

#### Data Display

```jsx
// Table
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>ID</TableHeader>
      <TableHeader>Title</TableHeader>
      <TableHeader>Status</TableHeader>
      <TableHeader>Votes</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>#123</TableCell>
      <TableCell>Increase Dev Fund</TableCell>
      <TableCell><Badge variant="success">Passed</Badge></TableCell>
      <TableCell>78%</TableCell>
    </TableRow>
  </TableBody>
</Table>

// Badge
<Badge variant="primary">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="neutral">Draft</Badge>

// Avatar
<Avatar src="/avatar.jpg" alt="User" size="md" />
<AvatarGroup users={[user1, user2, user3]} max={3} />

// Charts
<PieChart data={votingData} />
<BarChart data={treasuryData} />
<LineChart data={tokenPriceData} />
```

### Domain-Specific Components

#### Wallet Connection

```jsx
// Wallet Button
<WalletButton />

// Wallet Modal
<WalletModal isOpen={isOpen} onClose={onClose} />

// Address Display
<AddressDisplay address="0x1234...5678" />

// Network Selector
<NetworkSelector networks={supportedNetworks} />
```

#### Governance

```jsx
// Proposal Creation
<ProposalForm onSubmit={handleSubmit} />

// Voting Interface
<VotingCard
  proposal={proposalData}
  onVote={handleVote}
/>

// Governance Stats
<GovernanceStats
  proposals={proposalCount}
  participation={participationRate}
  treasury={treasurySize}
/>

// Timeline
<ProposalTimeline
  createdAt={createdDate}
  votingStarts={votingStartDate}
  votingEnds={votingEndDate}
  currentStep="voting"
/>
```

#### Treasury

```jsx
// Asset Display
<AssetCard
  symbol="ETH"
  amount="10.5"
  usdValue="$21,000"
  change="+2.4%"
/>

// Treasury Overview
<TreasuryOverview
  totalValue="$1,250,000"
  assets={assetList}
/>

// Allocation Chart
<AllocationChart allocations={allocationData} />

// Transaction History
<TransactionHistory transactions={recentTransactions} />
```

#### Vesting

```jsx
// Vesting Schedule
<VestingSchedule
  start={startDate}
  cliff={cliffDate}
  end={endDate}
  totalAmount="10,000"
  vestedAmount="2,500"
  claimableAmount="1,000"
/>

// Claim Interface
<ClaimCard
  claimable="1,000"
  nextVesting={nextVestingDate}
  onClaim={handleClaim}
/>

// Vesting Progress
<VestingProgress
  total={10000}
  vested={2500}
  claimed={1500}
/>
```

#### Delegation

```jsx
// Delegation Interface
<DelegationForm
  delegatee={delegateeAddress}
  amount={delegationAmount}
  onDelegate={handleDelegate}
/>

// Delegated Power
<DelegatedPowerCard
  incomingPower="5,000"
  outgoingPower="2,500"
/>

// Delegation List
<DelegationList
  delegations={activeDelegations}
  onRevoke={handleRevoke}
/>
```

## 📱 Responsive Patterns

### Layout Shifts

| Component | Mobile (xs) | Tablet (md) | Desktop (lg+) |
|-----------|-------------|-------------|---------------|
| **Navigation** | Bottom bar | Side drawer | Sidebar |
| **Tables** | Card view | Scrollable | Full view |
| **Forms** | Stacked fields | 2-column | Multi-column |
| **Actions** | Floating button | Inline | Inline |
| **Charts** | Simplified | Interactive | Detailed |
| **Dialogs** | Full screen | Centered modal | Centered modal |

### Navigation Patterns

- **Mobile**: Bottom navigation bar with key sections
- **Tablet**: Collapsible side drawer
- **Desktop**: Persistent sidebar with expanded labels

### Responsive Component Adjustments

- **Cards**: Full-width on mobile, grid on larger screens
- **Tables**: Card layout on mobile, tabular on larger screens
- **Forms**: Full-width fields on mobile, multi-column on desktop
- **Charts**: Simplified visualizations on mobile, interactive on desktop

## 🎭 Motion & Animation

### Principles

- Subtle, purposeful animations
- Performance-optimized
- Enhance rather than distract
- Provide feedback and context

### Duration & Easing

- **Fast**: 100ms - Button presses, simple toggles
- **Medium**: 200ms - Page transitions, panel slides
- **Slow**: 300ms - Complex animations, entrance animations

Easing functions:
- **Standard**: cubic-bezier(0.4, 0.0, 0.2, 1)
- **Entrance**: cubic-bezier(0.0, 0.0, 0.2, 1)
- **Exit**: cubic-bezier(0.4, 0.0, 1, 1)

### Animation Patterns

```css
/* Button hover */
.button {
  transition: background-color 100ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* Page transition */
.page-enter {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 200ms, transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1);
}

/* Modal */
.modal {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 200ms, transform 200ms cubic-bezier(0.0, 0.0, 0.2, 1);
}
.modal-enter {
  opacity: 1;
  transform: scale(1);
}
```

### Skeleton Loading

```jsx
// Card skeleton
<SkeletonCard />

// Text skeleton
<SkeletonText lines={3} />

// Table skeleton
<SkeletonTable rows={5} columns={4} />
```

## 🌐 Dark Mode

### Implementation

- Implemented using CSS variables for themable properties
- Toggle in user settings
- Respects system preferences
- Persistent user preference

### Color Mapping

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `#FFFFFF` | `#0F172A` |
| Card Background | `#F8FAFC` | `#1E293B` |
| Primary Text | `#0F172A` | `#F8FAFC` |
| Secondary Text | `#334155` | `#94A3B8` |
| Borders | `#CBD5E1` | `#475569` |
| Shadows | `rgba(0,0,0,0.1)` | `rgba(0,0,0,0.3)` |

### Component Adjustments

- **Charts**: Different color scales for dark mode
- **Icons**: Adjusted opacity and colors
- **Focus States**: Enhanced visibility in dark mode
- **Shadows**: Subtle adjustments for depth perception

## ♿ Accessibility Guidelines

### Standards Compliance

- WCAG 2.1 AA compliant minimum
- Semantic HTML structure
- WAI-ARIA roles and attributes
- Keyboard navigable interface

### Color Contrast

- Text: Minimum 4.5:1 contrast ratio
- Large text: Minimum 3:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio
- Non-text content: Descriptive alt text

### Keyboard Navigation

- Logical tab order
- Focus indicators for all interactive elements
- Keyboard shortcuts for common actions
- Skip navigation links

### Assistive Technology Support

- Screen reader announcements for dynamic content
- ARIA landmarks for major sections
- Form labels and descriptions
- Error states and messages

### Inclusive Design Considerations

- Support text resizing up to 200%
- No reliance on color alone for information
- Alternative text for all non-text content
- Captions for audio/video content

## 📝 Implementation Guidelines

### Using the Component Library

```jsx
// Import components
import { Button, Card, Input } from '@bad-dao/ui';

// Use tokens
import { tokens } from '@bad-dao/ui';

// Example component
function ProposalForm() {
  return (
    <Card>
      <h2 className="text-heading-2 mb-md">Create Proposal</h2>
      <div className="space-y-sm">
        <Input label="Title" placeholder="Enter proposal title" />
        <TextArea label="Description" placeholder="Describe your proposal" rows={4} />
        <Button variant="primary">Submit Proposal</Button>
      </div>
    </Card>
  );
}
```

### CSS Implementation

We use Tailwind CSS with a custom configuration that maps to our design tokens:

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: {
        DEFAULT: '#3B82F6',
        100: '#EFF6FF',
        // ... other shades
      },
      // ... other colors
    },
    spacing: {
      '4xs': '2px',
      '3xs': '4px',
      '2xs': '8px',
      'xs': '12px',
      'sm': '16px',
      'md': '24px',
      // ... other spacing values
    },
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    // ... other theme settings
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
};
```

### Theme Variables

```css
:root {
  /* Colors */
  --color-primary: #3B82F6;
  --color-secondary: #06B6D4;
  --color-tertiary: #8B5CF6;
  --color-background: #FFFFFF;
  --color-surface: #F8FAFC;
  --color-text: #0F172A;
  --color-text-secondary: #334155;
  --color-border: #CBD5E1;
  
  /* Spacing */
  --space-4xs: 2px;
  --space-3xs: 4px;
  --space-2xs: 8px;
  --space-xs: 12px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
  --space-3xl: 96px;
  
  /* ... other variables */
}

[data-theme="dark"] {
  --color-background: #0F172A;
  --color-surface: #1E293B;
  --color-text: #F8FAFC;
  --color-text-secondary: #94A3B8;
  --color-border: #475569;
  
  /* ... other dark theme variables */
}
```

## 🧪 QA Checklist

### Visual Consistency

- [ ] Typography follows type scale
- [ ] Spacing follows spacing scale
- [ ] Colors match design system palette
- [ ] Components render consistently across browsers
- [ ] Dark mode implementation is correct

### Functional Testing

- [ ] Interactive elements have hover/focus states
- [ ] Forms have proper validation states
- [ ] Loading states are implemented
- [ ] Empty states are handled
- [ ] Error states are handled

### Accessibility Testing

- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works
- [ ] Screen reader testing
- [ ] Focus management is correct
- [ ] Responsive behavior works on all breakpoints

## 🔄 Cross-References

- See [design/component-library.md](./component-library.md) for component API documentation
- See [design/wireframes.md](./wireframes.md) for page layouts and wireframes
- See [design/user-flows.md](./user-flows.md) for user journey maps
- See [technical/architecture.md](../technical/architecture.md) for technical implementation

---

**Last Updated:** 2025-05-02  
**Maintained By:** PowerBridge.AI Team

---

Made with Power, Love, and AI •  ⚡️❤️🤖 •  POWERBRIDGE.AI 