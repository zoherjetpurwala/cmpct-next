// /lib/logger.js
import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY;

// Create logger instance
export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'url-shortener-api' },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: !isServerless }), // No colors in serverless
        isServerless 
          ? winston.format.json() // JSON format in serverless for better log parsing
          : winston.format.simple() // Simple format for local development
      )
    })
  ]
});

// Only add file transports in non-serverless production environments
if (isProduction && !isServerless) {
  // This will only run in traditional server environments, not Vercel/Lambda
  try {
    logger.add(new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }));
    
    logger.add(new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }));
  } catch (error) {
    // If file logging fails, just continue with console logging
    logger.warn('File logging not available, using console only', { error: error.message });
  }
}

// Add structured logging methods
logger.addRequestContext = (requestId, userId = null) => {
  return logger.child({ requestId, userId });
};

// Add serverless-specific logging methods
logger.logRequest = (method, url, requestId, duration = null) => {
  const logData = {
    method,
    url,
    requestId,
    type: 'request'
  };
  
  if (duration !== null) {
    logData.duration = duration;
  }
  
  logger.info('API Request', logData);
};

logger.logError = (error, requestId, context = {}) => {
  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    requestId,
    ...context
  });
};

logger.logDatabase = (operation, table, requestId, duration = null, error = null) => {
  const logData = {
    operation,
    table,
    requestId,
    type: 'database'
  };
  
  if (duration !== null) {
    logData.duration = duration;
  }
  
  if (error) {
    logData.error = error.message;
    logger.error('Database Operation Failed', logData);
  } else {
    logger.info('Database Operation', logData);
  }
};

// In serverless environments, also log to structured format for better monitoring
if (isServerless) {
  logger.info('Logger initialized for serverless environment', {
    platform: process.env.VERCEL ? 'Vercel' : process.env.AWS_LAMBDA_FUNCTION_NAME ? 'AWS Lambda' : 'Unknown',
    nodeEnv: process.env.NODE_ENV,
    logLevel: logger.level
  });
}