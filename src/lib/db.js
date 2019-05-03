const Fs = require('fs');
const Path = require('path');
const Pool = require('pg').Pool;

const sql = {};
const sqlDir = 'sql';
const ignore = ['init_postgres.sql'];

function readSql () {
  const scripts = Fs.readdirSync(sqlDir);
  for (let i = 0; i < scripts.length; i++) {
    const sqlFile = scripts[i];

    if (ignore.includes(sqlFile)) continue;

    const path = Path.join(sqlDir, sqlFile);
    sql[sqlFile] = Fs.readFileSync(path).toString();
  }
}

const _pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

readSql();

_pool.sqlScripts = sql;
_pool.sqlDir = sqlDir;
_pool.sqlIgnore = ignore;

module.exports = _pool;
