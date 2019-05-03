require('dotenv')
  .config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
  });

const Db = require('../src/lib/db');
const Fs = require('fs');
const Path = require('path');

const sql = {};
const sqlDir = 'sql';
const ignore = ['init_postgres.sql'];

before(async () => {
  const scripts = Fs.readdirSync(sqlDir);
  for (let i = 0; i < scripts.length; i++) {
    const sqlFile = scripts[i];

    if (ignore.includes(sqlFile)) continue;

    const path = Path.join(sqlDir, sqlFile);
    sql[sqlFile] = Fs.readFileSync(path).toString();
  }

  await Db.query(sql['drop_tables.sql']);

  await Db.query(sql['create_users.sql']);
  await Db.query(sql['create_images.sql']);
  await Db.query(sql['create_bookboxes.sql']);
  await Db.query(sql['create_favorites.sql']);

  await Db.query(sql['init_testdata.sql']);
});
