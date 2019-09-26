const Config = require('../../config');
const Path = require('path');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const { combine, colorize, timestamp, label, printf, splat, errors } = format;

// TODO use Module Name as Label (index.js right now for all modules)
const customLabel = { label: Path.basename(process.mainModule.filename) };

const customTimestamp = { format: 'YYYY-MM-DD HH:mm:ss' };

const customFormat = printf(({ timestamp, label, level, message, ...payload }) => {
  let payloadStr = JSON.stringify(payload, undefined, 2);
  payloadStr = payloadStr === '{}' ? '' : payloadStr;
  payloadStr = payloadStr ? '\n' + payloadStr : '';

  return `${timestamp} [${label}] ${level}: ${message} ${payloadStr}`;
});

const consoleTransport = new transports.Console({
  format: combine(
    colorize(),
    label(customLabel),
    timestamp(customTimestamp),
    splat(),
    errors(),
    customFormat
  )
});

const fileTransport = new (transports.DailyRotateFile)({
  filename: Config.logs.name,
  dirname: Config.logs.dir,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: combine(
    label(customLabel),
    timestamp(customTimestamp),
    splat(),
    errors(),
    customFormat
  )
});

const Logger = createLogger({
  level: Config.environment === 'development' ? 'debug' : 'info',
  transports: [
    consoleTransport,
    fileTransport
  ]
});

module.exports = Logger;
