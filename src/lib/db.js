const Config = require('../../config');
const Fs = require('fs');
const Path = require('path');
const Pool = require('pg').Pool;

const sql = {};
const sqlDir = 'sql';
const ignore = ['init_postgres.sql'];

/**
 * Reads the content of the sql scripts to use them later in code.
 * Ignores the files listet in {@link ignore}.
 */
function readSql () {
  const scripts = Fs.readdirSync(sqlDir);
  for (let i = 0; i < scripts.length; i++) {
    const sqlFile = scripts[i];

    if (ignore.includes(sqlFile)) continue;

    const path = Path.join(sqlDir, sqlFile);
    sql[sqlFile] = Fs.readFileSync(path).toString();
  }
}

const _pool = new Pool(Config.db);

readSql();

_pool.sqlScripts = sql;
_pool.sqlDir = sqlDir;
_pool.sqlIgnore = ignore;

module.exports = _pool;
