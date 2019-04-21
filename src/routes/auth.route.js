const Auth = require('../lib/auth');
const Express = require('express');
const HttpStatus = require('http-status-codes');

const Router = Express.Router();

Router.post('/', async (req, res) => {
  try {
    const auth = req.get("authorization");

    if (!auth) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    const credentials = Auth.getCredentials(auth);
    const result = await Auth.authenticateUser(credentials[0], credentials[1]);

    if (result) {
      res.json(result);
    } else {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

module.exports = Router;
