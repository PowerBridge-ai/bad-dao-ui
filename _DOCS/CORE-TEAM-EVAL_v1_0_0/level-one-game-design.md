# 🎲 Core Team Evaluation System - Level One: Team Theory

## 📋 Overview

Level One of the Core Team Evaluation System, titled "Team Theory," is a Mario Party-inspired interactive game board experience designed to assess team dynamics through collaborative decision-making and mini-game challenges. This document outlines the gameplay mechanics, UI elements, and assessment metrics for this foundational level.

## 🎮 Game Mechanics

### 🏁 Starting the Game

1. **Game Board Introduction**
   - Players are presented with a 3D game board representing the "Team Theory" landscape
   - The board features branching paths with themed zones representing different organizational values
   - Interactive tooltips explain game objectives and mechanics
   - Difficulty selection determines organizational starting resources:
     - Easy: Organization starts with substantial resources (10,000 points)
     - Medium: Organization starts with moderate resources (5,000 points)
     - Hard: Organization starts with minimal resources (2,000 points)
     - Expert: Organization starts with zero resources (0 points)

2. **Player Initialization**
   - Each player receives equal individual resources (1,000 points)
   - Players create/select avatars that represent them on the board
   - Team roles are displayed next to player names
   - Calendar sets a clear deadline for project completion
   - Turn order follows team hierarchy or predefined sequence

### 📅 Daily Progression System

1. **Calendar Interface**
   - Main progression mechanic is a visual calendar showing project timeline
   - Each turn represents one business day in the project lifecycle
   - Calendar displays:
     - Current day indicator
     - Past days (completed turns) with summary indicators
     - Future days with preview indicators
     - Project deadline with countdown
     - Key milestones throughout the timeline
   - Progress bar shows completion percentage toward final goal

2. **Next Day Mechanism**
   - Players progress by activating the "Next Day" button at the end of their turn
   - Morning briefing animation shows day's challenges and opportunities
   - Daily special events may trigger based on the calendar position
   - No random elements in progression - each day brings predetermined but unknown challenges
   - Calendar highlights weekends and special dates with unique events

3. **Path Selection & Movement**
   - Player advances their avatar along the board for each new day
   - At branch points, player must choose which path to take
   - Paths are color-coded to represent different value priorities:
     - Innovation Path (Purple)
     - Integrity Path (Blue)
     - Collaboration Path (Green)
     - Excellence Path (Gold)
     - User-Focus Path (Orange)
   - Each path has different risk/reward profiles clearly indicated
   - Choosing paths represents daily work prioritization decisions

4. **Decision Points**
   - Each new day presents scenario cards that represent workplace situations
   - Scenario displays a situation relevant to organizational values
   - Player must make an A/B/C multiple-choice decision
   - Decision is displayed to all players for transparency
   - Choice reflects player's alignment with specific organizational values
   - Timer (30 seconds) adds pressure to decision-making
   - Points awarded based on decision quality and alignment with team values

5. **Decision Impact Visualization**
   - After each decision, an animated visualization shows:
     - Impact on individual resources
     - Impact on team alignment
     - Impact on organizational resources
     - Calendar consequences (some decisions may add or remove days from timeline)
   - Visual feedback reinforces consequences of choices

### 🎯 Mini-Games ("Side Quests")

1. **Mini-Game Trigger**
   - At the end of each day (turn), player triggers a team mini-game
   - Mini-game type is influenced by the player's path and decisions
   - Dramatic "Team Challenge" announcement with animation and sound
   - All team members participate simultaneously
   - Calendar shows mini-game as "end of day meeting" or "team workshop"

2. **Mini-Game Types**
   - **Value Priority Game**: Team members rank organizational values, points awarded for alignment
   - **Resource Allocation Challenge**: Team collectively decides how to allocate limited resources
   - **Crisis Response Scenario**: Timed challenge requiring coordinated team response
   - **Innovation Brainstorm**: Creative challenge with peer voting mechanics
   - **Communication Relay**: Information must be accurately passed between team members

3. **Mini-Game Outcome**
   - Success in mini-games awards resources to the entire team
   - No resources are lost through mini-games (only gained)
   - Performance metrics are tracked and displayed
   - Team celebration animations for successful outcomes
   - Calendar tracks mini-game performance over time with special indicators

### 🏆 Progress Tracking

1. **Individual Metrics**
   - Personal resource counter (prominently displayed)
   - Value alignment profile (radar chart)
   - Decision history log
   - Mini-game contribution score
   - Personal productivity trend shown on calendar

2. **Team Metrics**
   - Team resource pool (shared counter)
   - Collective value alignment visualization
   - Team synergy score (calculated from collaborative decisions)
   - Progress bar toward project deadline completion
   - Team momentum displayed as calendar-based trend line

3. **Project Timeline Structure**
   - Project consists of a predefined number of days (e.g., 30-day project)
   - Week completion triggers team reflection moment
   - Intermediate results and insights provided at end of each week
   - Final assessment conducted at project deadline
   - Calendar shows upcoming challenges and opportunities

## 💻 UI Design Elements

### 📅 Calendar Interface

#### Visual Style
- Professional calendar design with interactive elements
- Color-coded days showing different focus areas or challenges
- Progress indicators showing completed vs. remaining days
- Milestone markers throughout the timeline
- Deadline visualization with countdown

#### Calendar Components
- **Today Indicator**: Highlights current day/turn
- **Progress Tracker**: Shows completion percentage
- **Milestone Flags**: Key points in the project timeline
- **Weekend Separators**: Visual breaks in the calendar
- **Daily Icons**: Visual indicators of day's focus area
- **Team Position Markers**: Shows each player's current day if different
- **Deadline Marker**: Clear visual endpoint with countdown

#### Interaction Elements
- **Day Preview**: Hover over future days for hints
- **Day Summary**: Click on past days to view decisions made
- **Next Day Button**: Primary interaction for turn progression
- **Week View Toggle**: Switch between day/week visualization
- **Timeline Zoom**: Adjust view of project timeline

### 🗺️ Game Board Design

#### Visual Style
- 3D isometric view with modern low-poly aesthetic
- Corporate campus theme with distinct value-themed zones
- Interactive elements highlighted with subtle glow effects
- Animated transitions between board areas
- Dynamic lighting that responds to game state
- Calendar integration showing physical progress across a metaphorical landscape

#### Board Components
- **Central Hub**: Starting area representing project kickoff
- **Value Zones**: Themed areas representing organizational values
- **Decision Spaces**: Interactive tiles where scenarios appear
- **Mini-Game Arenas**: Specialized areas that transform for mini-games
- **Progress Path**: Visualization of calendar days as physical spaces
- **Completion Gateway**: Final destination representing project completion

### 👤 Player Interface

#### Player Dashboard
- **Avatar Display**: Player representation with customization options
- **Resource Counter**: Individual points/resources visualization
- **Current Day Indicator**: Shows which day the player is on
- **Value Alignment Meter**: Five bars showing alignment with core values
- **Decision History**: Collapsible log of previous choices
- **Action Buttons**: Context-sensitive options for current state
- **Calendar View**: Personal calendar highlighting player's path

#### Decision Interface
- **Scenario Card**: Centered modal with situation description
- **Choice Options**: A/B/C buttons with hover previews
- **Timer**: Visual countdown for decision pressure
- **Impact Preview**: Ghosted visualization of potential outcomes
- **Team Visibility**: Indicator showing team is witnessing decision
- **Calendar Impact**: Shows how decision affects timeline

### 🎯 Mini-Game Interface

#### Common Elements
- **Instruction Panel**: Clear directives on mini-game rules
- **Timer**: Visual countdown appropriate to challenge
- **Team Member Indicators**: Shows all participants and their status
- **Progress Tracker**: Visual feedback on mini-game state
- **Results Panel**: Comprehensive outcome display post-game
- **Calendar Position**: Shows this activity in project timeline

#### Game-Specific Elements
- **Value Priority Game**: Drag-and-drop ranking interface
- **Resource Allocation**: Interactive pie chart distribution tool
- **Crisis Response**: Action button grid with state visualization
- **Innovation Brainstorm**: Idea submission and voting interface
- **Communication Relay**: Message composition and verification tools

### 📊 Progress Visualization

#### Real-time Feedback
- **Decision Impact**: Animated resource flow visualizations
- **Path Progress**: Board lighting highlighting completed sections
- **Value Alignment**: Dynamically updating radar charts
- **Team Synergy**: Particle effects connecting player avatars
- **Achievement Unlocks**: Pop-up notifications for milestones
- **Calendar Progress**: Visual filling or stamping of completed days

#### Project Summary
- **Performance Dashboard**: End-of-week metrics display
- **Comparison View**: Current vs. previous week performance
- **Insight Cards**: AI-generated observations about team dynamics
- **Strategy Suggestions**: Hints for improved collaboration
- **Calendar Forecast**: Preview of upcoming challenges based on current trajectory

## 🧩 Assessment Integration

### 📊 Measured Metrics

1. **Individual Assessment**
   - Decision alignment with stated organizational values
   - Consistency of decision patterns
   - Risk tolerance profile
   - Resource management tendencies
   - Contribution to team mini-games
   - Adaptability to daily changing challenges

2. **Team Dynamics Assessment**
   - Value alignment variance across team
   - Collaborative performance in mini-games
   - Communication patterns during decision-making
   - Resource sharing behaviors
   - Conflict resolution approaches
   - Long-term planning vs. daily execution balance

### 🔄 Real-time Analysis

- Decision patterns analyzed against organizational benchmarks
- Mini-game performance compared to established baselines
- Team interaction data captured during collaborative challenges
- Communication frequency and quality metrics tracked
- Individual vs. collective priority patterns identified
- Timeline management effectiveness measured

### 📈 Reporting Output

- Comprehensive value alignment profiles for individuals and team
- Identified strengths and growth opportunities
- Team composition optimization recommendations
- Role alignment suggestions based on natural tendencies
- Specific development activities based on performance
- Project timeline management effectiveness assessment

## 🎨 Visual Reference

The game board takes inspiration from Mario Party's colorful, engaging design while maintaining a professional aesthetic appropriate for organizational assessment:

- **Main Board**: 3D isometric corporate campus with branching paths that follow calendar progression
- **Player Tokens**: Professional avatar representations with role indicators
- **Decision Cards**: Professional scenarios presented in engaging card format
- **Mini-Games**: Simplified interfaces focused on assessment mechanics
- **Progress Tracking**: Modern dashboard with metrics visualization
- **Calendar Interface**: Interactive project timeline with visual progress indicators

## ⚙️ Technical Implementation Notes

### Core Components

1. **Calendar System**
   - Data structure for project timeline
   - Event triggering based on calendar position
   - Visualization system for temporal progress
   - Tracking system for decisions and outcomes by date
   - Forecasting algorithm for project completion

2. **Board Renderer**
   - Three.js scene with optimized assets
   - Camera controls for zooming and rotating
   - Path highlighting system
   - Player token animation system
   - Calendar-to-board position mapping

3. **Turn Manager**
   - State machine tracking game progression
   - Event system for daily transitions
   - Timer management for timed elements
   - Decision recording and analysis
   - Calendar progression mechanics

4. **Mini-Game Framework**
   - Modular system for loading different game types
   - Shared UI components across games
   - Multiplayer synchronization
   - Performance metrics collection
   - Calendar integration for scheduling and recording

### Performance Considerations

- Asset preloading for smooth transitions
- Level of detail management for complex board
- Efficient state management to prevent UI lag
- Optimized rendering for various device capabilities
- Graceful degradation for less powerful hardware
- Efficient calendar data structure for large projects

## 🔄 Integration with Assessment Framework

This level focuses primarily on the "Value Alignment" dimension of the Core Team Evaluation System, while incorporating elements that provide baseline data for other assessment dimensions:

1. **Primary Focus: Value Alignment**
   - Understanding of organizational values
   - Consistency in value-based decision making
   - Alignment between individual and team values
   - Value prioritization patterns
   - Daily commitment to core values despite changing circumstances

2. **Secondary Data Collection**
   - Communication patterns (for Level 4: Team Dynamics)
   - Decision-making approaches (for Level 3: Decision Making)
   - Role preferences (for Level 2: Role Optimization)
   - Project timeline management (for executive assessment)

## 📝 Design Considerations

1. **Engagement Balance**
   - Game elements should be engaging without distracting from assessment
   - Competitive elements balanced with collaborative incentives
   - Difficulty progressive but accessible to non-gamers
   - Interface intuitive for users of varying technical comfort
   - Calendar provides clear structure while maintaining engagement

2. **Assessment Validity**
   - Game mechanics designed to reveal authentic behaviors
   - Decision scenarios validated for psychological insight
   - Metrics collection unobtrusive but comprehensive
   - Balanced between structured assessment and emergent behavior observation
   - Calendar progression creates realistic workplace pressure

3. **Accessibility & Inclusivity**
   - Color-blind friendly design with multiple visual cues
   - Simple controls accessible to users with varying abilities
   - Clear instructions and tooltips throughout experience
   - Culturally neutral scenarios and examples
   - Calendar visualization accommodates different cognitive approaches

## 🚀 Future Enhancements

1. **Adaptive Calendar**
   - Dynamic adjustment of project timeline based on team performance
   - Personalized daily challenges based on individual profiles
   - Scenario selection based on team development needs
   - Integration with real work calendars for authentic experience

2. **Extended Mini-Game Library**
   - Additional game types for diverse skill assessment
   - Industry-specific scenario packs
   - Custom mini-game creation tools for organizations
   - Day-specific challenges tied to calendar position

3. **Multiplayer Improvements**
   - Remote participation capabilities
   - Asynchronous daily progression options
   - Observer mode for coaches/facilitators
   - Calendar synchronization for distributed teams 