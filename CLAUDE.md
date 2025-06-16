# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a "Vibe-coded Farming Simulation Game" built with TypeScript and Phaser.js. The project follows Google TypeScript Style Guide and enforces strict code quality standards.

## Development Environment

The project uses a VS Code DevContainer with:
- Node.js 20 base image
- TypeScript with strict mode
- Phaser.js game engine
- Pre-installed tools: Git, zsh, fzf, GitHub CLI, Claude Code CLI
- VS Code extensions: ESLint, Prettier, GitLens
- Jest for unit testing
- Vite for fast development and building

## Code Quality Standards

### IMPORTANT: When working on this codebase, you MUST:

1. **Follow Google TypeScript Style Guide**
   - Use explicit return types for all functions
   - Use interfaces instead of type aliases where appropriate
   - Follow naming conventions (PascalCase for classes/interfaces, camelCase for functions/variables)

2. **Maintain Code Quality**
   - Run `npm run lint` before committing
   - Run `npm run format:check` to verify formatting
   - Run `npm test` to ensure all tests pass
   - Run `npm run check` to run all quality checks at once

3. **Write JSDoc Comments**
   - Document all public functions and classes
   - Include parameter descriptions and return values
   - Follow JSDoc formatting enforced by ESLint

## Git Workflow Instructions

### CRITICAL: Follow these steps for ALL changes:

1. **Create a Feature Branch**
   ```bash
   git checkout -b feat/feature-name  # For features
   git checkout -b fix/bug-name       # For bug fixes
   git checkout -b docs/update-name   # For documentation
   ```

2. **Use Conventional Commits**
   - Format: `type(scope): description`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   - Examples:
     ```
     feat(game): add player movement system
     fix(scene): resolve texture loading issue
     docs(readme): update installation instructions
     ```

3. **Before Creating Pull Request**
   - Run ALL quality checks: `npm run check`
   - Fix any issues before committing
   - Ensure GitHub Actions will pass

4. **Create Pull Request**
   ```bash
   # Push your branch
   git push -u origin feat/feature-name
   
   # Create PR with detailed description
   gh pr create --title "feat: add feature" --body "## Summary
   - Added new feature
   - Updated tests
   
   ## Test plan
   - [ ] Run npm test
   - [ ] Manual testing in browser"
   ```

5. **Monitor GitHub Actions**
   - Check PR status
   - Fix any failing checks
   - Make additional commits if needed

## Common Commands

```bash
# Development
npm run dev          # Start dev server (https://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check formatting
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run check       # Run all checks (lint, format, test)

# Git Workflow
git status          # Check current changes
git diff            # View uncommitted changes
git log --oneline   # View recent commits
gh pr status        # Check PR status
gh pr checks        # View GitHub Actions status
```

## Project Structure

```
├── src/
│   ├── __tests__/       # Unit tests (Jest)
│   ├── scenes/          # Phaser game scenes
│   ├── utils/           # Utility functions
│   ├── config.ts        # Game configuration
│   └── main.ts          # Entry point
├── .github/
│   └── workflows/       # GitHub Actions CI/CD
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── eslint.config.mjs    # ESLint rules
├── jest.config.js       # Jest configuration
└── .prettierrc.json     # Prettier formatting
```

## Development Guidelines

1. **Adding New Features**
   - Create feature in appropriate directory
   - Write unit tests for logic
   - Update relevant documentation
   - Follow existing patterns

2. **Writing Tests**
   - Place tests in `__tests__` directories
   - Use descriptive test names
   - Test edge cases
   - Maintain high coverage

3. **Performance Considerations**
   - Use Phaser's built-in optimizations
   - Implement object pooling for frequent spawns
   - Profile before optimizing

## Troubleshooting

- **ESLint Errors**: Run `npm run lint:fix` to auto-fix
- **Type Errors**: Check `tsconfig.json` strict settings
- **Test Failures**: Run `npm run test:watch` for debugging
- **Build Issues**: Clear `dist/` and rebuild

## Environment Notes

- Running in GitHub Codespace with restricted internet
- HTTPS required for local development (configured in Vite)
- Use provided DevContainer for consistent environment

## License

MIT License (Copyright 2025 Matt Ball)