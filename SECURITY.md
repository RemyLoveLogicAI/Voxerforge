# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to the maintainers at:
**security@voxforge.dev** (replace with actual email)

You should receive a response within 48 hours. If for some reason you do not, please follow up to ensure we received your original message.

Please include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Security Best Practices

### API Keys
- Never commit API keys to the repository
- Use environment variables for sensitive data
- Rotate keys regularly
- Use key management services when possible

### Data Storage
- User data is stored locally by default
- Cloud sync is opt-in and encrypted
- No user data is sent to third parties without consent
- Clear data retention policies

### Voice & AI
- Voice data is not recorded or stored by default
- AI requests can be configured for privacy
- Support for local-only AI models
- User controls for all external API calls

### Code Execution
- Sandboxed code execution when possible
- User confirmation for potentially dangerous operations
- No automatic code execution from untrusted sources
- Clear warnings for external resources

## Responsible Disclosure

We follow responsible disclosure practices:

1. Report received and acknowledged
2. Issue investigated and confirmed
3. Fix developed and tested
4. Security advisory drafted
5. Fix released
6. Advisory published
7. Reporter credited (if desired)

## Hall of Fame

We appreciate security researchers who help keep VoxForge IDE secure. Contributors will be acknowledged here (with permission).

---

**Last Updated**: 2025-11-11
