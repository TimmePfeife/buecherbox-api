const Express = require('express');

const UsersRoute = require('./users.route');
const BookBoxRoute = require('./bookbox.route');

const Router = Express.Router();

Router.use('/users', UsersRoute);
Router.use('/bookboxes', BookBoxRoute);

module.exports = Router;
