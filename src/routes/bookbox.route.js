const Auth = require('../middleware/auth');
const BookBox = require('../lib/bookbox');
const Express = require('express');
const HttpStatus = require('http-status-codes');
const Images = require('../lib/images');
const Logger = require('../lib/logger');
const Upload = require('../middleware/upload');
const Validation = require('../middleware/validation');

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

Router.post('/', Auth, Upload.single('file'), Validation('bookbox'), async (req, res) => {
  try {
    if (req.file && !Images.checkFileType(req.file)) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const image = await Images.save(req.file);
    const result = await BookBox.createBookBox(req.body, image);
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

Router.put('/:id', Auth, Upload.single('file'), async (req, res) => {
  try {
    const bookboxId = req.params.id;

    const bookbox = await BookBox.getBookBox(bookboxId);

    if (bookbox.userid !== req.token.id) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    if (!bookbox) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    const image = await Images.save(req.file);

    bookbox.description = req.body.description || bookbox.description;
    bookbox.hint = req.body.hint || bookbox.hint;
    bookbox.imgid = image ? image.id : bookbox.imgid;

    const result = await BookBox.updateBookBox(bookbox);

    res.status(HttpStatus.OK).json(result);
  } catch (e) {
    Logger.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

module.exports = Router;
