require('dotenv')
  .config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
  });

const App = require('../index');
const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');
const ChaiHttp = require('chai-http');
const Db = require('../src/lib/db');
const Data = require('./resources/data');

Chai.use(ChaiAsPromised);
Chai.use(ChaiHttp);

Chai.agent = Chai.request.agent(App);

before(async () => {
  await Db.query(Db.sqlScripts['drop_tables.sql']);

  await Db.query(Db.sqlScripts['create_roles.sql']);
  await Db.query(Db.sqlScripts['create_users.sql']);
  await Db.query(Db.sqlScripts['create_tokens.sql']);
  await Db.query(Db.sqlScripts['create_images.sql']);
  await Db.query(Db.sqlScripts['create_bookboxes.sql']);
  await Db.query(Db.sqlScripts['create_favorites.sql']);

  await Data.init();
});
