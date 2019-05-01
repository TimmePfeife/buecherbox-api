const Express = require('express');
const Log = require('../middleware/log');

const UsersRoute = require('./users.route');
const BookBoxRoute = require('./bookbox.route');

const Router = Express.Router();

Router.use(Log);

Router.use('/users', UsersRoute);
Router.use('/bookboxes', BookBoxRoute);

module.exports = Router;
