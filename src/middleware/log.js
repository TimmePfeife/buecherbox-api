const Logger = require('../lib/logger');

module.exports = function logRequest (req, res, next) {
  Logger.info(`${req.method} ${req.originalUrl}`);
  Logger.debug('Payload:', req.body);
  next();
};
