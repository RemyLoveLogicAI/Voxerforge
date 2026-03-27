# VoxForge Voice Commands Reference

Complete reference for all voice commands supported by VoxForge IDE.

## Wake Words

Activate VoxForge with any of these wake words:
- "Hey Vox"
- "VoxForge"
- "Hey Forge"

Example: *"Hey Vox, explain this function"*

## Core AI Actions

### EXPLAIN - Code Explanation

Understand code with detailed explanations.

**Patterns:**
- "Explain this [function/class/file]"
- "What does this code do?"
- "Describe how this works"
- "Tell me about this [component/module]"

**Examples:**
- "Explain this function"
- "What does the main function do?"
- "Describe how this class works"
- "Tell me about this authentication module"

**Scope Options:**
- Current selection
- Current function
- Current class
- Current file
- Entire project

---

### FIX - Error Resolution

Automatically detect and fix code issues.

**Patterns:**
- "Fix this [error/bug/issue]"
- "Repair this code"
- "Debug this"
- "Solve this problem"

**Examples:**
- "Fix this syntax error"
- "Debug this function"
- "Repair this broken code"
- "Fix all linting errors in this file"

**Features:**
- Automatic error detection
- Suggested fixes with explanation
- Multiple fix options when applicable

---

### REFACTOR - Code Improvement

Improve code quality, structure, and performance.

**Patterns:**
- "Refactor this [code/function/class]"
- "Improve this code"
- "Optimize this [function/algorithm]"
- "Clean up this file"

**Examples:**
- "Refactor this function to use async/await"
- "Improve this code for readability"
- "Optimize this sorting algorithm"
- "Clean up this component"
- "Refactor to use repository pattern"

**Refactoring Types:**
- Extract function/method
- Extract variable
- Inline function
- Rename
- Convert to async/await
- Apply design patterns
- Performance optimization

---

### TRANSLATE - Language Translation

Convert code between programming languages.

**Patterns:**
- "Translate this to [language]"
- "Convert this to [language]"
- "Transform this into [language]"

**Examples:**
- "Translate this to TypeScript"
- "Convert this JavaScript to Python"
- "Transform this Java code into Go"
- "Translate to Rust"

**Supported Languages:**
- TypeScript ↔ JavaScript
- Python ↔ JavaScript/TypeScript
- Java ↔ Kotlin
- C++ ↔ Rust
- Go ↔ Any
- And more...

---

### DOCS - Documentation Generation

Generate comprehensive documentation.

**Patterns:**
- "Document this [code/function/class]"
- "Add docs to this"
- "Generate documentation"
- "Write docs for this"

**Examples:**
- "Document this function"
- "Add JSDoc comments to this"
- "Generate API documentation"
- "Write README for this project"

**Documentation Types:**
- Inline comments
- JSDoc/TSDoc
- Docstrings (Python)
- README files
- API documentation
- Usage examples

---

### TESTS - Test Generation

Generate comprehensive test suites.

**Patterns:**
- "Generate tests for this"
- "Write tests for this [function/class]"
- "Add test coverage"
- "Create unit tests"

**Examples:**
- "Generate tests for this function"
- "Write unit tests for this class"
- "Add integration tests for this API"
- "Create test cases for edge cases"

**Test Types:**
- Unit tests
- Integration tests
- End-to-end tests
- Edge case coverage
- Mock setup

---

### REVIEW - Code Review

Get AI-powered code reviews.

**Patterns:**
- "Review this code"
- "Check this [code/function/file]"
- "Analyze this for issues"
- "Inspect this code"

**Examples:**
- "Review this pull request"
- "Check this code for bugs"
- "Analyze this for security issues"
- "Inspect this for best practices"

**Review Aspects:**
- Code quality
- Performance issues
- Security vulnerabilities
- Best practices
- Design patterns
- Code smells

---

### SCAFFOLD_FEATURE - Code Generation

Generate new features, components, or modules.

**Patterns:**
- "Scaffold a [feature/component/module]"
- "Create a [feature/component] called [name]"
- "Generate a [feature/component]"
- "Set up [feature/component]"

**Examples:**
- "Scaffold a user authentication feature"
- "Create a payment component called CheckoutForm"
- "Generate a REST API for products"
- "Set up a React component for navigation"

**Scaffolding Types:**
- React components
- API routes
- Database models
- Service classes
- Full features with tests

---

### COMMIT_MESSAGE - Git Commit Messages

Generate meaningful commit messages.

**Patterns:**
- "Generate commit message"
- "Create commit message"
- "What should I commit this as?"

**Examples:**
- "Generate commit message for these changes"
- "Create a commit message"

**Features:**
- Conventional commits format
- Includes scope and type
- Lists main changes
- References related issues

---

### PR_DESCRIPTION - Pull Request Descriptions

Generate comprehensive PR descriptions.

**Patterns:**
- "Generate PR description"
- "Create pull request description"
- "Write PR summary"

**Examples:**
- "Generate PR description for this feature"
- "Create pull request description"

**Includes:**
- Summary of changes
- Testing notes
- Breaking changes
- Migration guide (if needed)

---

## Terminal AI Commands

AI-enhanced terminal commands with `ai` prefix:

### ai explain [command]

Explain what a command does before running it.

```bash
ai explain git rebase -i HEAD~3
ai explain docker-compose up -d
ai explain rm -rf node_modules
```

### ai fix

Analyze the last command error and suggest a fix.

```bash
# After an error
npm install
# Error: EACCES permission denied

ai fix
# Suggests: sudo npm install or use nvm
```

### ai commit

Generate a commit message from git diff.

```bash
git add .
ai commit
# Suggests: "feat: add user authentication with JWT"
```

### ai doc

Generate or update project documentation.

```bash
ai doc
# Updates README based on code changes
```

### ai suggest

Suggest next command based on context.

```bash
ai suggest
# Suggests: npm test (after making changes)
# Suggests: git commit (after git add)
```

---

## Advanced Voice Patterns

### Compound Commands

Chain multiple commands:

```
"Explain this function, then refactor it to use async/await, then generate tests"
```

### Conditional Commands

```
"If this has errors, fix them, otherwise optimize for performance"
```

### Scoped Commands

Specify exact scope:

```
"Refactor the getUserData function in the auth module"
"Generate tests for all API routes in the products controller"
```

### Pattern-Based Commands

```
"Refactor all functions in this file to use arrow functions"
"Add error handling to all async functions"
```

---

## Push-to-Talk Mode

If enabled in settings, hold a key while speaking:

- **Default Key**: `Ctrl/Cmd + Shift + Space`
- Configurable in settings

---

## Voice Command Tips

### 1. Be Specific
❌ "Fix this"
✅ "Fix the type error on line 42"

### 2. Use Context
Open the file first, then:
✅ "Refactor this function"

### 3. Natural Language
VoxForge understands natural speech:
- "Make this function faster"
- "This code is messy, clean it up"
- "I need tests for the login feature"

### 4. Chain Actions
Build on previous commands:
1. "Explain this function"
2. "Now make it async"
3. "Add error handling"
4. "Generate tests"

### 5. Use Pauses
Speak clearly with natural pauses:
"Refactor this function [pause] to use repository pattern"

---

## Language Support

VoxForge voice recognition supports:

- English (US, UK, AU)
- Spanish
- French
- German
- Italian
- Portuguese
- Japanese
- Chinese (Mandarin)
- Korean
- And more...

Configure in settings: `voice.language`

---

## Accessibility

VoxForge is designed for:
- Hands-free coding
- Developers with mobility limitations
- Pair programming
- Learning and teaching
- Faster workflows

---

## Troubleshooting Voice Commands

### Command Not Recognized

1. Speak clearly and at normal pace
2. Use wake word first
3. Check microphone settings
4. Review recognized transcript
5. Try alternative phrasing

### Wrong Action Detected

1. Be more specific
2. Use action name explicitly: "Use the FIX action on this code"
3. Check transcript for accuracy

### Low Confidence

VoxForge shows confidence scores. If low:
1. Repeat command more clearly
2. Use push-to-talk mode
3. Reduce background noise
4. Check microphone quality

---

## Custom Voice Commands (Coming Soon)

Future support for:
- User-defined voice shortcuts
- Project-specific commands
- Team vocabulary
- Custom wake words
