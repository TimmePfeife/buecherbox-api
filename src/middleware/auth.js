const HttpStatus = require('http-status-codes');
const Logger = require('../lib/logger');
const Users = require('../lib/users');

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
