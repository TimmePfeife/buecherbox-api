const BodyParser = require('body-parser');
const Cors = require('cors');
const Express = require('express');
const Routes = require('./src/routes');

require('dotenv').config();

const port = process.env.PORT || 3000;

const App = Express();

App.use(Cors());

App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
  extended: true
}));

App.use(Routes);

App.listen(port, () => console.log(`Server started on port ${port}`));
