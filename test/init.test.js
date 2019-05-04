require('dotenv')
  .config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
  });

const Db = require('../src/lib/db');
const Data = require('./resources/data');

let init = false;

before(async () => {
  await Db.query(Db.sqlScripts['drop_tables.sql']);

  await Db.query(Db.sqlScripts['create_users.sql']);
  await Db.query(Db.sqlScripts['create_images.sql']);
  await Db.query(Db.sqlScripts['create_bookboxes.sql']);
  await Db.query(Db.sqlScripts['create_favorites.sql']);

  await Data.init();
  init = true;
});
