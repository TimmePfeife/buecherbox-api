const HttpStatus = require('http-status-codes');
const Logger = require('../lib/logger');
const Users = require('../lib/users');

/**
 * Adds authentication to a route. The request needs an valid json web token
 * to be processed further.
 * @module Auth
 * @function
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
module.exports = function auth (req, res, next) {
  try {
    const token = req.get('authorization');
    const userToken = Users.authenticateJwt(token);
    if (!token || !userToken) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    } else {
      req.token = userToken;
      next();
    }
  } catch (e) {
    Logger.error('Authentication error', e);
    res.sendStatus(HttpStatus.UNAUTHORIZED);
  }
};
