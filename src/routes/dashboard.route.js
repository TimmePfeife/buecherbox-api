const Auth = require('../middleware/auth');
const Dashboard = require('../lib/dashboard');
const Express = require('express');
const HttpStatus = require('http-status-codes');
const Logger = require('../lib/logger');

const Router = Express.Router();

// ToDo introduce admin right + check

Router.get('/bookboxes', Auth, async (req, res) => {
  try {
    const result = await Dashboard.getBookBoxes();
    res.json(result);
  } catch (e) {
    Logger.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

Router.get('/users', Auth, async (req, res) => {
  try {
    const result = await Dashboard.getUsers();
    res.json(result);
  } catch (e) {
    Logger.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

module.exports = Router;
