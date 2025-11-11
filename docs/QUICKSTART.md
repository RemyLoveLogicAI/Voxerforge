# Quick Start Guide

## TL;DR

```bash
# 1. Clone the repository
git clone https://github.com/RemyLoveLogicAI/Voxerforge.git
cd Voxerforge

# 2. Run setup script
chmod +x setup.sh
./setup.sh

# 3. Start web app
npm run web:dev

# 4. Open browser to http://localhost:3000
```

## What You Get

- **Monaco Editor**: VS Code-quality code editor
- **Voice Control**: Click "Voice: ON" to enable voice commands
- **AI Assistant**: Mock AI for code suggestions (ready for real AI integration)
- **File Explorer**: Navigate project files
- **PWA Support**: Install as app on any device

## Voice Commands (When Enabled)

Try saying:
- "open file README.md"
- "go to line 10"
- "save file"
- "find function"
- "generate a function"

## First-Time Setup Details

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Build Core Packages

```bash
cd packages/core && npm run build
cd ../voice && npm run build
cd ../ai && npm run build
```

### 3. Start Development Server

```bash
cd apps/web
npm run dev
```

### 4. Open in Browser

Navigate to `http://localhost:3000`

## Development Tips

### Hot Reload

Changes to the web app auto-reload. For package changes:

```bash
# Terminal 1: Watch core packages
cd packages/core && npm run dev

# Terminal 2: Run web app
cd apps/web && npm run dev
```

### Voice Control

1. Click "Voice: ON" button
2. Click "Click to speak"
3. Speak a command
4. Command will be processed

### Keyboard Shortcuts

- `Ctrl/Cmd + S`: Save file
- `Ctrl/Cmd + F`: Find
- `Ctrl/Cmd + /`: Toggle comment
- All standard Monaco editor shortcuts

## Project Structure

```
apps/web/src/
├── App.tsx              # Main app component
├── components/
│   ├── Editor.tsx       # Monaco editor wrapper
│   ├── Sidebar.tsx      # File explorer
│   ├── VoiceControl.tsx # Voice UI
│   └── StatusBar.tsx    # Status bar
└── main.tsx            # App entry point

packages/
├── core/               # Type system & context
├── voice/              # Voice recognition
└── ai/                 # AI integration
```

## Next Steps

### Add Real AI

Replace the mock AI with a real provider:

```typescript
import { OpenAIAssistant } from '@voxforge/ai';

const assistant = new OpenAIAssistant({
  provider: AIProvider.OPENAI,
  model: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY
});
```

### Add File System

Implement real file operations:

```typescript
import { LocalFileSystem } from '@voxforge/fs';

const fs = new LocalFileSystem();
await fs.readFile('/path/to/file');
```

### Deploy as PWA

```bash
cd apps/web
npm run build
# Deploy dist/ folder to hosting service
```

## Troubleshooting

### Dependencies Won't Install

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild packages
npm run build
```

### Port Already in Use

Edit `apps/web/vite.config.ts` and change port:

```typescript
server: {
  port: 3001 // Change this
}
```

## Learn More

- [Full Documentation](../docs/README.md)
- [Architecture Guide](../docs/ARCHITECTURE.md)
- [Contributing](../CONTRIBUTING.md)

## Support

- [GitHub Issues](https://github.com/RemyLoveLogicAI/Voxerforge/issues)
- [GitHub Discussions](https://github.com/RemyLoveLogicAI/Voxerforge/discussions)
