
/**
 * Logger utility for managing application logs
 */

// Enable/disable debug logs based on environment
const isDevMode = import.meta.env.DEV || false;
const isDebugEnabled = isDevMode || import.meta.env.VITE_DEBUG_LOGS === 'true';

// Log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Logger configuration
const loggerConfig = {
  enabled: true,
  debugEnabled: isDebugEnabled,
  prefix: '[Bridge]',
};

/**
 * Main logger object
 */
export const logger = {
  /**
   * Log debug information (only in development or when debug logs are enabled)
   */
  debug: (message: string, ...data: any[]) => {
    if (!loggerConfig.enabled || !loggerConfig.debugEnabled) return;
    console.debug(`${loggerConfig.prefix} ${message}`, ...data);
  },

  /**
   * Log informational messages
   */
  info: (message: string, ...data: any[]) => {
    if (!loggerConfig.enabled) return;
    console.info(`${loggerConfig.prefix} ${message}`, ...data);
  },

  /**
   * Log warning messages
   */
  warn: (message: string, ...data: any[]) => {
    if (!loggerConfig.enabled) return;
    console.warn(`${loggerConfig.prefix} ${message}`, ...data);
  },

  /**
   * Log error messages (always enabled)
   */
  error: (message: string, ...data: any[]) => {
    console.error(`${loggerConfig.prefix} ${message}`, ...data);
  },

  /**
   * Log API request details
   */
  apiRequest: (endpoint: string, method: string, body?: any) => {
    if (!loggerConfig.enabled || !loggerConfig.debugEnabled) return;
    console.debug(`${loggerConfig.prefix} API Request: ${method} ${endpoint}`, body || '');
  },

  /**
   * Log API response details
   */
  apiResponse: (endpoint: string, status: number, data?: any) => {
    if (!loggerConfig.enabled || !loggerConfig.debugEnabled) return;
    console.debug(`${loggerConfig.prefix} API Response: ${status} ${endpoint}`, data || '');
  },
};

/**
 * Create a child logger with a custom prefix
 */
export const createLogger = (prefix: string) => {
  return {
    debug: (message: string, ...data: any[]) => {
      if (!loggerConfig.enabled || !loggerConfig.debugEnabled) return;
      console.debug(`[${prefix}] ${message}`, ...data);
    },
    info: (message: string, ...data: any[]) => {
      if (!loggerConfig.enabled) return;
      console.info(`[${prefix}] ${message}`, ...data);
    },
    warn: (message: string, ...data: any[]) => {
      if (!loggerConfig.enabled) return;
      console.warn(`[${prefix}] ${message}`, ...data);
    },
    error: (message: string, ...data: any[]) => {
      console.error(`[${prefix}] ${message}`, ...data);
    },
  };
};
