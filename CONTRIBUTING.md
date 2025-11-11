# Contributing to VoxForge IDE

Thank you for your interest in contributing to VoxForge IDE! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/RemyLoveLogicAI/Voxerforge/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Platform and version information
   - Screenshots if applicable

### Suggesting Features

1. Check [Discussions](https://github.com/RemyLoveLogicAI/Voxerforge/discussions) for similar ideas
2. Create a new discussion or issue describing:
   - The problem it solves
   - Proposed solution
   - Alternative approaches considered
   - Impact on existing features

### Contributing Code

#### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Voxerforge.git
   cd Voxerforge
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Workflow

1. **Make Changes**: Edit code in your feature branch

2. **Test Locally**:
   ```bash
   # Run specific platform
   npm run web:dev
   npm run desktop:dev
   
   # Run tests
   npm run test
   
   # Lint code
   npm run lint
   ```

3. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add voice command for XYZ"
   ```

4. **Push to Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**: Open a PR from your fork to the main repository

#### Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat(voice): add support for custom voice commands
fix(editor): resolve syntax highlighting issue in TypeScript
docs(readme): update installation instructions
```

#### Code Style

- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Code will be auto-formatted with Prettier
- **Linting**: Follow ESLint rules
- **Naming**: Use descriptive names for variables and functions
- **Comments**: Add comments for complex logic
- **Types**: Avoid `any`, use specific types

#### Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good code coverage
- Test on multiple platforms when possible

#### Documentation

- Update README.md if adding features
- Add JSDoc comments for public APIs
- Update docs/ for architecture changes
- Include examples for new features

### Pull Request Process

1. **PR Description**: 
   - Describe what changes were made and why
   - Link related issues
   - Include screenshots for UI changes
   - List breaking changes if any

2. **Checklist**:
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] All tests passing
   - [ ] No new warnings

3. **Review Process**:
   - Maintainers will review your PR
   - Address feedback and make changes
   - Once approved, it will be merged

4. **After Merge**:
   - Delete your feature branch
   - Pull latest changes to stay updated

## Project Structure

```
voxforge-ide/
├── packages/          # Shared packages
│   ├── core/         # Core types and logic
│   ├── voice/        # Voice recognition
│   ├── ai/           # AI integration
│   └── ...
├── apps/             # Platform applications
│   ├── web/          # Web/PWA
│   ├── desktop/      # Tauri desktop
│   ├── mobile/       # React Native
│   └── vr/           # WebXR
├── docs/             # Documentation
└── ...
```

## Areas for Contribution

### High Priority

- [ ] Voice command improvements
- [ ] AI provider integrations (OpenAI, etc.)
- [ ] File system operations
- [ ] UI/UX enhancements
- [ ] Mobile app development
- [ ] VR/AR features
- [ ] Documentation
- [ ] Testing

### Good First Issues

Look for issues labeled `good first issue` - these are great starting points for new contributors.

### Feature Ideas

- Additional voice command patterns
- New AI capabilities (code review, security analysis)
- Theme customization
- Keyboard shortcuts
- Terminal integration
- Git operations
- Extension system
- Collaborative features

## Getting Help

- **Questions**: Use [GitHub Discussions](https://github.com/RemyLoveLogicAI/Voxerforge/discussions)
- **Chat**: Join our community (link TBD)
- **Documentation**: Check [docs/](./docs/)

## Development Tips

### Running Specific Packages

```bash
# Build core package
cd packages/core
npm run build

# Run web app in dev mode
cd apps/web
npm run dev
```

### Debugging

- **Web**: Use browser DevTools
- **Desktop**: Tauri DevTools
- **Mobile**: React Native debugger
- **VR**: Browser console in headset

### Common Issues

**Issue**: Dependencies not installing
**Solution**: Delete `node_modules` and `package-lock.json`, run `npm install` again

**Issue**: TypeScript errors in imports
**Solution**: Run `npm run build` in the package you're importing from

**Issue**: Changes not reflecting
**Solution**: Clear cache, rebuild, restart dev server

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project credits

Thank you for making VoxForge IDE better! 🎙️✨
