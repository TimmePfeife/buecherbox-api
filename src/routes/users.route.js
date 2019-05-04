const Auth = require('../middleware/auth');
const BookBox = require('../lib/bookbox');
const Express = require('express');
const HttpStatus = require('http-status-codes');
const Logger = require('../lib/logger');
const Users = require('../lib/users');

const Router = Express.Router();

Router.post('/', async (req, res) => {
  try {
    const auth = req.get('authorization');

    if (!auth) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    const credentials = Users.getCredentials(auth);

    const user = await Users.createUser(credentials[0], credentials[1]);
    user.token = Users.createJwt(user.id);
    delete user.password;

    res.status(HttpStatus.CREATED).json(user);
  } catch (e) {
    Logger.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.post('/auth', async (req, res) => {
  try {
    const token = req.get('authorization');

    if (!token) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    const credentials = Users.getCredentials(token);
    const result = await Users.authenticateUser(credentials[0], credentials[1]);

    if (result && result.user && !result.user.deleted) {
      delete result.user.password;
      res.json(result);
    } else {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  } catch (e) {
    Logger.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.get('/:id', Auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.getUser(userId);

    if (!user || user.deleted) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return
    }

    delete user.password;

    res.json(user);
  } catch (e) {
    Logger.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.delete('/:id', Auth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId !== req.token.id) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    await Users.deleteUser(userId);

    res.sendStatus(HttpStatus.OK);
  } catch (e) {
    Logger.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.get('/:id/bookboxes', Auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await BookBox.getBookBoxesByUser(userId);
    res.json(result);
  } catch (e) {
    Logger.error(e);
    if (e.name === 'TokenExpiredError') {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

Router.get('/:id/favorites', Auth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId !== req.token.id) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    const result = await BookBox.getFavoritesbyUser(userId);
    res.json(result);
  } catch (e) {
    Logger.error(e);
    if (e.name === 'TokenExpiredError') {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

Router.post('/:id/favorites', Auth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId !== req.token.id) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    const result = await BookBox.getFavoritesbyUser(userId);
    res.json(result);
  } catch (e) {
    Logger.error(e);
    if (e.name === 'TokenExpiredError') {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

module.exports = Router;
