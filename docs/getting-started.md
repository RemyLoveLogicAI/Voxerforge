# Getting Started with VoxForge IDE

Welcome to VoxForge IDE! This guide will help you get up and running with the voice-driven AI development environment.

## Prerequisites

### Required
- **Node.js** 18+ and npm 9+
- A modern web browser (Chrome, Edge, Safari, Firefox)

### Optional (for full functionality)
- **Ollama** for local AI models - [Install Ollama](https://ollama.ai)
- **Git** for version control
- **API Keys** for cloud AI providers (OpenAI, Anthropic, etc.)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/RemyLoveLogicAI/Voxerforge.git
cd Voxerforge
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies for all packages in the monorepo.

### 3. Set Up Ollama (Recommended for Local-First)

If you want to use local AI models:

```bash
# Install Ollama from https://ollama.ai

# Pull recommended models
ollama pull llama3.1
ollama pull qwen2.5-coder
ollama pull codellama:7b
```

### 4. Configure VoxForge

Create a configuration file:

```bash
cp config/example.yaml ~/.voxforge/config.yaml
```

Edit the configuration to match your setup. See [Configuration Guide](./configuration.md) for details.

### 5. Build All Packages

```bash
npm run build
```

## Running VoxForge

### Web Application

Start the web development server:

```bash
cd apps/web
npm run dev
```

Open http://localhost:3000 in your browser.

### Desktop Application (Coming Soon)

The Tauri-based desktop app provides better performance and native features:

```bash
cd apps/desktop
npm run dev
```

## First Steps

### 1. Enable Voice Input

Click the "Start Voice" button in the top-right corner. Your browser will ask for microphone permission - grant it to enable voice commands.

### 2. Try Basic Commands

Say any of these commands:
- "Hey Vox, explain this function"
- "Refactor this code"
- "Generate tests for this"
- "Document this function"
- "Translate this to Python"

### 3. Use the Terminal

The integrated terminal supports AI-enhanced commands:

```bash
# Get help for a command
ai explain git rebase

# Analyze and fix last error
ai fix

# Generate commit message
ai commit

# Generate documentation
ai doc
```

### 4. Configure Models

Edit your config to use different AI models:

```yaml
models:
  profiles:
    - name: default
      fastDraft:
        provider: ollama
        modelId: llama3.1
      deepRefactor:
        provider: ollama
        modelId: qwen2.5-coder
```

## Key Features

### Voice Commands

VoxForge understands natural language commands:

- **Explain**: "Explain this function"
- **Refactor**: "Refactor this code to use async/await"
- **Fix**: "Fix this error"
- **Generate Tests**: "Generate unit tests for this"
- **Document**: "Add JSDoc comments"
- **Translate**: "Translate this to TypeScript"

### AI Actions

All AI operations follow a safe workflow:

1. **Plan** - AI creates a plan of what it will do
2. **Diff** - Shows exactly what will change
3. **Confirm** - You approve or reject
4. **Apply** - Changes are made with automatic backup

### Rollback

If something goes wrong, you can always roll back:

```bash
# In terminal
vox rollback
```

Or use the UI to select a previous checkpoint.

## Tips for Best Results

1. **Be Specific**: "Refactor the getUserData function to use async/await" works better than "refactor this"

2. **Use Context**: Open the file you want to work on before giving commands

3. **Chain Commands**: You can give multiple commands in sequence:
   - "Explain this function"
   - "Now refactor it to be more efficient"
   - "Generate tests for it"

4. **Review Changes**: Always review the diff before applying changes

5. **Use Local Models**: Local Ollama models are free, private, and fast for most tasks

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Open command palette
- `Ctrl/Cmd + Shift + V` - Toggle voice input
- `Ctrl/Cmd + Shift + T` - Toggle terminal
- `Ctrl/Cmd + Z` - Undo (with checkpoint rollback)

## Troubleshooting

### Voice Recognition Not Working

1. Check browser permissions for microphone
2. Ensure you're using a supported browser (Chrome, Edge recommended)
3. Try push-to-talk mode in settings

### Ollama Connection Failed

1. Ensure Ollama is running: `ollama serve`
2. Check if models are installed: `ollama list`
3. Verify baseUrl in config (default: http://localhost:11434)

### AI Commands Slow

1. Check your internet connection (for cloud models)
2. Switch to faster models in config
3. Use streaming mode for faster perceived responses

## Next Steps

- Read the [Architecture Guide](./architecture.md) to understand how it works
- Explore [Configuration Options](./configuration.md) for customization
- Check out [Voice Commands Reference](./voice-commands.md) for all commands
- Join the community to share feedback and get help

## Getting Help

- GitHub Issues: Report bugs or request features
- Discussions: Ask questions and share ideas
- Discord: Join our community (coming soon)

Happy coding with your voice! 🎤
