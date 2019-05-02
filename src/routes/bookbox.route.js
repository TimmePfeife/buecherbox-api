const Auth = require('../middleware/auth');
const BookBox = require('../lib/bookbox');
const Express = require('express');
const HttpStatus = require('http-status-codes');
const Images = require('../lib/images');
const Logger = require('../lib/logger');
const Upload = require('../middleware/upload');
const Users = require('../lib/users');

const Router = Express.Router();

Router.get('/', async (req, res) => {
  try {
    const result = await BookBox.getBookBoxes();
    res.json(result);
  } catch (e) {
    Logger.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.post('/', Auth, Upload.single('file'), async (req, res) => {
  try {
    const image = await Images.save(req.file);
    // const result = await BookBox.createBookBox(req.body);
    const result = {};
    res.status(HttpStatus.CREATED).json(result);
  } catch (e) {
    Logger.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

Router.get('/user/:id', Auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await BookBox.getBookBoxesByUser(userId);

    res.json(result);
  } catch (e) {
    Logger.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

module.exports = Router;
