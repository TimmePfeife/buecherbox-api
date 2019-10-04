const Auth = require('../middleware/auth');
const Config = require('../../config');
const BookBox = require('../lib/bookbox');
const Express = require('express');
const HttpStatus = require('http-status-codes');
const Limiter = require('../middleware/limiter');
const Logger = require('../lib/logger');
const Users = require('../lib/users');
const Validation = require('../middleware/validation');

const Router = Express.Router();

Router.post('/', Limiter(Config.limits.critical), Validation('users'), async (req, res) => {
  try {
    const user = await Users.createUser(req.body.email, req.body.username, req.body.password);
    if (!user) {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    const role = await Users.getRoleById(user.roleid);
    if (!role) {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    user.token = Users.createJwt({
      id: user.id,
      role: role.name
    });

    delete user.password;

    res.status(HttpStatus.CREATED).json(user);
  } catch (e) {
    Logger.error('Could not create user', e);
    // User already exists
    if (parseInt(e.code) === 23505) {
      res.sendStatus(HttpStatus.CONFLICT);
      return;
    }

    if (parseInt(e.code) === 23505) {
      res.sendStatus(HttpStatus.CONFLICT);
      return;
    }
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.post('/auth', Limiter(Config.limits.critical), async (req, res) => {
  try {
    const auth = req.get('authorization');
    if (!auth) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
    }

    const credentials = Users.getCredentials(auth);
    const username = credentials[0];
    const password = credentials[1];

    const user = await Users.getUserByUsernameOrEmail(username);
    if (!user || user.deleted) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    const valid = await Users.verifyPassword(user.password, password);
    if (!valid) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    const role = await Users.getRoleById(user.roleid);
    if (!role) {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    const token = Users.createJwt({
      id: user.id,
      role: role.name
    });

    const refreshToken = await Users.createRefreshToken(user.id, '1 day');

    await Users.setUserLastLogin(user.id);

    delete user.password;

    res.json({
      user,
      token,
      refreshToken
    });
  } catch (e) {
    Logger.error('Could not authenticate user', e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.post('/:id/refresh', Limiter(Config.limits.critical), async (req, res) => {
  try {
    const auth = req.get('authorization');
    if (!auth) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const refreshToken = Users.getRefreshToken(auth);
    const userId = req.params.id;

    if (!await Users.checkRefreshToken(userId, refreshToken)) {
      return res.sendStatus(HttpStatus.FORBIDDEN);
    }

    const user = await Users.getUserById(userId);
    if (!user) {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    const role = await Users.getRoleById(user.roleid);
    if (!role) {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    const result = {
      token: await Users.createJwt({
        id: user.id,
        role: role.name
      })
    };

    res.json(result);
  } catch (e) {
    Logger.error('Could not refresh token', e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

// ToDo Router.post('/revoke')

Router.get('/:id', Limiter(Config.limits.standard), Auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.getUserById(userId);

    if (!user || user.deleted) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return
    }

    delete user.password;

    res.json(user);
  } catch (e) {
    Logger.error('Could not get user', e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.delete('/:id', Auth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (userId !== req.token.id) {
      res.sendStatus(HttpStatus.FORBIDDEN);
      return;
    }

    await Users.deleteUser(userId);

    res.sendStatus(HttpStatus.OK);
  } catch (e) {
    Logger.error('Could not delete user', e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.get('/:id/bookboxes', Auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await BookBox.getBookBoxesByUser(userId);
    res.json(result);
  } catch (e) {
    Logger.error('Could not get created bookboxes from a user', e);
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
    Logger.error('Could not get favorites from a user', e);
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
    Logger.error('Could not add a user favorite', e);

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
    Logger.error('Could not delete a user favorite', e);
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
    Logger.error('Could not change user password', e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

module.exports = Router;
