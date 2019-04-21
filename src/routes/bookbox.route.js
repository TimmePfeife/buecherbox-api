const BookBox = require('../lib/bookbox');
const Express = require('express');

const Router = Express.Router();

Router.get('/', async (req, res) => {
  try {
    const result = await BookBox.getBookBoxes();
    res.json(result);
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = Router;
