// Structured debug logger with emoji prefixes for visual scanning
export const createLogger = (component: string) => {
  // Check if debug logging is enabled (default to true in development)
  const isDebugEnabled = () => {
    if (typeof localStorage !== 'undefined') {
      const debugSetting = localStorage.getItem('debugLogging');
      if (debugSetting !== null) {
        return debugSetting === 'true';
      }
    }
    return process.env.NODE_ENV === 'development';
  };

  // Get the current log level (default to 2 - normal verbosity)
  const getLogLevel = () => {
    if (typeof localStorage !== 'undefined') {
      const level = localStorage.getItem('logLevel');
      if (level !== null) {
        return parseInt(level, 10);
      }
    }
    return 2; // Default level - normal verbosity
  };

  return {
    debug: (emoji: string, msg: string, data?: any) => {
      if (isDebugEnabled() && getLogLevel() >= 3) {
        if (data) {
          console.log(`🔍 [${component}] ${emoji} ${msg}`, data);
        } else {
          console.log(`🔍 [${component}] ${emoji} ${msg}`);
        }
      }
    },
    info: (emoji: string, msg: string, data?: any) => {
      if (isDebugEnabled() && getLogLevel() >= 2) {
        if (data) {
          console.log(`ℹ️ [${component}] ${emoji} ${msg}`, data);
        } else {
          console.log(`ℹ️ [${component}] ${emoji} ${msg}`);
        }
      }
    },
    success: (emoji: string, msg: string, data?: any) => {
      if (isDebugEnabled()) {
        if (data) {
          console.log(`✅ [${component}] ${emoji} ${msg}`, data);
        } else {
          console.log(`✅ [${component}] ${emoji} ${msg}`);
        }
      }
    },
    warn: (emoji: string, msg: string, data?: any) => {
      if (isDebugEnabled()) {
        if (data) {
          console.warn(`⚠️ [${component}] ${emoji} ${msg}`, data);
        } else {
          console.warn(`⚠️ [${component}] ${emoji} ${msg}`);
        }
      }
    },
    error: (emoji: string, msg: string, data?: any) => {
      if (isDebugEnabled()) {
        if (data) {
          console.error(`❌ [${component}] ${emoji} ${msg}`, data);
        } else {
          console.error(`❌ [${component}] ${emoji} ${msg}`);
        }
      }
    },
    api: (emoji: string, msg: string, data?: any) => {
      if (isDebugEnabled() && getLogLevel() >= 2) {
        if (data) {
          console.log(`📡 [${component}] ${emoji} ${msg}`, data);
        } else {
          console.log(`📡 [${component}] ${emoji} ${msg}`);
        }
      }
    },
    ui: (emoji: string, msg: string, data?: any) => {
      if (isDebugEnabled() && getLogLevel() >= 2) {
        if (data) {
          console.log(`🎨 [${component}] ${emoji} ${msg}`, data);
        } else {
          console.log(`🎨 [${component}] ${emoji} ${msg}`);
        }
      }
    },
    voice: (emoji: string, msg: string, data?: any) => {
      if (isDebugEnabled() && getLogLevel() >= 2) {
        if (data) {
          console.log(`🎤 [${component}] ${emoji} ${msg}`, data);
        } else {
          console.log(`🎤 [${component}] ${emoji} ${msg}`);
        }
      }
    },
    perf: (emoji: string, msg: string, data?: any) => {
      if (isDebugEnabled() && getLogLevel() >= 2) {
        if (data) {
          console.log(`⏱️ [${component}] ${emoji} ${msg}`, data);
        } else {
          console.log(`⏱️ [${component}] ${emoji} ${msg}`);
        }
      }
    },
    // Utility function for timing operations
    timeStart: (operationName: string) => {
      if (isDebugEnabled() && getLogLevel() >= 2) {
        console.time(`⏱️ [${component}] ${operationName}`);
      }
    },
    timeEnd: (operationName: string) => {
      if (isDebugEnabled() && getLogLevel() >= 2) {
        console.timeEnd(`⏱️ [${component}] ${operationName}`);
      }
    },
    // Group related logs
    group: (groupName: string) => {
      if (isDebugEnabled() && getLogLevel() >= 2) {
        console.group(`📋 [${component}] ${groupName}`);
      }
    },
    groupEnd: () => {
      if (isDebugEnabled() && getLogLevel() >= 2) {
        console.groupEnd();
      }
    }
  };
};

// Enable logging easily from the console:
// localStorage.setItem('debugLogging', 'true')
// localStorage.setItem('logLevel', '3')  // 1=minimal, 2=normal, 3=verbose

export default createLogger; 