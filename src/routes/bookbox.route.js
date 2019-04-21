const Users = require('../lib/users');
const BookBox = require('../lib/bookbox');
const Express = require('express');
const HttpStatus = require('http-status-codes');

const Router = Express.Router();


Router.get('/', async (req, res) => {
  try {
    const result = await BookBox.getBookBoxes();
    res.json(result);
  } catch (e) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR );
  }
});

Router.post('/', async (req, res) => {
  try {
    const auth = req.get("authorization");

    if (!auth || !Users.authenticateJwt(auth)) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    const result = await BookBox.createBookBox(req.body);
    res.json(result).sendStatus(HttpStatus.CREATED);
  } catch (e) {
    console.log(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

Router.get('/user/:id', async (req, res) => {
  try {
    const auth = req.get("authorization");
    const userId = req.params.id;

    const user = Users.authenticateJwt(auth);

    if (!auth || !user) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    const result = await BookBox.getBookBoxesByUser(userId);

    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

module.exports = Router;
