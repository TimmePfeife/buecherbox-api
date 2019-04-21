const Auth = require('../lib/auth');
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

    if (!auth || !Auth.authenticateJwt(auth)) {
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

module.exports = Router;
