# Contributing to VoxForge IDE

Thank you for your interest in contributing to VoxForge IDE! This document provides guidelines and instructions for contributing.

## Code of Conduct

We expect all contributors to adhere to our Code of Conduct. Be respectful, inclusive, and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**Good Bug Reports Include:**
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable
- Environment details (OS, Node version, etc.)

**Template:**
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: macOS 14.0
- Node: 20.10.0
- VoxForge: 0.1.0
```

### Suggesting Features

We love feature suggestions! Please:
- Check if the feature already exists or is planned
- Provide a clear use case
- Explain why this feature would be useful
- Consider implementation complexity

### Pull Requests

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Voxerforge.git
   cd Voxerforge
   git remote add upstream https://github.com/RemyLoveLogicAI/Voxerforge.git
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation

4. **Test Your Changes**
   ```bash
   npm install
   npm run build
   npm test
   npm run lint
   ```

5. **Commit**
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add amazing feature"
   git commit -m "fix: resolve bug in voice recognition"
   git commit -m "docs: update API documentation"
   ```

   Types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation only
   - `style`: Code style (formatting, semicolons, etc.)
   - `refactor`: Code refactoring
   - `test`: Adding tests
   - `chore`: Maintenance tasks

6. **Push and Create PR**
   ```bash
   git push origin feature/amazing-feature
   ```
   Then create a Pull Request on GitHub.

## Development Setup

### Prerequisites

- Node.js 20+
- npm 9+
- Docker (optional but recommended)
- PostgreSQL 16+
- Redis 7+

### Initial Setup

```bash
# Install dependencies
npm install

# Set up environment
cp apps/server/.env.example apps/server/.env
# Edit .env with your configuration

# Start database (Docker)
docker-compose up -d postgres redis

# Run migrations
cd apps/server
npx prisma migrate dev

# Build all packages
npm run build

# Start development
npm run dev
```

### Project Structure

```
Voxerforge/
├── apps/
│   ├── server/          # Backend API
│   ├── web/             # Web frontend
│   ├── desktop/         # Desktop app
│   └── mobile/          # Mobile app
├── packages/
│   ├── core/            # Core types and interfaces
│   ├── ai-orchestrator/ # AI model routing
│   ├── voice-engine/    # Voice recognition
│   ├── code-ops/        # Code operations
│   ├── rag-engine/      # RAG/embeddings
│   └── plugin-system/   # Plugin framework
├── docs/                # Documentation
├── config/              # Configuration examples
└── k8s/                 # Kubernetes manifests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=@voxforge/core

# Run tests in watch mode
npm test -- --watch

# Generate coverage
npm test -- --coverage
```

### Code Style

We use:
- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** strict mode

Run linters:
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

Format code:
```bash
npm run format
```

### Debugging

**Backend:**
```bash
# Start with inspector
node --inspect dist/index.js

# Or use VSCode debugger
# Press F5 with launch.json configured
```

**Frontend:**
```bash
# Browser DevTools
# React DevTools extension
```

## Architecture Guidelines

### TypeScript

- Use strict mode
- Prefer interfaces over types for objects
- Use enums for fixed sets of values
- Avoid `any`; use `unknown` if needed
- Document complex types

### React Components

```typescript
// Functional components with TypeScript
interface Props {
  title: string;
  onClose: () => void;
}

export function MyComponent({ title, onClose }: Props) {
  // Component logic
  return <div>{title}</div>;
}
```

### API Routes

```typescript
// Use Express with TypeScript
router.post('/endpoint', 
  requireAuth,
  validateRequest(schema),
  async (req: AuthRequest, res, next) => {
    try {
      // Route logic
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);
```

### Database

- Use Prisma for all database operations
- Write migrations for schema changes
- Add indexes for frequently queried fields
- Use transactions for multi-step operations

### Error Handling

```typescript
// Custom error classes
class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Throw with context
throw new ValidationError('Invalid email format');
```

## Documentation

### Code Comments

```typescript
/**
 * Brief description
 * 
 * Longer description if needed
 * 
 * @param name - Parameter description
 * @returns Return value description
 * @throws ErrorType - When this error is thrown
 * @example
 * ```typescript
 * const result = myFunction('test');
 * ```
 */
export function myFunction(name: string): Result {
  // Implementation
}
```

### README Updates

Update READMEs when:
- Adding new features
- Changing configuration
- Modifying API
- Adding dependencies

### API Documentation

Update `docs/api.md` for:
- New endpoints
- Changed request/response formats
- New parameters
- Deprecated features

## Testing Guidelines

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myModule';

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('should handle errors', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

### Integration Tests

```typescript
describe('API Integration', () => {
  it('should create project', async () => {
    const response = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Project' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('voice command workflow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="voice-button"]');
  await page.fill('[data-testid="command-input"]', 'refactor this');
  await page.click('[data-testid="execute-button"]');
  await expect(page.locator('[data-testid="result"]')).toBeVisible();
});
```

## Release Process

1. **Version Bump**
   ```bash
   npm version patch  # 0.1.0 → 0.1.1
   npm version minor  # 0.1.0 → 0.2.0
   npm version major  # 0.1.0 → 1.0.0
   ```

2. **Update Changelog**
   Document changes in CHANGELOG.md

3. **Create Release**
   ```bash
   git tag -a v0.2.0 -m "Release v0.2.0"
   git push origin v0.2.0
   ```

4. **GitHub Actions** handles:
   - Running tests
   - Building Docker images
   - Publishing packages
   - Deploying to production

## Questions?

- 💬 Discord: [Join our community](https://discord.gg/voxforge)
- 📧 Email: dev@voxforge.dev
- 📖 Docs: [Full Documentation](https://voxforge.dev/docs)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to VoxForge IDE! 🎤❤️
