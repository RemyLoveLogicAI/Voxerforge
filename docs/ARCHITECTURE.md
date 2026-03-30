# VoxForge IDE Architecture

## Overview

VoxForge IDE is built as a monorepo containing shared packages and platform-specific applications. This architecture enables code reuse while maintaining platform-specific optimizations.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VoxForge IDE Platforms                    │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│   Web    │ Desktop  │  Mobile  │   VR/AR  │  Remote Client  │
│  (PWA)   │ (Tauri)  │  (RN)    │ (WebXR)  │                 │
└────┬─────┴────┬─────┴────┬─────┴────┬─────┴────┬────────────┘
     │          │          │          │          │
     └──────────┴──────────┴──────────┴──────────┘
                         │
            ┌────────────┴────────────┐
            │   Shared Packages       │
            ├─────────────────────────┤
            │  - Core (Types/Logic)   │
            │  - Voice Recognition    │
            │  - AI Integration       │
            │  - Editor Components    │
            │  - File System          │
            │  - UI Components        │
            └─────────────────────────┘
```

## Core Packages

### @voxforge/core

**Purpose**: Fundamental types, interfaces, and logic shared across all platforms

**Key Components**:
- `VoxForgeContext`: Central state management
- Type definitions (Platform, IDEMode, FileType, etc.)
- Event system for cross-component communication
- Configuration management

**Dependencies**: 
- eventemitter3 (event handling)
- zod (runtime validation)

### @voxforge/voice

**Purpose**: Voice recognition and command processing

**Key Components**:
- `VoiceRecognition`: Abstract base class for voice recognition
- `WebSpeechRecognition`: Web Speech API implementation
- `VoiceCommandProcessor`: Convert transcripts to structured commands
- Voice command patterns and parsing

**Platform Support**:
- Web: Web Speech API
- Desktop: Native speech APIs via Tauri
- Mobile: Native speech recognition
- VR/AR: WebXR speech input

### @voxforge/ai

**Purpose**: AI integration for code assistance

**Key Components**:
- `AIAssistant`: Abstract base for AI providers
- `MockAIAssistant`: Development/testing implementation
- `AIRequestManager`: Queue and process AI requests
- Code context extraction and formatting

**Future Integrations**:
- OpenAI API
- Anthropic Claude
- Local LLM support (Ollama, LM Studio)
- Custom model endpoints

### @voxforge/editor

**Purpose**: Code editor components and utilities

**Planned Components**:
- Monaco Editor wrapper
- Syntax highlighting
- Code formatting
- Language servers
- Auto-completion

### @voxforge/fs

**Purpose**: File system abstraction for multi-platform support

**Planned Components**:
- Virtual file system
- Local storage (IndexedDB for web)
- Native file system (Tauri for desktop)
- Cloud sync adapters
- Git integration

### @voxforge/ui

**Purpose**: Shared UI components

**Planned Components**:
- Design system
- Reusable components
- Theming system
- Accessibility utilities

## Application Architecture

### Web (PWA)

**Tech Stack**:
- React 18
- Vite (build tool)
- PWA plugin (offline support)
- Monaco Editor
- Web Speech API

**Features**:
- Works in browser
- Installable as PWA
- Offline support
- Service worker caching
- IndexedDB storage

**Entry Point**: `apps/web/src/main.tsx`

### Desktop (Tauri)

**Tech Stack**:
- Tauri (Rust backend)
- React frontend
- Native file system APIs
- System integration

**Features**:
- Native performance
- Full file system access
- Menu bar integration
- System notifications
- Auto-updates

**Structure**:
- Frontend: Shared with web app
- Backend: Rust (Tauri commands)

### Mobile (React Native)

**Tech Stack**:
- React Native
- Native modules
- WebSocket (remote mode)

**Modes**:
1. **Standalone**: Local editing on device
2. **Remote Client**: Control desktop IDE (Happy Coder style)

**Features**:
- Touch-optimized UI
- Voice commands
- Remote desktop control
- Real-time sync
- Code review

### VR/AR (WebXR)

**Tech Stack**:
- WebXR API
- Three.js
- React Three Fiber
- Monaco in 3D space

**Features**:
- Immersive 3D workspace
- Spatial code panels
- Voice-first interaction
- Hand tracking
- Collaborative spaces

## Data Flow

```
User Input (Voice/Keyboard/Touch)
          ↓
   VoxForgeContext (Event Bus)
          ↓
    ┌────┴────┬────────┬──────────┐
    ↓         ↓        ↓          ↓
  Voice      AI     Editor    File System
   ↓         ↓        ↓          ↓
  Command   Request  Update    Operation
   ↓         ↓        ↓          ↓
    └────┬───┴────────┴──────────┘
          ↓
    Update UI/State
```

## Communication Patterns

### Event-Driven Architecture

All components communicate through the `VoxForgeContext` event bus:

```typescript
// Emit events
context.emit('file:open', '/src/main.ts');
context.emit('voice:command', command);
context.emit('ai:request', request);

// Listen to events
context.on('file:open', (path) => {
  // Handle file open
});
```

### State Management

- **Local State**: React hooks (useState, useReducer)
- **Global State**: VoxForgeContext
- **Persistent State**: localStorage/IndexedDB/native storage

## Voice Processing Pipeline

```
Speech Input
    ↓
Web Speech API / Native API
    ↓
Transcript + Confidence
    ↓
VoiceCommandProcessor
    ↓
Structured VoiceCommand
    ↓
Command Handler
    ↓
Action Execution (Open file, Generate code, etc.)
```

## AI Processing Pipeline

```
User Request (Voice/Text)
    ↓
Extract Code Context
    ↓
Format AI Request
    ↓
AIRequestManager Queue
    ↓
AI Provider (OpenAI/Local/etc.)
    ↓
AI Response
    ↓
Format & Display Result
```

## Security Considerations

1. **API Keys**: Never store in code, use environment variables
2. **Local-First**: User data stays on device by default
3. **Cloud Sync**: Optional, encrypted, user-controlled
4. **Permissions**: Request only needed permissions
5. **Sandboxing**: Isolate untrusted code execution

## Performance Optimizations

1. **Code Splitting**: Load platform-specific code on demand
2. **Lazy Loading**: Monaco and heavy components load async
3. **Virtual Scrolling**: Handle large file lists efficiently
4. **Web Workers**: Offload heavy processing
5. **Caching**: Service workers, CDN, local storage

## Extensibility

### Plugin System (Future)

```typescript
interface VoxForgePlugin {
  name: string;
  version: string;
  activate(context: VoxForgeContext): void;
  deactivate(): void;
}
```

### Custom Voice Commands

```typescript
processor.addPattern('custom', /^my command (.+)$/i);
```

### Custom AI Providers

```typescript
class CustomAIAssistant extends AIAssistant {
  async generateCompletion(context, prompt) {
    // Custom implementation
  }
}
```

## Deployment

### Web (PWA)
- Static hosting (Vercel, Netlify, Cloudflare Pages)
- CDN for assets
- Service worker for offline

### Desktop
- Platform-specific installers (.exe, .dmg, .deb, .AppImage)
- Auto-update via Tauri
- Code signing for distribution

### Mobile
- App stores (iOS App Store, Google Play)
- TestFlight/Beta for testing
- Over-the-air updates

### VR/AR
- Web hosting for WebXR
- Native builds for Quest standalone
- SideQuest for development

## Development Workflow

```bash
# Install dependencies
npm install

# Run all platforms in dev mode
npm run dev

# Run specific platform
npm run web:dev
npm run desktop:dev
npm run mobile:dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## Future Enhancements

1. **Real-time Collaboration**: Multiple users in same workspace
2. **Advanced AI**: Fine-tuned models for specific languages
3. **Cloud Workspaces**: Full cloud-based development
4. **Terminal Integration**: Embedded terminal with AI assistance
5. **Debugger**: Visual debugging with voice control
6. **Git GUI**: Visual git operations with voice commands
7. **Extensions Marketplace**: Community plugins
8. **Themes**: Customizable appearance
9. **Analytics**: Usage insights and optimization
10. **Accessibility**: Screen reader support, voice-only mode

## Technology Choices Rationale

- **Monorepo (Turbo)**: Share code, maintain consistency, faster builds
- **TypeScript**: Type safety, better tooling, catch errors early
- **React**: Large ecosystem, component reuse, proven for IDEs
- **Monaco**: Industry-standard editor (VS Code engine)
- **Tauri**: Smaller binaries than Electron, better performance
- **WebXR**: Cross-platform VR/AR without native apps
- **Web Speech API**: Native browser support, no additional dependencies
