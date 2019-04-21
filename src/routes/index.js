const Express = require('express');

const AuthRoute = require('./auth.route');
const BookBoxRoute = require('./bookbox.route');

const Router = Express.Router();

Router.use('/auth', AuthRoute);
Router.use('/bookboxes', BookBoxRoute);

module.exports = Router;
