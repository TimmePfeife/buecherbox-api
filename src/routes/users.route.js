const Auth = require('../middleware/auth');
const BookBox = require('../lib/bookbox');
const Express = require('express');
const HttpStatus = require('http-status-codes');
const Users = require('../lib/users');

const Router = Express.Router();

Router.post('/', async (req, res) => {
  try {
    const auth = req.get("authorization");

    if (!auth) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    const credentials = Users.getCredentials(auth);

    const user = await Users.createUser(req.body, credentials);
    user.token = Users.createJwt();
    delete user.password;

    res.status(HttpStatus.CREATED).json(user);
  } catch (e) {
    console.log(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.post('/auth', async (req, res) => {
  try {
    const token = req.get("authorization");

    if (!token) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    const credentials = Users.getCredentials(token);
    const result = await Users.authenticateUser(credentials[0], credentials[1]);

    if (result) {
      delete result.user.password;
      res.json(result);
    } else {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.get('/bookboxes', Auth, async (req, res) => {
  try {
    const result = await BookBox.getBookBoxesByUser(user.userId);

    res.json(result);
  } catch (e) {
    console.log(e);
    if (e.name === 'TokenExpiredError') {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

module.exports = Router;
