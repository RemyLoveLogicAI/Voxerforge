# VoxForge IDE

**A revolutionary, production-grade, full-stack AI-first voice-driven development environment.**

[![CI/CD](https://github.com/RemyLoveLogicAI/Voxerforge/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/RemyLoveLogicAI/Voxerforge/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](https://hub.docker.com/r/voxforge/server)

## 🚀 What is VoxForge IDE?

VoxForge IDE is a next-generation development environment that puts AI and voice control at the forefront. Code by speaking, refactor with natural language, generate tests instantly, and deploy to production - all without touching your keyboard.

### Key Features

- 🎤 **Voice-First Development**: Complete "talk to code" workflow from planning to deployment
- 🤖 **Advanced AI Orchestration**: Multi-model routing with local (Ollama) and cloud (OpenAI, Anthropic) support
- 🌍 **Full-Stack Application**: Production-ready backend with PostgreSQL, Redis, WebSockets, and REST API
- 🔒 **Enterprise-Ready**: Authentication, authorization, rate limiting, monitoring, and auto-scaling
- 🏗️ **Modular Architecture**: Extensible plugin system and MCP integration
- 🌐 **Multi-Platform**: Web (PWA), Desktop (Tauri), Mobile, and VR/AR support
- 🔐 **Security-First**: JWT auth, API keys, encrypted remote sessions, comprehensive safety rails
- 📊 **Built-in Analytics**: Usage tracking, cost monitoring, and performance metrics
- 🔄 **Real-Time Collaboration**: WebSocket-based live coding sessions and remote control
- 🎯 **RAG-Powered**: Semantic code search with vector embeddings for context-aware AI

## 🏗️ Architecture

VoxForge is built as a modern, scalable full-stack application:

### Core Packages (`packages/`)
- **`@voxforge/core`** - Type definitions, interfaces, and constants
- **`@voxforge/ai-orchestrator`** - Multi-model AI routing (Ollama, OpenAI, Anthropic)
- **`@voxforge/voice-engine`** - Voice recognition and intent parsing
- **`@voxforge/code-ops`** - Safe code transformations with diff preview and rollback
- **`@voxforge/rag-engine`** - Semantic search and code intelligence
- **`@voxforge/plugin-system`** - Extensibility framework for third-party plugins

### Applications (`apps/`)
- **`server`** - Express.js backend with WebSocket support, PostgreSQL, and Redis
- **`web`** - React + Vite Progressive Web App
- **`desktop`** - Tauri-based native application (coming soon)
- **`mobile`** - React Native iOS/Android app (coming soon)

### Tech Stack

**Backend:**
- Node.js + TypeScript + Express.js
- PostgreSQL (via Prisma ORM)
- Redis (caching & sessions)
- WebSockets (real-time features)
- JWT authentication
- Docker & Kubernetes ready

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Web Speech API
- Progressive Web App

**AI/ML:**
- Ollama (local models)
- OpenAI API
- Anthropic Claude
- Vector embeddings (RAG)

**DevOps:**
- Docker Compose
- Kubernetes manifests
- GitHub Actions CI/CD
- Auto-scaling with HPA

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm 9+
- Docker & Docker Compose (recommended)
- PostgreSQL 16+ (or use Docker)
- Redis 7+ (or use Docker)
- Ollama (optional, for local AI models)

### Installation

```bash
# Clone repository
git clone https://github.com/RemyLoveLogicAI/Voxerforge.git
cd Voxerforge

# Install dependencies
npm install

# Build all packages
npm run build
```

### Development

```bash
# Start with Docker Compose (recommended)
docker-compose up -d

# Or start components separately:

# 1. Start database
docker-compose up -d postgres redis

# 2. Run migrations
cd apps/server
npx prisma migrate dev

# 3. Start backend
npm run dev

# 4. Start web app (in another terminal)
cd apps/web
npm run dev
```

Visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs

### Production Deployment

```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Using Kubernetes
kubectl apply -f k8s/deployment.yaml

# Manual deployment
npm run build
npm start
```

See [`docs/deployment.md`](docs/deployment.md) for detailed deployment instructions.

## 📖 Documentation

- [Getting Started Guide](docs/getting-started.md) - First steps with VoxForge
- [Architecture Overview](docs/architecture.md) - System design and components
- [Configuration Guide](docs/configuration.md) - Customize your setup
- [Voice Commands Reference](docs/voice-commands.md) - Complete command list
- [API Documentation](docs/api.md) - REST API reference
- [Deployment Guide](docs/deployment.md) - Production deployment
- [Implementation Roadmap](docs/roadmap.md) - Development plan

## 🎯 Features in Detail

### Voice-Driven Development

```
"Hey Vox, refactor this function to use async/await"
→ AI analyzes code
→ Shows plan and diff
→ You confirm
→ Changes applied with automatic backup
```

### AI Actions

- **EXPLAIN** - Understand complex code
- **FIX** - Debug and resolve errors
- **REFACTOR** - Improve code quality
- **TRANSLATE** - Convert between languages
- **DOCS** - Generate documentation
- **TESTS** - Create comprehensive test suites
- **REVIEW** - Get AI code reviews
- **SCAFFOLD** - Generate new features

### Safety Rails

- ✅ Plan → Diff → Confirm → Apply workflow
- ✅ Automatic checkpoint creation
- ✅ Unlimited rollback history
- ✅ Never silently delete files
- ✅ Real-time diff preview

### Remote Development

Control your IDE from anywhere:
- 📱 Mobile app with remote access
- 🔐 End-to-end encrypted sessions
- 🔔 Push notifications for approvals
- 🌐 Multi-device synchronization

### Enterprise Features

- 👥 Multi-user support with RBAC
- 📊 Usage analytics and cost tracking
- 🔑 API key management
- 🎚️ Rate limiting and quotas
- 📈 Auto-scaling infrastructure
- 🔍 Audit logging
- 💾 Automated backups

## 🔧 Configuration

Create `.env` file:

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/voxforge

# Security
JWT_SECRET=your-secret-key

# AI Providers (optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Ollama (local AI)
OLLAMA_BASE_URL=http://localhost:11434
```

See [`config/example.yaml`](config/example.yaml) for full configuration options.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=@voxforge/core

# E2E tests
npm run test:e2e
```

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
npm run build
npm test

# Commit with conventional commits
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

## 📊 Project Status

- ✅ Core architecture and abstractions
- ✅ AI orchestration (Ollama, OpenAI, Anthropic)
- ✅ Voice engine with intent parsing
- ✅ Code operations with diff and rollback
- ✅ Full-stack backend (Express, PostgreSQL, Redis, WebSockets)
- ✅ Authentication and authorization
- ✅ RAG engine for code intelligence
- ✅ Plugin system
- ✅ Docker and Kubernetes deployment
- ✅ CI/CD pipeline
- 🚧 Web application (in progress)
- 🚧 Desktop application (planned)
- 🚧 Mobile application (planned)
- 🚧 VR/AR support (planned)

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with love for developers who want to code faster
- Inspired by the future of human-computer interaction
- Powered by open-source AI models and tools

## 📞 Support

- 📧 Email: support@voxforge.dev
- 💬 Discord: [Join our community](https://discord.gg/voxforge)
- 🐛 Issues: [GitHub Issues](https://github.com/RemyLoveLogicAI/Voxerforge/issues)
- 📖 Docs: [Full Documentation](https://voxforge.dev/docs)

---

**Made with ❤️ and 🎤 by the VoxForge Team**