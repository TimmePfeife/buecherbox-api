const Auth = require('../middleware/auth');
const Users = require('../lib/users');
const BookBox = require('../lib/bookbox');
const Express = require('express');
const HttpStatus = require('http-status-codes');
const Multer = require('multer');

const Router = Express.Router();

const Upload = Multer({ dest: 'uploads/' });

Router.get('/', async (req, res) => {
  try {
    const result = await BookBox.getBookBoxes();
    res.json(result);
  } catch (e) {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.post('/', Auth, Upload.single('file'), async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.body.lng);
    // const result = await BookBox.createBookBox(req.body);
    const result = {};
    res.status(HttpStatus.CREATED).json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

Router.get('/user/:id', Auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await BookBox.getBookBoxesByUser(userId);

    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  }
});

module.exports = Router;
