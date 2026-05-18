/**
 * Logger utility for EmpAI backend.
 * Wraps console methods with timestamps and log levels.
 * In production, can be swapped with winston/pino.
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const timestamp = () => new Date().toISOString();

const logger = {
  info: (...args) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`${colors.cyan}[INFO]${colors.reset} ${colors.gray}${timestamp()}${colors.reset}`, ...args);
    }
  },
  success: (...args) => {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${colors.gray}${timestamp()}${colors.reset}`, ...args);
  },
  warn: (...args) => {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${colors.gray}${timestamp()}${colors.reset}`, ...args);
  },
  error: (...args) => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${colors.gray}${timestamp()}${colors.reset}`, ...args);
  },
  http: (method, url, status, ms) => {
    const color = status >= 500 ? colors.red : status >= 400 ? colors.yellow : colors.green;
    console.log(
      `${colors.gray}${timestamp()}${colors.reset} ${method.padEnd(6)} ${url} ${color}${status}${colors.reset} ${ms}ms`
    );
  },
};

module.exports = logger;
