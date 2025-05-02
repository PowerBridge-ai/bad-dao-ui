# Core Team Evaluation System - Project Structure

## File Organization

```
core-team-eval/
├── public/                      # Static assets
│   ├── index.html               # Main HTML entry point
│   ├── favicon.ico              # Site favicon
│   ├── logo.svg                 # Application logo
│   ├── assets/                  # Media assets
│   │   ├── textures/            # 3D textures
│   │   ├── models/              # 3D models
│   │   └── sounds/              # Game sound effects
├── src/                         # Source code
│   ├── components/              # Reusable components
│   │   ├── common/              # Shared UI components
│   │   │   ├── Button.tsx       # Custom button component
│   │   │   ├── Card.tsx         # Card container component
│   │   │   ├── Input.tsx        # Form input component
│   │   │   └── ...              
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx       # Application header
│   │   │   ├── Footer.tsx       # Application footer
│   │   │   └── ...
│   │   ├── auth/                # Authentication components
│   │   │   ├── SignInForm.tsx   # Sign-in form
│   │   │   ├── AuthGuard.tsx    # Route protection component
│   │   │   └── ...
│   │   └── game/                # Game-specific components
│   │       ├── GameBoard.tsx    # 3D game board
│   │       ├── PlayerHUD.tsx    # Player heads-up display
│   │       ├── CalendarView.tsx # Calendar display
│   │       ├── ScenarioCard.tsx # Decision scenario card
│   │       ├── MiniGameModal.tsx # Mini-game interface
│   │       ├── PlayerToken.tsx  # 3D player representation
│   │       ├── PathNode.tsx     # Interactive path node
│   │       ├── ValueAlignmentMeter.tsx # Value meter component
│   │       └── ...
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.tsx      # Authentication state
│   │   ├── GameContext.tsx      # Game state management
│   │   └── ...
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Authentication hook
│   │   ├── useGame.ts           # Game utility hooks
│   │   └── ...
│   ├── pages/                   # Application pages
│   │   ├── HomePage.tsx         # Landing page
│   │   ├── SignInPage.tsx       # Authentication page
│   │   ├── ProfileSetupPage.tsx # User profile setup
│   │   ├── GamePage.tsx         # Main game interface
│   │   ├── ResultsPage.tsx      # Game results and analytics
│   │   └── admin/               # Admin section pages
│   │       ├── AdminDashboard.tsx # Admin main page
│   │       ├── AdminContentPage.tsx # Content management
│   │       ├── AdminSessionPage.tsx # Session management
│   │       └── AdminReportingPage.tsx # Reporting tools
│   ├── services/                # External services
│   │   ├── api.ts               # API client
│   │   ├── firebase.ts          # Firebase configuration
│   │   ├── analytics.ts         # Analytics service
│   │   └── ...
│   ├── utils/                   # Utility functions
│   │   ├── helpers.ts           # General helper functions
│   │   ├── gameCalculations.ts  # Game-specific calculations
│   │   ├── formatters.ts        # Data formatting utilities
│   │   └── ...
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.types.ts        # Authentication types
│   │   ├── game.types.ts        # Game-related types
│   │   └── ...
│   ├── styles/                  # Global styles
│   │   ├── global.css           # Global CSS
│   │   ├── tailwind.css         # Tailwind imports
│   │   └── ...
│   ├── App.tsx                  # Main application component
│   ├── index.tsx                # Application entry point
│   └── router.tsx               # Application routing
├── _DOCS/                       # Project documentation
│   ├── CORE-TEAM-EVAL_v1_0_0/   # Version documentation
│   │   ├── level-one-game-design.md # Game design document
│   │   ├── technical-specifications.md # Technical specs
│   │   └── ...
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── README.md                    # Project overview
├── dev-notes.md                 # Development notes
├── task-log.md                  # Task tracking log
└── file-tree.md                 # This file structure document
```

## Component Dependencies

### Game Components Relationships

```
GamePage
├── GameBoard
│   ├── PathNode
│   ├── PlayerToken
│   ├── CalendarSystem (3D)
│   └── Environment
├── PlayerHUD
│   └── ValueAlignmentMeter
├── ScenarioCard
├── MiniGameModal
└── CalendarView
```

### Context Consumption

```
GameContext
├── GamePage
├── GameBoard
├── PlayerHUD
├── ScenarioCard
├── MiniGameModal
└── CalendarView

AuthContext
├── App
├── SignInPage
├── ProfileSetupPage
├── ProtectedRoute
└── AdminPages
```

## File Sizes and Metrics

### Key Component Sizes

| Component | Lines of Code | Dependencies | Description |
|-----------|--------------|--------------|-------------|
| GameContext.tsx | 450+ | React | Central game state management |
| GameBoard.tsx | 350+ | React, Three.js | 3D game board renderer |
| PlayerHUD.tsx | 200+ | React, Framer | Player interface |
| MiniGameModal.tsx | 600+ | React, Framer | Mini-game framework |
| CalendarView.tsx | 250+ | React | Calendar visualization |
| PathNode.tsx | 100+ | React, Three.js | Interactive 3D path node |

### Component Structure Overview

The project follows a modular structure with clear separation of concerns:

1. **Pages**: Container components that compose multiple components
2. **Components**: Reusable UI elements grouped by functionality
3. **Context**: State management for application-wide concerns
4. **Hooks**: Encapsulated logic for component behavior
5. **Services**: External API integrations
6. **Utils**: Pure utility functions

This structure enables:
- Clear dependency paths
- Modular testing
- Feature encapsulation
- Component reusability

## Feature Mapping

### Game Mechanics to Components

| Feature | Primary Component | Supporting Components |
|---------|------------------|----------------------|
| Calendar Progression | GameContext | CalendarView, PlayerHUD |
| Path Selection | GameBoard | PathNode, PlayerToken |
| Decision Making | ScenarioCard | GameContext |
| Mini-Games | MiniGameModal | GameContext |
| Value Tracking | PlayerHUD | ValueAlignmentMeter |
| Resource Management | GameContext | PlayerHUD |

### Authentication Flow

| Step | Component | Context/Services |
|------|-----------|------------------|
| Sign In | SignInPage | AuthContext, firebase.ts |
| Profile Setup | ProfileSetupPage | AuthContext, api.ts |
| Route Protection | ProtectedRoute | AuthContext |
| Admin Access | AdminPages | AuthContext, firebase.ts |

## Development Guidelines

- Create new components in the appropriate directory based on functionality
- Maintain clear separation between game logic (Context) and presentation (Components)
- Use TypeScript interfaces for all props and state
- Follow the established naming conventions
- Update this file when adding new significant components or features 