/**
 * Structured Debug Logger
 * Based on the structured-debug-logging-guide.md
 */

interface Logger {
  debug: (emoji: string, msg: string) => void;
  info: (emoji: string, msg: string) => void;
  success: (emoji: string, msg: string) => void;
  error: (emoji: string, msg: string) => void;
  warn: (emoji: string, msg: string) => void;
  security: (emoji: string, msg: string) => void;
  api: (emoji: string, msg: string) => void;
  perf: (emoji: string, msg: string) => void;
  data: (emoji: string, msg: string) => void;
  init: (emoji: string, msg: string) => void;
  admin: (emoji: string, msg: string) => void;
  user: (emoji: string, msg: string) => void;
  nav: (emoji: string, msg: string) => void;
  v1: (emoji: string, msg: string) => void;
  v2: (emoji: string, msg: string) => void;
  v3: (emoji: string, msg: string) => void;
}

/**
 * Create a component-specific logger with emoji-based visual categorization
 * @param component Name of the component that's doing the logging
 * @returns Logger object with category methods
 */
export const createLogger = (component: string): Logger => {
  return {
    debug: (emoji: string, msg: string) => console.log(`🔍 [${component}] ${emoji} ${msg}`),
    info: (emoji: string, msg: string) => console.log(`ℹ️ [${component}] ${emoji} ${msg}`),
    success: (emoji: string, msg: string) => console.log(`✅ [${component}] ${emoji} ${msg}`),
    error: (emoji: string, msg: string) => console.error(`❌ [${component}] ${emoji} ${msg}`),
    warn: (emoji: string, msg: string) => console.warn(`⚠️ [${component}] ${emoji} ${msg}`),
    security: (emoji: string, msg: string) => console.log(`🔐 [${component}] ${emoji} ${msg}`),
    api: (emoji: string, msg: string) => console.log(`📡 [${component}] ${emoji} ${msg}`),
    perf: (emoji: string, msg: string) => console.log(`⏱️ [${component}] ${emoji} ${msg}`),
    data: (emoji: string, msg: string) => console.log(`📦 [${component}] ${emoji} ${msg}`),
    init: (emoji: string, msg: string) => console.log(`🏗️ [${component}] ${emoji} ${msg}`),
    admin: (emoji: string, msg: string) => console.log(`👑 [${component}] ${emoji} ${msg}`),
    user: (emoji: string, msg: string) => console.log(`👤 [${component}] ${emoji} ${msg}`),
    nav: (emoji: string, msg: string) => console.log(`🧭 [${component}] ${emoji} ${msg}`),
    
    // Log with multiple verbosity levels
    v1: (emoji: string, msg: string) => console.log(`[${component}] ${emoji} ${msg}`),
    v2: (emoji: string, msg: string) => {
      if (localStorage.getItem('logLevel') && parseInt(localStorage.getItem('logLevel')!) >= 2) {
        console.log(`[${component}] ${emoji} ${msg}`);
      }
    },
    v3: (emoji: string, msg: string) => {
      if (localStorage.getItem('logLevel') && parseInt(localStorage.getItem('logLevel')!) >= 3) {
        console.log(`[${component}] ${emoji} ${msg}`);
      }
    }
  };
};

/**
 * Enhanced logger with performance timing and data inspection
 * @param component Name of the component that's doing the logging
 * @returns Advanced logger with timing and inspection methods
 */
export const createAdvancedLogger = (component: string) => {
  const timers = new Map<string, number>();
  const logger = createLogger(component);
  
  return {
    ...logger,
    // Start timing an operation
    startTimer: (operationName: string) => {
      timers.set(operationName, performance.now());
      logger.perf('⏱️', `Started timing: ${operationName}`);
    },
    // End timing and log the duration
    endTimer: (operationName: string) => {
      const startTime = timers.get(operationName);
      if (startTime) {
        const duration = performance.now() - startTime;
        logger.perf('⏱️', `${operationName} completed in ${duration.toFixed(2)}ms`);
        timers.delete(operationName);
        return duration;
      } else {
        logger.warn('⚠️', `No timer found for operation: ${operationName}`);
        return null;
      }
    },
    // Log with data inspection (truncated for large objects)
    inspectData: (emoji: string, label: string, data: any) => {
      const stringify = (obj: any) => {
        try {
          const str = JSON.stringify(obj, null, 2);
          if (str.length > 500) {
            return str.substring(0, 500) + '... [truncated]';
          }
          return str;
        } catch (e) {
          return '[Cannot stringify object]';
        }
      };
      
      logger.debug(emoji, `${label}: ${stringify(data)}`);
    }
  };
};

/**
 * Create environment-aware logger that only logs in development
 * @param component Name of the component
 * @returns Logger that only outputs in development environment
 */
export const createEnvironmentLogger = (component: string): Logger => {
  const logger = createLogger(component);
  
  // Only log in development environment
  const isProduction = typeof window !== 'undefined' 
    ? window.location.hostname !== 'localhost' 
    : true;
    
  if (isProduction) {
    // Create a no-op logger for production
    const noopLogger: Logger = {
      debug: () => {},
      info: () => {},
      success: () => {},
      error: () => {},
      warn: () => {},
      security: () => {},
      api: () => {},
      perf: () => {},
      data: () => {},
      init: () => {},
      admin: () => {},
      user: () => {},
      nav: () => {},
      v1: () => {},
      v2: () => {},
      v3: () => {}
    };
    return noopLogger;
  }
  
  return logger;
};

export default createLogger; 