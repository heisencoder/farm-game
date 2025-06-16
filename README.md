# Vibe Farming Game

A TypeScript-based farming simulation game built with Phaser.js, following Google TypeScript Style Guide and best practices for code quality.

## Features

- Built with TypeScript and Phaser.js game engine
- Follows Google TypeScript Style Guide
- Comprehensive testing with Jest
- Code formatting with Prettier
- Linting with ESLint
- Continuous Integration with GitHub Actions
- Vite for fast development and building

## Prerequisites

- Node.js 18.x or 20.x
- npm

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd farm-game

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev

# The game will be available at https://localhost:3000
```

### Building

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run check` - Run all code quality checks (lint, format, test)

## Project Structure

```
├── src/
│   ├── __tests__/       # Unit tests
│   ├── scenes/          # Phaser scenes
│   ├── utils/           # Utility functions
│   ├── config.ts        # Game configuration
│   └── main.ts          # Entry point
├── .github/
│   └── workflows/       # GitHub Actions workflows
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── eslint.config.mjs    # ESLint configuration
├── jest.config.js       # Jest configuration
└── .prettierrc.json     # Prettier configuration
```

## Code Quality

This project enforces strict code quality standards:

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Google TypeScript Style Guide with additional rules
- **Prettier**: Automatic code formatting
- **Jest**: Unit testing framework
- **GitHub Actions**: Automated CI/CD pipeline

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

## Contributing

1. Create a feature branch (`git checkout -b feat/amazing-feature`)
2. Make your changes following the code style guidelines
3. Run code quality checks (`npm run check`)
4. Commit your changes using Conventional Commits
5. Push to the branch (`git push origin feat/amazing-feature`)
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Matt Ball
