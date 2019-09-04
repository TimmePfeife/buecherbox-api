const Auth = require('../middleware/auth');
const BookBox = require('../lib/bookbox');
const Express = require('express');
const HttpStatus = require('http-status-codes');
const Logger = require('../lib/logger');
const Users = require('../lib/users');
const Validation = require('../middleware/validation');

const Router = Express.Router();

Router.post('/', Validation('users'), async (req, res) => {
  try {
    const user = await Users.createUser(req.body.username, req.body.password);
    user.token = Users.createJwt(user.id);
    delete user.password;

    res.status(HttpStatus.CREATED).json(user);
  } catch (e) {
    Logger.error(e);
    // User already exists
    if (parseInt(e.code) === 23505) {
      res.sendStatus(HttpStatus.CONFLICT);
      return;
    }

    Logger.error('Could not create user', e);
    if (parseInt(e.code) === 23505) {
      res.sendStatus(HttpStatus.CONFLICT);
      return;
    }
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
      await Users.setUserLastLogin(result.user.id);
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

Router.post('/:id/favorites', Auth, Validation('favorites'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId !== req.token.id) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }
    const bookboxId = req.body.bookboxId;

    let favorite = await Users.getFavorite(userId, bookboxId);
    if (favorite) {
      res.status(HttpStatus.SEE_OTHER).json(favorite);
      return;
    }

    favorite = await Users.addFavorite(userId, bookboxId);
    res.status(HttpStatus.CREATED).json(favorite);
  } catch (e) {
    Logger.error(e);
    if (e.name === 'TokenExpiredError') {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

Router.delete('/:id/favorites', Auth, Validation('favorites'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId !== req.token.id) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }
    const bookboxId = req.body.bookboxId;

    await Users.deleteFavorite(userId, bookboxId);
    res.sendStatus(HttpStatus.OK);
  } catch (e) {
    Logger.error(e);
    if (e.name === 'TokenExpiredError') {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

Router.delete('/:id/favorites/:bookbox', Auth, Validation('favorites'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const bookboxId = parseInt(req.params.bookbox);

    if (userId !== req.token.id) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    await Users.deleteFavorite(userId, bookboxId);
    res.sendStatus(HttpStatus.OK);
  } catch (e) {
    Logger.error(e);
    if (e.name === 'TokenExpiredError') {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

Router.post('/:id/password', Auth, Validation('password'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId !== req.token.id) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    const auth = await Users.authenticateUserById(userId, req.body.oldPassword);
    if (!auth) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    await Users.changePassword(userId, req.body.newPassword);

    res.sendStatus(HttpStatus.OK);
  } catch (e) {
    Logger.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

module.exports = Router;
