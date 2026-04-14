const winston = require('winston');

// Custom format to mask sensitive data like passwords and JWTs
const maskSensitiveData = winston.format((info) => {
  let msg = info.message;
  if (typeof msg === 'string') {
    // Mask JSON passwords
    msg = msg.replace(/"password"\s*:\s*"[^"]+"/gi, '"password":"******"');
    // Mask Bearer Tokens
    msg = msg.replace(/Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/gi, 'Bearer ******');
  }
  info.message = msg;
  return info;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    maskSensitiveData(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${stack || ''}`;
    })
  ),
  transports: [
    // Write all security warnings and errors to a file
    new winston.transports.File({ filename: 'security.log', level: 'warn' }),
    // Write all logs to console in development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, stack }) => {
          return `[${timestamp}] ${level}: ${message} ${stack || ''}`;
        })
      )
    })
  ],
});

module.exports = logger;
