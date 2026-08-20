const { existsSync, mkdirSync } = require('fs');

const { join } = require('path');

const winston = require('winston');

const winstonDaily = require('winston-daily-rotate-file');

const logDir = join(__dirname, '../logs');

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const logFormat = winston.format.printf((info) => {
  if (info instanceof Error) {
    return `${info.timestamp} : ${info.level}: ${info.message} ${info.stack}`;
  }
  return `${info.timestamp} : ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY_MM_DD_HH_mm_ss',
    }),
    logFormat
  ),
  transports: [
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/debug`,
      filename: '%DATE%.log',
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),

    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`,
      filename: '%DATE%.log',
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
  })
);

const stream = {
  write: (message) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

module.exports = { logger, stream };
