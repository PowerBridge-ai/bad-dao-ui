# 👥 Contributing to BAD DAO UI

Thank you for your interest in contributing to BAD DAO UI! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive environment. All contributors must follow our Code of Conduct:

- Be respectful and inclusive
- Exercise empathy and kindness
- Give and gracefully accept constructive feedback
- Focus on what is best for the community
- Show courtesy and respect towards other community members

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/bad-dao-ui.git
   cd bad-dao-ui
   ```

3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/PowerBridge-ai/bad-dao-ui.git
   ```

4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔄 Development Process

1. **Pick an Issue**
   - Check existing issues
   - Comment on the issue you want to work on
   - Wait for assignment or approval

2. **Development**
   - Write clean, maintainable code
   - Follow coding standards
   - Include tests
   - Update documentation

3. **Testing**
   - Run all tests
   - Ensure no linting errors
   - Check for TypeScript errors
   - Verify contract interactions

4. **Documentation**
   - Update relevant documentation
   - Add inline comments where needed
   - Update README if necessary

## 🔍 Pull Request Process

1. **Before Submitting**
   - Update your branch with upstream
   - Run all tests
   - Update documentation
   - Review your changes

2. **Submitting**
   - Create a descriptive PR title
   - Fill out the PR template
   - Link related issues
   - Request reviews

3. **Review Process**
   - Address review comments
   - Keep the PR updated
   - Be responsive to feedback

4. **After Merging**
   - Delete your branch
   - Update related issues
   - Help with documentation

## 💻 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful variable names
- Add type definitions

### React Components
- Use functional components
- Implement proper error boundaries
- Follow React best practices
- Use hooks appropriately
- Maintain component hierarchy

### Smart Contracts
- Follow security best practices
- Include comprehensive tests
- Document all functions
- Optimize gas usage
- Include fail-safes

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for all components
- Maintain high coverage
- Test edge cases
- Mock external services

### Integration Tests
- Test component interactions
- Verify contract interactions
- Test UI workflows
- Check error handling

### Contract Tests
- Test all contract functions
- Verify access control
- Test failure scenarios
- Check event emissions

## 📚 Documentation

### Code Documentation
- Use JSDoc comments
- Document complex logic
- Explain important decisions
- Keep comments updated

### Component Documentation
- Document props
- Explain component purpose
- Include usage examples
- Note dependencies

### API Documentation
- Document all endpoints
- Include request/response examples
- Note rate limits
- Document errors

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `question`: Further information needed

## 🔄 Branch Naming

- `feature/`: New features
- `fix/`: Bug fixes
- `docs/`: Documentation updates
- `test/`: Testing updates
- `refactor/`: Code refactoring
- `chore/`: Maintenance tasks

## 📝 Commit Messages

Follow conventional commits:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Testing
- `chore`: Maintenance

Example:
```
feat(governance): add proposal creation interface

- Add form for creating proposals
- Implement validation
- Add success/error handling
```

## 🤝 Getting Help

- Check documentation
- Ask in Discord
- Create an issue
- Contact maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's MIT License. 