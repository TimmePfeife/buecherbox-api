const BookBox = require('../lib/bookbox');
const Express = require('express');

const Router = Express.Router();

const INTERNAL_SERVER_ERROR = 500;

Router.get('/', async (req, res) => {
  try {
    const result = await BookBox.getBookBoxes();
    res.json(result);
  } catch (e) {
    res.sendStatus(INTERNAL_SERVER_ERROR );
  }
});

Router.post('/', async (req, res) => {
  try {
    await BookBox.createBookBox(req.body);
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(INTERNAL_SERVER_ERROR)
  }
});

module.exports = Router;
