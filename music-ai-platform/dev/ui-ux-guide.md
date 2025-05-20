# 🎨 UI/UX Guide — Music AI Platform

## 🖌️ Color Palette
- **Primary Red:** #D7263D
- **Deep Black:** #181818
- **Accent Gold:** #FFD700
- **Text:** #FFFFFF (white) or #FFD700 (gold highlights)
- **Background:** #181818 (black)

## 🔤 Typography
- **Headings:** Bold, sans-serif, gold or white
- **Body:** Regular, sans-serif, white
- **Buttons:** Uppercase, bold, gold on red or black

## 🧭 Main Screens & User Flow
1. **Login / Signup**
2. **Dashboard**
3. **YouTube Import**
4. **Tagging & Categorization**
5. **AI Lyric Generation**
6. **AI Instrumental Generation**
7. **Recording Studio**
8. **Project Management**

## 🖼️ App Wireframe (Mermaid)
```mermaid
flowchart TD
    A[🔑 Login/Signup\n(Red/Gold Button)] --> B[🏠 Dashboard\n(Black/Gold)]
    B --> C[🎼 YouTube Import\n(Search, Preview, Import)]
    B --> D[🏷️ Tagging & Categorization\n(Genre, Mood, Tags)]
    B --> E[🤖 AI Lyric Generation\n(Theme, Artist, Genre)]
    B --> F[🎹 AI Instrumental Gen\n(Instrument, Mood, Genre)]
    B --> G[🎤 Recording Studio\n(Waveform, Record, Play)]
    B --> H[💾 Project Management\n(List, Edit, Share)]
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H

    style A fill:#181818,stroke:#FFD700,stroke-width:3px,color:#FFD700
    style B fill:#181818,stroke:#D7263D,stroke-width:3px,color:#FFD700
    style C fill:#181818,stroke:#FFD700,stroke-width:2px,color:#FFD700
    style D fill:#181818,stroke:#FFD700,stroke-width:2px,color:#FFD700
    style E fill:#181818,stroke:#FFD700,stroke-width:2px,color:#FFD700
    style F fill:#181818,stroke:#FFD700,stroke-width:2px,color:#FFD700
    style G fill:#181818,stroke:#D7263D,stroke-width:2px,color:#FFD700
    style H fill:#181818,stroke:#FFD700,stroke-width:2px,color:#FFD700
```

## 🪄 Component Styles
- **Navigation Sidebar:** Black, gold icons, red active highlight
- **Top Bar:** Black, gold logo, user avatar, notifications
- **Buttons:**
  - Primary: Red background, gold text
  - Secondary: Black background, gold border
- **Inputs:** Black background, gold border, white text
- **Cards/Lists:** Black with gold outline, red hover effect
- **Waveform/Audio Player:** Gold waveform on black, red playhead
- **Modals/Popups:** Black with gold border, red close button

## 🧑‍🎤 Example User Flow
1. User logs in (red/gold button)
2. Arrives at dashboard (black/gold)
3. Clicks "Import from YouTube"
4. Searches, previews, and imports an instrumental
5. Tags the track (genre, mood, custom tags)
6. Generates AI lyrics (selects theme, artist, genre)
7. Optionally generates AI instrumental
8. Records vocals over the track (waveform, record/play)
9. Saves project, exports or shares

## 🖍️ Accessibility & Responsiveness
- High contrast (red/gold on black)
- Large, bold buttons and text
- Responsive layout for desktop/tablet/mobile
- Keyboard navigation and screen reader support

## 🏷️ Branding Notes
- Consistent use of red, black, and gold
- Logo and icons in gold or white
- Modern, bold, and creative visual style
- Use music and AI motifs in iconography

---

_See [README.md](../README.md) for project overview. For dev chat and technical docs, see [dev-chat.md](../../_DOCS/dev-chat.md)._ 