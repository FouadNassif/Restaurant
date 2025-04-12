# Contributing to Restaurant Ordering System

First off, thank you for considering contributing to the Restaurant Ordering System! It's people like you that make it such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the TypeScript styleguide
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. Fork the repo
2. Create a new branch from `main`
3. Make your changes
4. Run the tests
5. Push to your fork and submit a pull request

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/restaurant-ordering-system.git

# Add upstream remote
git remote add upstream https://github.com/original-owner/restaurant-ordering-system.git

# Install dependencies
npm install

# Create branch for your feature
git checkout -b feature/your-feature-name
```

### Style Guide

* Use TypeScript
* Follow the existing code style
* Use meaningful variable names
* Comment your code when necessary
* Keep functions small and focused
* Use async/await instead of promises
* Write tests for new features

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test-file.ts

# Run tests in watch mode
npm test -- --watch
```

## Project Structure

```
restaurant-ordering-system/
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # React components
│   ├── data/         # Data models and mock data
│   ├── store/        # State management
│   ├── styles/       # Global styles
│   └── utils/        # Utility functions
├── public/           # Static files
├── tests/           # Test files
└── types/           # TypeScript type definitions
```

## Questions?

Feel free to contact us if you have any questions. We're here to help! 