const Users = require('../lib/users');
const HttpStatus = require('http-status-codes');

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
    // TODO: Loggen
    res.sendStatus(HttpStatus.UNAUTHORIZED);
  }
};
