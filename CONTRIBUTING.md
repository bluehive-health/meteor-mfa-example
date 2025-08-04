# Contributing to Meteor MFA Example

Thank you for considering contributing to the Meteor MFA Example project! This document provides guidelines for contributing to this example application.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment.

## How to Contribute

### Reporting Issues

- Check if the issue already exists in the [Issues](https://github.com/bluehive-health/meteor-mfa-example/issues) section
- Use the issue templates when available
- Provide clear, detailed descriptions with steps to reproduce
- Include relevant system information (Node.js version, Meteor version, OS)

### Submitting Changes

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/meteor-mfa-example.git
   cd meteor-mfa-example
   ```

2. **Set Up Development Environment**
   ```bash
   meteor npm install
   meteor run
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

4. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed
   - Ensure all tests pass: `meteor test`

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add descriptive commit message"
   ```

6. **Push and Create Pull Request**
   ```bash
   git push origin your-branch-name
   ```
   Then create a Pull Request on GitHub.

## Development Guidelines

### Code Style

- Use JavaScript ES6+ features
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test 2FA functionality thoroughly
- Include edge cases and error scenarios

### Security Considerations

- This is a demonstration application
- Follow security best practices
- Don't commit sensitive information
- Test security features carefully

### Documentation

- Update README.md for significant changes
- Add inline comments for complex code
- Update API documentation if applicable

## Pull Request Process

1. **Ensure Quality**
   - All tests pass
   - Code follows style guidelines
   - Documentation is updated

2. **PR Description**
   - Clearly describe the changes
   - Reference related issues
   - Include testing instructions

3. **Review Process**
   - Address reviewer feedback
   - Make requested changes
   - Ensure CI passes

## Development Setup

### Required Tools

- Node.js 18+
- Meteor 3.3+
- Git

### Running Tests

```bash
# Run all tests
meteor test

# Run tests in watch mode
meteor test --watch

# Run full app tests
npm run test-app
```

### Project Structure

```
meteor-mfa-example/
├── client/          # Client-side code
├── server/          # Server-side code
├── imports/         # Shared code
│   └── ui/         # React components
├── tests/          # Test files
└── public/         # Static assets
```

## Questions?

If you have questions about contributing:

1. Check the [README.md](README.md) for basic information
2. Look at existing issues and PRs
3. Create an issue for discussion

Thank you for contributing to make this example better!