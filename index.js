const BodyParser = require('body-parser');
const Express = require('express');
const Routes = require('./src/routes');

const port = process.env.PORT || 3000;

const App = Express();

App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
  extended: true
}));

App.use(Routes);

App.listen(port, () => console.log(`Server started on port ${port}`));
