# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a "Vibe-coded Farming Simulation Game" project. The repository is currently in its initial stages with a Node.js development environment configured via DevContainer.

## Development Environment

The project uses a VS Code DevContainer with:
- Node.js 20 base image
- Pre-installed tools: Git, zsh, fzf, GitHub CLI, Claude Code CLI
- VS Code extensions: ESLint, Prettier, GitLens

## Common Commands

Since this is a new project without a package.json, the first steps typically involve:

```bash
# Initialize npm project
npm init -y

# Install common game development dependencies (when needed)
npm install --save-dev vite
npm install --save-dev eslint prettier

# Once package.json exists with scripts:
# npm run dev      # Start development server
# npm run build    # Build for production
# npm run lint     # Run linter
# npm test         # Run tests
```

## Project Structure

As this is a new farming simulation game project, consider organizing code as follows:
- `/src` - Main source code
- `/src/game` - Core game logic
- `/src/assets` - Game assets (sprites, sounds, etc.)
- `/public` - Static files

## Development Notes

- The repository is set up for JavaScript/Node.js development based on the .gitignore configuration
- No game framework has been chosen yet - consider Phaser.js, PixiJS, or vanilla Canvas API for web-based farming simulation
- The project is licensed under MIT License (Copyright 2025 Matt Ball)