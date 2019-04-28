const Users = require('../lib/users');
const HttpStatus = require('http-status-codes');

module.exports = function auth(req, res, next) {
  try {
    const token = req.get("authorization");

    const user = Users.authenticateJwt(token);
    if (!token || !user) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    } else {
      next();
    }
  } catch (e) {
    // TODO: Loggen
    res.sendStatus(HttpStatus.UNAUTHORIZED);
  }
};
