const Express = require('express');

const BookBoxRoute = require('./bookbox.route');

const Router = Express.Router();

Router.use('/bookboxes', BookBoxRoute);

module.exports = Router;
