const Users = require('../lib/users');
const Express = require('express');
const HttpStatus = require('http-status-codes');

const Router = Express.Router();

Router.post('/', async (req, res) => {
  try {
    const auth = req.get("authorization");

    if (!auth) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    const credentials = Users.getCredentials(auth);
    const user = req.body;
    await Users.createUser(user, credentials);
    res.sendStatus(HttpStatus.CREATED);
  } catch (e) {
    console.log(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.post('/auth', async (req, res) => {
  try {
    const auth = req.get("authorization");

    if (!auth) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    const credentials = Users.getCredentials(auth);
    const result = await Users.authenticateUser(credentials[0], credentials[1]);

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
