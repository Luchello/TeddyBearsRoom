/**
 * Logger Unit Tests
 * TDD: Testing logger utility for TeddyBear's Room
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '@/lib/logger';

describe('Logger', () => {
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  beforeEach(() => {
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  describe('logger.debug', () => {
    it('should call console.log with formatted debug message', () => {
      logger.debug('[Test]', 'Debug message');
      expect(console.log).toHaveBeenCalled();
    });

    it('should include context in message', () => {
      logger.debug('[Prefix]', 'Message');
      const calledWith = (console.log as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(calledWith).toContain('[Prefix]');
      expect(calledWith).toContain('[DEBUG]');
    });

    it('should include timestamp in message', () => {
      logger.debug('[Test]', 'Message');
      const calledWith = (console.log as ReturnType<typeof vi.fn>).mock.calls[0][0];
      // ISO timestamp format check
      expect(calledWith).toMatch(/\[\d{4}-\d{2}-\d{2}T/);
    });

    it('should handle additional arguments', () => {
      const extraData = { key: 'value' };
      logger.debug('[Test]', 'Message', extraData);
      expect(console.log).toHaveBeenCalledWith(
        expect.any(String),
        extraData
      );
    });
  });

  describe('logger.info', () => {
    it('should call console.log with formatted info message', () => {
      logger.info('[Test]', 'Info message');
      expect(console.log).toHaveBeenCalled();
    });

    it('should include INFO level in message', () => {
      logger.info('[Test]', 'Message');
      const calledWith = (console.log as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(calledWith).toContain('[INFO]');
    });

    it('should handle multiple arguments', () => {
      logger.info('[Test]', 'Message', 'arg1', 'arg2');
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('logger.warn', () => {
    it('should call console.warn with formatted message', () => {
      logger.warn('[Test]', 'Warning message');
      expect(console.warn).toHaveBeenCalled();
    });

    it('should include WARN level in message', () => {
      logger.warn('[Test]', 'Warning');
      const calledWith = (console.warn as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(calledWith).toContain('[WARN]');
    });

    it('should handle additional arguments', () => {
      logger.warn('[Test]', 'Warning', { details: 'info' });
      expect(console.warn).toHaveBeenCalledWith(
        expect.any(String),
        { details: 'info' }
      );
    });
  });

  describe('logger.error', () => {
    it('should call console.error with formatted message', () => {
      logger.error('[Test]', 'Error message');
      expect(console.error).toHaveBeenCalled();
    });

    it('should include ERROR level in message', () => {
      logger.error('[Test]', 'Error');
      const calledWith = (console.error as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(calledWith).toContain('[ERROR]');
    });

    it('should handle Error objects', () => {
      const error = new Error('Test error');
      logger.error('[Test]', 'An error occurred', error);
      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        error
      );
    });

    it('should handle undefined error parameter', () => {
      logger.error('[Test]', 'Error without details');
      expect(console.error).toHaveBeenCalledWith(
        expect.any(String),
        ''
      );
    });
  });

  describe('logger message format', () => {
    it('should format messages consistently across all levels', () => {
      logger.debug('[App]', 'Debug');
      logger.info('[App]', 'Info');
      logger.warn('[App]', 'Warn');
      logger.error('[App]', 'Error');

      // debug and info use console.log (called twice)
      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('should include context in all log levels', () => {
      const context = '[TestContext]';

      logger.debug(context, 'Debug');
      logger.info(context, 'Info');
      logger.warn(context, 'Warn');
      logger.error(context, 'Error');

      // Check debug
      expect((console.log as ReturnType<typeof vi.fn>).mock.calls[0][0]).toContain(context);
      // Check info
      expect((console.log as ReturnType<typeof vi.fn>).mock.calls[1][0]).toContain(context);
      // Check warn
      expect((console.warn as ReturnType<typeof vi.fn>).mock.calls[0][0]).toContain(context);
      // Check error
      expect((console.error as ReturnType<typeof vi.fn>).mock.calls[0][0]).toContain(context);
    });
  });
});
