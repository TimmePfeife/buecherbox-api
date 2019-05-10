const Logger = require('../lib/logger');

/**
 * Logs details of an incoming request.
 * @module Log
 * @function
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
module.exports = function logRequest (req, res, next) {
  Logger.info(`${req.method} ${req.originalUrl}`);
  Logger.debug('Payload:', req.body);
  next();
};
