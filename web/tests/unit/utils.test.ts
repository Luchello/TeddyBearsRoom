/**
 * Utils Unit Tests
 * TDD: Testing utility functions for TeddyBear's Room
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  formatPrice,
  formatDate,
  truncate,
  generateId,
  debounce,
  isClient,
  sleep,
} from '@/lib/utils';

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('should merge multiple class names', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class active-class');
    });

    it('should deduplicate conflicting Tailwind classes', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'end');
      expect(result).toBe('base end');
    });

    it('should handle empty string', () => {
      const result = cn('');
      expect(result).toBe('');
    });

    it('should handle array of classes', () => {
      const result = cn(['class1', 'class2']);
      expect(result).toBe('class1 class2');
    });
  });

  describe('formatPrice', () => {
    it('should format positive price in Korean Won', () => {
      const result = formatPrice(10000);
      expect(result).toMatch(/10,000/);
      expect(result).toMatch(/₩|원/);
    });

    it('should format zero price', () => {
      const result = formatPrice(0);
      expect(result).toMatch(/0/);
    });

    it('should format large numbers with proper separators', () => {
      const result = formatPrice(1234567);
      expect(result).toMatch(/1,234,567/);
    });

    it('should handle decimal values (rounded)', () => {
      const result = formatPrice(1000.5);
      // Korean Won doesn't use decimals, should be rounded
      expect(result).toMatch(/1,00[01]/);
    });
  });

  describe('formatDate', () => {
    it('should format Date object in Korean locale', () => {
      const date = new Date('2024-12-25');
      const result = formatDate(date);
      expect(result).toMatch(/2024/);
      expect(result).toMatch(/12/);
      expect(result).toMatch(/25/);
    });

    it('should format date string', () => {
      const result = formatDate('2024-01-15');
      expect(result).toMatch(/2024/);
      expect(result).toMatch(/1/);
      expect(result).toMatch(/15/);
    });

    it('should handle ISO date string', () => {
      const result = formatDate('2024-06-01T12:00:00Z');
      expect(result).toMatch(/2024/);
      expect(result).toMatch(/6/);
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const result = truncate('This is a very long string', 10);
      expect(result).toBe('This is a ...');
      expect(result.length).toBe(13); // 10 chars + "..."
    });

    it('should not truncate short strings', () => {
      const result = truncate('Short', 10);
      expect(result).toBe('Short');
    });

    it('should handle exact length strings', () => {
      const result = truncate('ExactLen', 8);
      expect(result).toBe('ExactLen');
    });

    it('should handle empty string', () => {
      const result = truncate('', 5);
      expect(result).toBe('');
    });

    it('should handle length of 0', () => {
      const result = truncate('Hello', 0);
      expect(result).toBe('...');
    });
  });

  describe('generateId', () => {
    it('should generate a string ID', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('should generate IDs of consistent length', () => {
      const id = generateId();
      expect(id.length).toBe(7);
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });

    it('should only contain alphanumeric characters', () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should delay function execution', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should only execute once for multiple rapid calls', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the debounced function', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should use the last arguments when called multiple times', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledWith('third');
    });

    it('should reset the timer on each call', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      vi.advanceTimersByTime(50);
      debouncedFn();
      vi.advanceTimersByTime(50);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('isClient', () => {
    it('should be a boolean', () => {
      expect(typeof isClient).toBe('boolean');
    });

    it('should be true in browser environment (vitest jsdom)', () => {
      // In vitest with jsdom, window should be defined
      expect(isClient).toBe(true);
    });
  });

  describe('sleep', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return a Promise', () => {
      const result = sleep(100);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve after specified time', async () => {
      const fn = vi.fn();

      sleep(100).then(fn);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      await Promise.resolve(); // Flush microtasks

      expect(fn).toHaveBeenCalled();
    });

    it('should resolve with undefined', async () => {
      vi.useRealTimers(); // Use real timers for this test
      const result = await sleep(1);
      expect(result).toBeUndefined();
    });
  });
});
