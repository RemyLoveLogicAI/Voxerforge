# VoxForge IDE Configuration

VoxForge uses a flexible YAML/JSON configuration system to customize your development environment.

## Configuration Files

Configuration can be provided at multiple levels:

1. **Global config**: `~/.voxforge/config.yaml` or `~/.voxforge/config.json`
2. **Project config**: `.voxforge/config.yaml` or `.voxforge/config.json` in project root
3. **Environment variables**: Prefix with `VOXFORGE_` (e.g., `VOXFORGE_VOICE_ENABLED=true`)

Project configuration takes precedence over global configuration.

## Configuration Schema

### Models

Configure AI models and routing profiles:

```yaml
models:
  profiles:
    - name: default
      description: Balanced profile using local models
      fastDraft:
        provider: ollama
        modelId: llama3.1
        temperature: 0.7
        maxTokens: 2048
      deepRefactor:
        provider: ollama
        modelId: qwen2.5-coder
        temperature: 0.3
        maxTokens: 4096
      testGenerator:
        provider: ollama
        modelId: codellama:7b
        temperature: 0.3
        maxTokens: 4096
      explainer:
        provider: ollama
        modelId: llama3.1
        temperature: 0.7
        maxTokens: 2048
    
    - name: cloud
      description: Cloud-based models for maximum performance
      fastDraft:
        provider: openai
        modelId: gpt-4-turbo-preview
        apiKey: ${OPENAI_API_KEY}
      deepRefactor:
        provider: anthropic
        modelId: claude-3-opus-20240229
        apiKey: ${ANTHROPIC_API_KEY}
  
  defaultProfile: default
```

### Voice Configuration

Configure voice input and recognition:

```yaml
voice:
  enabled: true
  wakeWord: "hey vox"  # Optional wake word activation
  pushToTalk: false    # Set to true for push-to-talk mode
  language: en-US
  subtitles: true      # Show real-time transcription
```

### Terminal Configuration

Configure integrated terminal behavior:

```yaml
terminal:
  defaultShell: bash   # bash, zsh, or pwsh
  aiCommands: true     # Enable AI-aware terminal commands
```

### MCP Integration

Configure Model Context Protocol servers:

```yaml
mcp:
  servers:
    - name: github
      command: npx
      args: ["-y", "@modelcontextprotocol/server-github"]
      env:
        GITHUB_TOKEN: ${GITHUB_TOKEN}
    
    - name: filesystem
      command: npx
      args: ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"]
    
    - name: docker
      command: docker-mcp
      env:
        DOCKER_HOST: unix:///var/run/docker.sock
```

### Remote Bridge

Configure remote client access:

```yaml
remote:
  enabled: true
  relayUrl: wss://relay.voxforge.dev  # Optional custom relay
  encryption: true
```

### Safety Settings

Configure safety rails and rollback:

```yaml
safety:
  requireConfirmation: true  # Require user confirmation before applying changes
  autoBackup: true           # Automatically create checkpoints
  maxRollbackDepth: 50       # Maximum number of checkpoints to keep
```

## Example Configurations

### Local-First Development

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
  defaultProfile: default

voice:
  enabled: true
  pushToTalk: true
  language: en-US

safety:
  requireConfirmation: true
  autoBackup: true
```

### Cloud-Powered Setup

```yaml
models:
  profiles:
    - name: cloud
      fastDraft:
        provider: openai
        modelId: gpt-4-turbo-preview
        apiKey: ${OPENAI_API_KEY}
      deepRefactor:
        provider: anthropic
        modelId: claude-3-opus-20240229
        apiKey: ${ANTHROPIC_API_KEY}
  defaultProfile: cloud

voice:
  enabled: true
  wakeWord: "hey vox"
  language: en-US

remote:
  enabled: true
  encryption: true
```

### Hybrid Setup

Use local models for quick tasks, cloud for complex operations:

```yaml
models:
  profiles:
    - name: hybrid
      fastDraft:
        provider: ollama
        modelId: llama3.1
      deepRefactor:
        provider: anthropic
        modelId: claude-3-opus-20240229
        apiKey: ${ANTHROPIC_API_KEY}
      testGenerator:
        provider: ollama
        modelId: codellama:7b
  defaultProfile: hybrid
```

## Environment Variables

All configuration values can be overridden with environment variables:

- `VOXFORGE_MODELS_DEFAULT_PROFILE` - Default model profile
- `VOXFORGE_VOICE_ENABLED` - Enable/disable voice input
- `VOXFORGE_VOICE_LANGUAGE` - Voice recognition language
- `VOXFORGE_TERMINAL_SHELL` - Default terminal shell
- `VOXFORGE_REMOTE_ENABLED` - Enable/disable remote bridge
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `GEMINI_API_KEY` - Google Gemini API key

## Advanced Configuration

### Custom Model Providers

You can add custom model providers:

```yaml
models:
  profiles:
    - name: custom
      fastDraft:
        provider: custom
        modelId: my-model
        baseUrl: https://my-api.example.com/v1
        apiKey: ${CUSTOM_API_KEY}
```

### Per-Language Model Selection

Configure different models for different languages:

```yaml
models:
  languageSpecific:
    typescript:
      provider: ollama
      modelId: qwen2.5-coder
    python:
      provider: ollama
      modelId: codellama:7b
    go:
      provider: ollama
      modelId: codellama:7b
```
