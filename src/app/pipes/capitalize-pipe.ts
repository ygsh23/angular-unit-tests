import { Pipe, PipeTransform } from '@angular/core';

/**
 * TRAINING MODULE 1: Pipe Testing
 * 
 * A pipe that capitalizes the first letter of each word in a string.
 * This demonstrates:
 * - Pure pipe implementation
 * - String manipulation
 * - Edge case handling
 * - Input validation
 */
@Pipe({
  name: 'capitalize',
  pure: true // Pure pipes are easier to test and more performant
})
export class CapitalizePipe implements PipeTransform {

  /**
   * Transforms a string by capitalizing the first letter of each word
   * @param value - The input string to transform
   * @param preserveCase - Whether to preserve the case of non-first letters (default: false)
   * @returns The transformed string with capitalized words
   */
  transform(value: string | null | undefined, preserveCase: boolean = false): string {
    // Handle null, undefined, or empty values
    if (!value || typeof value !== 'string') {
      return '';
    }

    // Handle empty string or whitespace-only string
    if (value.trim().length === 0) {
      return value;
    }

    return value
      .split(' ')
      .map(word => this.capitalizeWord(word, preserveCase))
      .join(' ');
  }

  /**
   * Capitalizes a single word
   * @param word - The word to capitalize
   * @param preserveCase - Whether to preserve the case of non-first letters
   * @returns The capitalized word
   */
  private capitalizeWord(word: string, preserveCase: boolean): string {
    if (word.length === 0) {
      return word;
    }

    const firstChar = word.charAt(0).toUpperCase();
    const restOfWord = preserveCase ? word.slice(1) : word.slice(1).toLowerCase();
    
    return firstChar + restOfWord;
  }
}
