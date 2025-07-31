import { CapitalizePipe } from './capitalize-pipe';

/**
 * TRAINING MODULE 1: Pipe Testing Fundamentals
 * 
 * This test suite demonstrates:
 * 1. Basic pipe testing setup
 * 2. Testing pure functions
 * 3. Edge case testing
 * 4. Parameter testing
 * 5. Input validation testing
 * 
 * Pipes are the easiest Angular constructs to test because they are pure functions.
 * No TestBed setup is required - just instantiate and test!
 */
describe('CapitalizePipe', () => {
  let pipe: CapitalizePipe;

  beforeEach(() => {
    pipe = new CapitalizePipe();
  });

  describe('Basic Functionality', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should capitalize first letter of a single word', () => {
      // Arrange
      const input = 'hello';
      const expected = 'Hello';

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should capitalize first letter of each word', () => {
      // Arrange
      const input = 'hello world';
      const expected = 'Hello World';

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle multiple words with various spacing', () => {
      // Arrange
      const input = 'hello   world   angular';
      const expected = 'Hello   World   Angular';

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null input', () => {
      // Act
      const result = pipe.transform(null);

      // Assert
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      // Act
      const result = pipe.transform(undefined);

      // Assert
      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      // Act
      const result = pipe.transform('');

      // Assert
      expect(result).toBe('');
    });

    it('should handle whitespace-only string', () => {
      // Arrange
      const input = '   ';

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(input); // Should preserve whitespace
    });

    it('should handle single character', () => {
      // Arrange
      const input = 'a';
      const expected = 'A';

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle already capitalized text', () => {
      // Arrange
      const input = 'Hello World';
      const expected = 'Hello World';

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle mixed case input', () => {
      // Arrange
      const input = 'hELLo WoRLd';
      const expected = 'Hello World';

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('Special Characters and Numbers', () => {
    it('should handle text with numbers', () => {
      // Arrange
      const input = 'hello 123 world';
      const expected = 'Hello 123 World';

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle text with special characters', () => {
      // Arrange
      const input = 'hello-world test_case';
      const expected = 'Hello-world Test_case';

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle text starting with numbers', () => {
      // Arrange
      const input = '123abc 456def';
      const expected = '123abc 456def';

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('Parameter Testing', () => {
    it('should preserve case when preserveCase is true', () => {
      // Arrange
      const input = 'hELLo WoRLd';
      const expected = 'HELLo WoRLd';

      // Act
      const result = pipe.transform(input, true);

      // Assert
      expect(result).toBe(expected);
    });

    it('should convert to lowercase when preserveCase is false (default)', () => {
      // Arrange
      const input = 'hELLo WoRLd';
      const expected = 'Hello World';

      // Act
      const result = pipe.transform(input, false);

      // Assert
      expect(result).toBe(expected);
    });

    it('should use default preserveCase value when not provided', () => {
      // Arrange
      const input = 'hELLo WoRLd';
      const expected = 'Hello World';

      // Act
      const result = pipe.transform(input);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('Performance and Consistency', () => {
    it('should return consistent results for same input', () => {
      // Arrange
      const input = 'hello world';

      // Act
      const result1 = pipe.transform(input);
      const result2 = pipe.transform(input);

      // Assert
      expect(result1).toBe(result2);
      expect(result1).toBe('Hello World');
    });

    it('should handle long strings efficiently', () => {
      // Arrange
      const words = Array(100).fill('word').join(' ');
      const expected = Array(100).fill('Word').join(' ');

      // Act
      const startTime = performance.now();
      const result = pipe.transform(words);
      const endTime = performance.now();

      // Assert
      expect(result).toBe(expected);
      expect(endTime - startTime).toBeLessThan(10); // Should complete in less than 10ms
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle user names correctly', () => {
      // Arrange
      const userNames = [
        'john doe',
        'mary jane watson',
        'peter parker',
        'bruce wayne'
      ];
      const expected = [
        'John Doe',
        'Mary Jane Watson',
        'Peter Parker',
        'Bruce Wayne'
      ];

      // Act & Assert
      userNames.forEach((name, index) => {
        expect(pipe.transform(name)).toBe(expected[index]);
      });
    });

    it('should handle titles and headings', () => {
      // Arrange
      const titles = [
        'angular unit testing guide',
        'best practices for testing',
        'advanced testing techniques'
      ];
      const expected = [
        'Angular Unit Testing Guide',
        'Best Practices For Testing',
        'Advanced Testing Techniques'
      ];

      // Act & Assert
      titles.forEach((title, index) => {
        expect(pipe.transform(title)).toBe(expected[index]);
      });
    });
  });
});
