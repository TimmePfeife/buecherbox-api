const Db = require('./db');

/**
 * Selects all existing bookboxes from the database.
 * @returns {Promise<*>}
 */
async function getBookBoxes () {
  const sql = 'SELECT * FROM dashboard_bookboxes_view ORDER BY id';
  const result = await Db.query(sql);
  return result.rows;
}

/**
 * Selects all existing bookboxes from the database.
 * @returns {Promise<*>}
 */
async function getUsers () {
  const sql = 'SELECT * FROM dashboard_users_view ORDER BY id';
  const result = await Db.query(sql);
  return result.rows;
}

module.exports = {
  getBookBoxes,
  getUsers
};
