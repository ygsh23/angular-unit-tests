# Angular Unit Testing Exercises

## 🎯 Hands-on Training Exercises

This document contains practical exercises to reinforce the concepts learned in the Angular Unit Testing training. Each exercise builds upon the previous ones and includes solutions.

---

## Exercise 1: Basic Pipe Testing (15 minutes)

### Objective
Create a new pipe and write comprehensive unit tests for it.

### Task
1. Create a `TruncatePipe` that truncates text to a specified length
2. Add ellipsis (...) when text is truncated
3. Write unit tests covering all edge cases

### Implementation
```typescript
// src/app/pipes/truncate.pipe.ts
@Pipe({ name: 'truncate', pure: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, ellipsis: string = '...'): string {
    // TODO: Implement the pipe logic
  }
}
```

### Test Cases to Implement
- ✅ Should truncate text longer than limit
- ✅ Should not truncate text shorter than limit
- ✅ Should handle null/undefined input
- ✅ Should handle empty string
- ✅ Should use custom ellipsis
- ✅ Should handle negative limit values

### Solution
<details>
<summary>Click to reveal solution</summary>

```typescript
// Implementation
transform(value: string, limit: number = 50, ellipsis: string = '...'): string {
  if (!value) return '';
  if (limit <= 0) return value;
  if (value.length <= limit) return value;
  return value.substring(0, limit) + ellipsis;
}

// Tests
describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should truncate text longer than limit', () => {
    const result = pipe.transform('This is a very long text', 10);
    expect(result).toBe('This is a ...');
  });

  it('should not truncate text shorter than limit', () => {
    const result = pipe.transform('Short', 10);
    expect(result).toBe('Short');
  });

  // Add more test cases...
});
```
</details>

---

## Exercise 2: Service Testing with HTTP (20 minutes)

### Objective
Extend the UserService with new methods and test them.

### Task
1. Add a `getUsersByAge(minAge: number, maxAge: number)` method
2. Add a `toggleUserStatus(userId: number)` method
3. Write comprehensive tests for both methods

### Implementation Guidelines
```typescript
// Add to UserService
getUsersByAge(minAge: number, maxAge: number): Observable<User[]> {
  // TODO: Implement filtering logic
}

toggleUserStatus(userId: number): Observable<User> {
  // TODO: Implement status toggle
}
```

### Test Scenarios
- ✅ Should filter users by age range
- ✅ Should handle invalid age ranges
- ✅ Should toggle user active status
- ✅ Should handle HTTP errors
- ✅ Should validate input parameters

---

## Exercise 3: Component Integration Testing (25 minutes)

### Objective
Create a parent component that uses UserListComponent and test their interaction.

### Task
1. Create a `UserDashboardComponent` that includes:
   - UserListComponent
   - User statistics display
   - User selection handling
2. Write integration tests

### Requirements
```typescript
@Component({
  template: `
    <div class="dashboard">
      <div class="stats">
        <h3>Dashboard Statistics</h3>
        <p>Selected User: {{ selectedUser?.name || 'None' }}</p>
        <p>Total Users: {{ totalUsers }}</p>
      </div>
      <app-user-list 
        [maxUsers]="10"
        [showInactive]="showInactive"
        (userSelected)="onUserSelected($event)"
        (userDeleted)="onUserDeleted($event)">
      </app-user-list>
    </div>
  `
})
export class UserDashboardComponent {
  // TODO: Implement component logic
}
```

### Test Scenarios
- ✅ Should display user statistics
- ✅ Should handle user selection from child component
- ✅ Should update statistics when user is deleted
- ✅ Should pass correct inputs to child component

---

## Exercise 4: Form Testing (30 minutes)

### Objective
Create and test a reactive form for user creation.

### Task
1. Implement the UserFormComponent with reactive forms
2. Add form validation
3. Write comprehensive form tests

### Form Requirements
- Name (required, min 2 characters)
- Email (required, valid email format)
- Age (required, between 18-100)
- Active status (checkbox)

### Test Scenarios
- ✅ Should create form with default values
- ✅ Should validate required fields
- ✅ Should validate email format
- ✅ Should validate age range
- ✅ Should submit valid form
- ✅ Should display validation errors
- ✅ Should disable submit button when form is invalid

---

## Exercise 5: Directive Testing (20 minutes)

### Objective
Create and test a custom directive.

### Task
1. Implement a `HighlightDirective` that highlights text on hover
2. Add configurable highlight color
3. Write directive tests

### Implementation
```typescript
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() highlightColor: string = 'yellow';
  
  // TODO: Implement directive logic
}
```

### Test Scenarios
- ✅ Should highlight element on mouseenter
- ✅ Should remove highlight on mouseleave
- ✅ Should use custom highlight color
- ✅ Should handle missing color input

---

## Exercise 6: Async Testing (25 minutes)

### Objective
Test components with async operations and observables.

### Task
1. Create a `UserSearchComponent` with debounced search
2. Test the debouncing behavior
3. Test loading states and error handling

### Requirements
```typescript
@Component({
  template: `
    <input [(ngModel)]="searchTerm" (input)="onSearch()">
    <div *ngIf="loading">Searching...</div>
    <div *ngIf="error">{{ error }}</div>
    <div *ngFor="let user of searchResults">{{ user.name }}</div>
  `
})
export class UserSearchComponent {
  // TODO: Implement search with 300ms debounce
}
```

### Test Scenarios
- ✅ Should debounce search input
- ✅ Should show loading state during search
- ✅ Should display search results
- ✅ Should handle search errors
- ✅ Should clear previous results on new search

---

## Exercise 7: Testing Best Practices (15 minutes)

### Objective
Refactor existing tests to follow best practices.

### Task
1. Review the UserService tests
2. Identify areas for improvement
3. Implement the following patterns:
   - Page Object Model for component tests
   - Test data builders
   - Custom matchers
   - Shared test utilities

### Example Test Data Builder
```typescript
class UserBuilder {
  private user: Partial<User> = {};

  withId(id: number): UserBuilder {
    this.user.id = id;
    return this;
  }

  withName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  active(): UserBuilder {
    this.user.isActive = true;
    return this;
  }

  build(): User {
    return {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      age: 30,
      isActive: true,
      createdAt: new Date(),
      ...this.user
    };
  }
}
```

---

## Exercise 8: Code Coverage Analysis (10 minutes)

### Objective
Analyze and improve test coverage.

### Task
1. Run tests with coverage report
2. Identify uncovered code paths
3. Add tests to achieve >90% coverage
4. Analyze coverage metrics

### Commands
```bash
# Run tests with coverage
ng test --code-coverage

# View coverage report
open coverage/index.html
```

### Coverage Goals
- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >95%
- **Lines**: >90%

---

## 🏆 Bonus Challenges

### Challenge 1: E2E Integration
Create an end-to-end test that covers the entire user management flow.

### Challenge 2: Performance Testing
Write tests that verify component performance under load.

### Challenge 3: Accessibility Testing
Add tests that verify component accessibility features.

### Challenge 4: Custom Test Utilities
Create a testing utility library for common test scenarios.

---

## 📝 Exercise Checklist

Track your progress through the exercises:

- [ ] Exercise 1: Basic Pipe Testing
- [ ] Exercise 2: Service Testing with HTTP
- [ ] Exercise 3: Component Integration Testing
- [ ] Exercise 4: Form Testing
- [ ] Exercise 5: Directive Testing
- [ ] Exercise 6: Async Testing
- [ ] Exercise 7: Testing Best Practices
- [ ] Exercise 8: Code Coverage Analysis
- [ ] Bonus Challenge 1: E2E Integration
- [ ] Bonus Challenge 2: Performance Testing
- [ ] Bonus Challenge 3: Accessibility Testing
- [ ] Bonus Challenge 4: Custom Test Utilities

---

## 🎯 Success Criteria

By completing these exercises, you should be able to:

1. ✅ Write unit tests for all Angular constructs
2. ✅ Mock dependencies effectively
3. ✅ Test async operations and observables
4. ✅ Handle error scenarios in tests
5. ✅ Achieve high test coverage
6. ✅ Follow testing best practices
7. ✅ Debug failing tests efficiently
8. ✅ Write maintainable test code

---

## 📚 Additional Resources

- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Testing Angular Applications Book](https://www.manning.com/books/testing-angular-applications)
- [Angular Testing Best Practices](https://blog.angular.io/angular-testing-best-practices-guide-e1c1d1c8e5e6)

---

*Happy Testing! 🧪*
