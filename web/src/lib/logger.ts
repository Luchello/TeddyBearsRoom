/**
 * Logger utility for consistent logging across the application.
 *
 * - Production: Only error and warn levels are output
 * - Development: All levels (debug, info, warn, error) are output
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.debug('[Component]', 'Debug message');
 *   logger.info('[Component]', 'Info message');
 *   logger.warn('[Component]', 'Warning message');
 *   logger.error('[Component]', 'Error message', error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  isDevelopment: boolean;
  minLevel: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const config: LoggerConfig = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
};

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel];
}

function formatMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${context} ${message}`;
}

export const logger = {
  /**
   * Debug level - only shown in development
   */
  debug(context: string, message: string, ...args: unknown[]): void {
    if (shouldLog('debug')) {
      console.log(formatMessage('debug', context, message), ...args);
    }
  },

  /**
   * Info level - only shown in development
   */
  info(context: string, message: string, ...args: unknown[]): void {
    if (shouldLog('info')) {
      console.log(formatMessage('info', context, message), ...args);
    }
  },

  /**
   * Warning level - shown in all environments
   */
  warn(context: string, message: string, ...args: unknown[]): void {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', context, message), ...args);
    }
  },

  /**
   * Error level - shown in all environments
   */
  error(context: string, message: string, error?: unknown): void {
    if (shouldLog('error')) {
      console.error(formatMessage('error', context, message), error ?? '');
    }
  },
};

export type { LogLevel, LoggerConfig };
