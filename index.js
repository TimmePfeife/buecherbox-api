const BodyParser = require('body-parser');
const Config = require('config');
const Cors = require('cors');
const Express = require('express');
const Helmet = require('helmet');
const Logger = require('./src/lib/logger');
const Routes = require('./src/routes');

const port = Config.server.port || 3000;

const App = Express();

App.use(Cors());
App.use(Helmet());

App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
  extended: true
}));

App.use(Routes);

App.listen(port, () => Logger.info(`Server started on port ${port}`));

module.exports = App;
