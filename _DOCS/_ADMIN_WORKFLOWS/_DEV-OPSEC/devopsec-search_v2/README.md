# DevOpSec Search v2

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Status](https://img.shields.io/badge/status-development-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-18.x-blue)

DevOpSec Search is a platform discovery and security scanning tool that identifies organization accounts across various platforms and reports potential security issues. The application uses a React/TypeScript frontend and a TypeScript backend with Google Sheets as the database.

## 📋 Features

- **Platform Discovery**: Find accounts across multiple platforms
- **Security Scanning**: Identify potential security issues
- **Dashboard**: View metrics and scan results
- **Export/Reports**: Generate reports in multiple formats
- **Google Sheets Integration**: Use Google Sheets as a database
- **No Server Required**: Standalone application with no server dependencies

## 📊 Screenshots

Coming soon...

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Google API key with Sheets API access

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-org/devopsec-search-v2.git
   cd devopsec-search-v2
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Setup Google Sheets:
   - Create a Google Cloud project
   - Enable Google Sheets API
   - Create API key
   - Create a new Google Sheet
   - Copy the Sheet ID from the URL

4. Start the development server:
   ```
   npm run dev
   ```

5. On first run, enter your Google API key and Sheet ID in the Admin settings.

## 🏗️ Architecture

### Frontend

- React 18+ for UI components
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Recharts for data visualization

### Backend

- TypeScript for type safety
- Google Sheets API for data storage
- Zod for schema validation
- XLSX for export functionality

### Data Flow

1. User inputs scan parameters in the UI
2. Backend creates a scan record in Google Sheets
3. Backend performs platform discovery
4. Results are stored in Google Sheets
5. UI displays results and metrics

## 🧩 Project Structure

```
devopsec-search_v2/
├── src/                       # Source code
│   ├── components/            # Frontend components
│   ├── services/              # Backend services
│   │   ├── sheetsClient.ts    # Google Sheets integration
│   │   ├── scanService.ts     # Scan management
│   │   ├── platformService.ts # Platform management
│   │   ├── adminService.ts    # Admin configuration
│   │   ├── metricsService.ts  # Metrics calculations
│   │   └── exportService.ts   # Export functionality
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
└── public/                    # Public assets
```

## 🔌 API Integration

### Google Sheets

The application uses Google Sheets as a database with the following structure:

1. **Configuration Sheet**: Stores application settings
2. **Platforms Sheet**: Lists platforms and categories
3. **Scans Sheet**: Records scan information
4. **Results Sheet**: Stores scan results

## 🧪 Development

### Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run test`: Run tests

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📚 Documentation

Additional documentation:

- [Developer Notes](./_DEV/dev-notes.md)
- [File Structure](./_DEV/file-tree.md)
- [Task Log](./_DEV/task-log.md)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Google Sheets API](https://developers.google.com/sheets/api)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Made with Power, Love, and AI • ⚡️❤️�� • POWERBRIDGE.AI 