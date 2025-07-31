# Angular Unit Testing Training Guide

## 🎯 Training Objectives
By the end of this training, participants will be able to:
- Understand the fundamentals of unit testing in Angular
- Write effective unit tests for components, services, pipes, and directives
- Use Angular testing utilities and best practices
- Mock dependencies and handle asynchronous operations
- Achieve good test coverage and maintainable test code

## 📚 Table of Contents

### 1. Introduction to Unit Testing
- What is Unit Testing?
- Why Unit Testing Matters
- Angular Testing Ecosystem
- Testing Tools: Jasmine & Karma

### 2. Angular Testing Fundamentals
- TestBed Configuration
- Component Testing Basics
- Service Testing
- Pipe Testing
- Directive Testing

### 3. Advanced Testing Concepts
- Mocking Dependencies
- Testing HTTP Calls
- Testing Reactive Forms
- Testing Router Navigation
- Testing Async Operations

### 4. Best Practices
- Test Structure and Organization
- Naming Conventions
- Test Coverage
- Performance Considerations

## 🛠️ Demo Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── user-list/          # Component with HTTP calls
│   │   └── user-form/          # Reactive forms testing
│   ├── services/
│   │   └── user.service.ts     # HTTP service testing
│   ├── pipes/
│   │   └── capitalize.pipe.ts  # Pure pipe testing
│   ├── directives/
│   │   └── highlight.directive.ts # Directive testing
│   └── models/
│       └── user.model.ts       # Interface definitions
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Tests**
   ```bash
   ng test
   ```

3. **Run Tests with Coverage**
   ```bash
   ng test --code-coverage
   ```

## 📖 Training Modules

### Module 1: Testing Fundamentals
- **Duration**: 30 minutes
- **Files**: `src/app/pipes/capitalize.pipe.spec.ts`
- **Topics**: Basic test structure, describe, it, expect

### Module 2: Service Testing
- **Duration**: 45 minutes
- **Files**: `src/app/services/user.service.spec.ts`
- **Topics**: Dependency injection, HTTP testing, mocking

### Module 3: Component Testing
- **Duration**: 60 minutes
- **Files**: `src/app/components/user-list/user-list.component.spec.ts`
- **Topics**: Component lifecycle, DOM testing, event handling

### Module 4: Form Testing
- **Duration**: 45 minutes
- **Files**: `src/app/components/user-form/user-form.component.spec.ts`
- **Topics**: Reactive forms, validation, form controls

### Module 5: Advanced Topics
- **Duration**: 30 minutes
- **Files**: `src/app/directives/highlight.directive.spec.ts`
- **Topics**: Directive testing, custom matchers

## 🎯 Hands-on Exercises

Each module includes:
- ✅ Complete working examples
- 🔧 Hands-on exercises
- 🧪 Test scenarios to implement
- 💡 Best practice tips

## 📊 Success Metrics
- All tests pass (green)
- Code coverage > 80%
- Understanding of testing concepts
- Ability to write new tests independently

---
*This training guide accompanies the PowerPoint presentation and provides practical, hands-on experience with Angular unit testing.*
