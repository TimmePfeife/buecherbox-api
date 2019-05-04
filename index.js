require('dotenv').config();

const BodyParser = require('body-parser');
const Cors = require('cors');
const Express = require('express');
const Logger = require('./src/lib/logger');
const Routes = require('./src/routes');

const port = process.env.PORT || 3000;

const App = Express();

App.use(Cors());

App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
  extended: true
}));

App.use(Routes);

App.listen(port, () => Logger.info(`Server started on port ${port}`));

module.exports = App;
