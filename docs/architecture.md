# VoxForge IDE Architecture

## Overview

VoxForge IDE is a next-generation, AI-first voice-driven development environment designed for multiple platforms (Web, Desktop, Mobile, VR/AR). This document describes the system architecture and key design decisions.

## Architecture Principles

1. **Local-First**: Prioritize local AI models (via Ollama) with cloud fallback
2. **Modular Design**: Monorepo structure with independent, composable packages
3. **Safety-First**: Always show plan → diff → confirm → apply workflow
4. **Multi-Platform**: Shared core with platform-specific implementations
5. **Voice-Optional**: Full keyboard support, voice enhances workflow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Applications Layer                       │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│   Web/PWA   │   Desktop   │   Mobile    │     VR/AR        │
│  (React)    │  (Tauri)    │ (React      │   (WebXR/        │
│             │             │  Native)    │    Unity)        │
└─────────────┴─────────────┴─────────────┴──────────────────┘
                            │
┌───────────────────────────┴───────────────────────────────┐
│                    Core Services Layer                     │
├──────────────┬──────────────┬──────────────┬──────────────┤
│ Voice Engine │ AI Orch.     │ Code Ops     │ Remote       │
│              │              │              │ Bridge       │
│ - Recognition│ - Router     │ - Diff Gen.  │ - Relay      │
│ - Intent     │ - Ollama     │ - Checkpoint │ - Encryption │
│ - Commands   │ - OpenAI     │ - Executor   │ - Multi-sess │
│              │ - Anthropic  │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
                            │
┌───────────────────────────┴───────────────────────────────┐
│                  Integration Layer                         │
├──────────────┬──────────────┬──────────────┬──────────────┤
│  Terminal    │  MCP Tools   │ File System  │   Git        │
│              │              │              │              │
│ - Shell Exec │ - GitHub     │ - Watch      │ - Operations │
│ - AI CLI     │ - Docker     │ - Index      │ - Hooks      │
│              │ - Databases  │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
                            │
┌───────────────────────────┴───────────────────────────────┐
│                     Core Abstractions                      │
│                    (@voxforge/core)                        │
│                                                            │
│  - Type Definitions        - Interfaces                    │
│  - AI Actions Enum         - Model Contracts               │
│  - Configuration Schema    - Constants                     │
└────────────────────────────────────────────────────────────┘
```

## Package Structure

### Core Packages

#### @voxforge/core
Foundational types, interfaces, and constants.

**Exports:**
- Type definitions (ModelConfig, AIAction, VoiceIntent, etc.)
- Interface contracts (IAIModel, IVoiceEngine, ICodeOperations, etc.)
- Constants (DEFAULT_MODELS, VOICE_PATTERNS, AI_COMMANDS)

**No external dependencies**

#### @voxforge/ai-orchestrator
Multi-model AI routing and orchestration.

**Components:**
- `ModelRouter`: Routes actions to appropriate models based on task type
- `OllamaModel`: Local Ollama integration
- `OpenAIModel`: OpenAI API integration
- `AnthropicModel`: Anthropic Claude integration

**Key Features:**
- Automatic model selection based on action type
- Fallback strategies for unavailable models
- Streaming support for all providers

#### @voxforge/code-ops
Safe code transformation operations.

**Components:**
- `DiffGenerator`: Creates unified diffs for code changes
- `CheckpointManager`: Manages rollback checkpoints
- `CodeOperationsExecutor`: Implements plan → diff → confirm → apply workflow

**Safety Features:**
- All code changes show diff preview
- Automatic checkpoint creation
- Rollback to any previous checkpoint
- Never silently delete files

#### @voxforge/voice-engine
Voice recognition and command processing.

**Components:**
- `VoiceRecognitionEngine`: Web Speech API integration
- `IntentParser`: Converts transcripts to structured intents

**Features:**
- Wake word detection
- Push-to-talk mode
- Real-time subtitles
- Intent extraction with confidence scores

## AI Action Workflow

All AI operations follow a consistent workflow:

```
1. Voice/Text Input
   ↓
2. Intent Recognition
   - Parse command
   - Extract parameters
   - Identify action type
   ↓
3. Model Selection
   - Route based on action
   - Check availability
   - Fall back if needed
   ↓
4. Plan Generation
   - Create 2-4 step plan
   - Show to user
   ↓
5. Code Generation
   - Execute plan
   - Generate output
   ↓
6. Diff Preview (if code modification)
   - Show changes
   - Highlight additions/deletions
   ↓
7. User Confirmation
   - Approve/Reject/Modify
   ↓
8. Apply Changes
   - Create checkpoint
   - Write files
   - Update context
   ↓
9. Result
   - Success/Error feedback
   - Next action suggestions
```

## Voice Command Flow

```
User speaks → Wake word detected → Start recording
                                           ↓
                                    Transcribe audio
                                           ↓
                                    Parse intent
                                           ↓
                                 Extract parameters
                                           ↓
                                   Route to action
                                           ↓
                                  Execute workflow
                                           ↓
                              Provide audio/visual feedback
```

## Model Router Strategy

The Model Router selects models based on:

1. **Action Type:**
   - EXPLAIN → Fast, general model
   - REFACTOR/TRANSLATE → Deep code model
   - TESTS → Specialized test generation model
   - FIX/DOCS/REVIEW → Fast draft model

2. **Availability:**
   - Check if model is running (Ollama)
   - Check API credentials (Cloud providers)
   - Fall back to alternative if unavailable

3. **Cost/Latency Trade-offs:**
   - Local models: Zero cost, lower latency, privacy
   - Cloud models: Higher cost, variable latency, more capable

## Terminal Integration

### AI-Aware Commands

The integrated terminal provides AI-enhanced commands:

- `ai explain <command>` - Explain what a command does
- `ai fix` - Analyze last error and suggest fix
- `ai commit` - Generate commit message from git diff
- `ai doc` - Generate/update documentation
- `ai suggest` - Suggest next command based on context

### MCP Integration

Model Context Protocol (MCP) servers provide tool access:

- **GitHub**: Issues, PRs, code search
- **Docker**: Container management
- **Filesystem**: File operations
- **Databases**: Query execution
- **Browser**: Web automation

## Remote Bridge Architecture

The Remote Bridge enables control from mobile/web clients:

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Desktop    │◄──WSS──►│ Relay Server │◄──WSS──►│  Mobile App  │
│   (Host)     │         │  (Optional)  │         │   (Client)   │
└──────────────┘         └──────────────┘         └──────────────┘
       │                                                   │
       │ Encrypt with session key                         │
       │◄─────────────────────────────────────────────────┤
       │                                                   │
       │ Send events (status, logs, approvals)            │
       ├──────────────────────────────────────────────────►│
       │                                                   │
       │ Receive commands (execute, approve, deny)        │
       │◄──────────────────────────────────────────────────┤
```

**Features:**
- End-to-end encryption
- Push notifications for approvals
- Multi-session support
- Offline queue for commands

## Security Considerations

1. **Local Model Privacy**: Code never leaves the machine when using Ollama
2. **API Key Management**: Environment variables, never in config files
3. **Checkpoint Encryption**: Optional encryption for rollback data
4. **Remote Bridge**: TLS + session encryption for remote connections
5. **Confirmation Required**: Safety rail for destructive operations

## Performance Optimizations

1. **Streaming Responses**: All models support streaming for faster perceived response
2. **Incremental Diffs**: Only compute diffs for changed regions
3. **Checkpoint Pruning**: Automatic cleanup of old checkpoints
4. **Model Caching**: Reuse model instances across requests
5. **Intent Caching**: Cache common command patterns

## Platform-Specific Implementations

### Web/PWA
- Service Worker for offline support
- IndexedDB for local storage
- Web Speech API for voice
- WebRTC for remote bridge

### Desktop (Tauri)
- Native file system access
- System shell integration
- Native notifications
- Better performance for large projects

### Mobile
- Native voice recognition
- Background sync
- Push notifications
- Simplified UI for small screens

### VR/AR (WebXR)
- Spatial UI panels
- Hand tracking for input
- Voice-first interactions
- 3D code visualization

## Future Enhancements

1. **Multi-Agent Collaboration**: Multiple AI agents working together
2. **Custom Model Training**: Fine-tune models on your codebase
3. **Advanced Diff Visualization**: Side-by-side, 3D visualization
4. **Team Collaboration**: Shared sessions, pair programming
5. **Plugin System**: Third-party extensions and integrations
6. **Language Server Integration**: Better code intelligence
7. **Continuous Learning**: Models improve from your patterns
