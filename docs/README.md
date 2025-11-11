# VoxForge IDE Documentation

Welcome to the VoxForge IDE documentation. This guide will help you get started with voice-driven development.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Voice Commands](#voice-commands)
3. [AI Features](#ai-features)
4. [Platform Guides](#platform-guides)
5. [Architecture](#architecture)
6. [Contributing](#contributing)

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/RemyLoveLogicAI/Voxerforge.git
cd Voxerforge

# Install dependencies
npm install

# Start development server
npm run dev
```

### First Steps

1. **Enable Voice Control**: Click the microphone button in the header
2. **Start Speaking**: Click "Click to speak" and begin with voice commands
3. **Open a File**: Say "open file README.md"
4. **Edit Code**: Use voice commands or type normally

## Voice Commands

### File Operations

- `"open file [filename]"` - Open a file
- `"save file"` - Save current file
- `"close file"` - Close current file
- `"new file [filename]"` - Create a new file
- `"new folder [name]"` - Create a new folder

### Editor Commands

- `"go to line [number]"` - Jump to specific line
- `"find [text]"` - Search in current file
- `"replace [old] with [new]"` - Find and replace
- `"undo"` - Undo last change
- `"redo"` - Redo last undone change

### Code Generation

- `"insert [description]"` - Generate code from description
- `"generate [component type]"` - Create code structure
- `"refactor [description]"` - AI-assisted refactoring

### Navigation

- `"next file"` - Switch to next tab
- `"previous file"` - Switch to previous tab

## AI Features

### Code Completion

The AI assistant provides context-aware code suggestions as you type or speak.

### Code Explanation

Select code and ask: `"explain this code"`

### Debugging

When you encounter an error, the AI can help:
- `"debug this error"`
- `"fix [error message]"`

### Refactoring

Request AI-powered refactoring suggestions:
- `"suggest refactoring"`
- `"improve this function"`

## Platform Guides

### Web (PWA)

The web version works in any modern browser and can be installed as a Progressive Web App:

1. Visit VoxForge IDE in Chrome/Edge/Safari
2. Click "Install" when prompted
3. Access offline and get app-like experience

### Desktop (Tauri)

Native desktop app with full file system access:

```bash
npm run desktop:dev
```

Features:
- Direct file system access
- Native menu integration
- System notifications
- Better performance

### Mobile (iOS/Android)

Remote client mode for controlling desktop IDE:

```bash
npm run mobile:dev
```

Features:
- View and edit files
- Execute voice commands
- Monitor builds
- Review changes

### VR/AR (WebXR)

Immersive coding environment:

```bash
cd apps/vr
npm run dev
```

Features:
- 3D code visualization
- Spatial workspace
- Hand tracking
- Voice-first interface

## Architecture

### Monorepo Structure

```
voxforge-ide/
├── packages/          # Shared packages
│   ├── core/         # Core types and logic
│   ├── voice/        # Voice recognition
│   ├── ai/           # AI integration
│   ├── editor/       # Editor components
│   ├── fs/           # File system
│   └── ui/           # Shared UI
└── apps/             # Platform applications
    ├── web/          # Web/PWA
    ├── desktop/      # Tauri desktop
    ├── mobile/       # React Native
    └── vr/           # WebXR
```

### Technology Stack

- **TypeScript**: Type-safe development
- **React**: UI framework
- **Turbo**: Monorepo build system
- **Monaco Editor**: Code editing
- **Web Speech API**: Voice recognition
- **Tauri**: Desktop apps
- **WebXR**: VR/AR support

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Write meaningful commit messages
- Add documentation for new features

## Support

- **Issues**: [GitHub Issues](https://github.com/RemyLoveLogicAI/Voxerforge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/RemyLoveLogicAI/Voxerforge/discussions)

## License

MIT License - see [LICENSE](../LICENSE) for details
