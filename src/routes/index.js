const Express = require('express');
const Log = require('../middleware/log');

const BookBoxRoute = require('./bookbox.route');
const DashboardRoute = require('./dashboard.route');
const ImagesRoute = require('./images.route');
const UsersRoute = require('./users.route');

const Router = Express.Router();

Router.use(Log);

Router.use('/bookboxes', BookBoxRoute);
Router.use('/dashboard', DashboardRoute);
Router.use('/images', ImagesRoute);
Router.use('/users', UsersRoute);

module.exports = Router;
