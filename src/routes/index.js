const Express = require('express');
const Log = require('../middleware/log');

const UsersRoute = require('./users.route');
const BookBoxRoute = require('./bookbox.route');
const ImagesRoute = require('./images.route');

const Router = Express.Router();

Router.use(Log);

Router.use('/users', UsersRoute);
Router.use('/bookboxes', BookBoxRoute);
Router.use('/images', ImagesRoute);

module.exports = Router;
