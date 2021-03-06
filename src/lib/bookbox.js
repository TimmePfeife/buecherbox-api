const Db = require('./db');

/**
 * Selects an existing bookboxes by a given id from the database.
 * @returns {Promise<*>}
 */
async function getBookBox (id) {
  const sql = 'SELECT * FROM bookboxes WHERE id = $1';
  const result = await Db.query(sql, [id]);
  return result.rows.length ? result.rows[0] : null;
}

/**
 * Selects all existing bookboxes from the database.
 * @returns {Promise<*>}
 */
async function getBookBoxes () {
  const sql = 'SELECT * FROM bookboxes ORDER BY id';
  const result = await Db.query(sql);
  return result.rows;
}

/**
 * Inserts a new bookbox into the database and returns the reult.
 * @param {object} bookBox
 * @param {object} image
 * @returns {Promise<null>}
 */
async function createBookBox (bookBox, image) {
  if (!bookBox) return null;

  const sql = `INSERT INTO bookboxes (userid, imgid, description, location, lat, lng, hint)
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

  const binds = [
    bookBox.userid,
    image ? image.id : null,
    bookBox.description,
    bookBox.location,
    bookBox.lat,
    bookBox.lng,
    bookBox.hint
  ];

  const result = await Db.query(sql, binds);
  return result.rows.length ? result.rows[0] : null;
}

async function updateBookBox (bookBox) {
  if (!bookBox) return null;

  const sql = `UPDATE BookBoxes
               SET description = $1,
                   imgid       = $2,
                   hint        = $3,
                   updated     = current_timestamp
               WHERE id = $4 RETURNING *`;

  const binds = [
    bookBox.description,
    bookBox.imgid,
    bookBox.hint,
    bookBox.id
  ];

  const result = await Db.query(sql, binds);
  return result.rows.length ? result.rows[0] : null;
}

/**
 * Selects all bookboxes created by a given user from the database.
 * @param {number} userId
 * @returns {Promise<*>}
 */
async function getBookBoxesByUser (userId) {
  const sql = `SELECT *
               FROM bookboxes
               WHERE userid = $1`;
  const binds = [userId];
  const result = await Db.query(sql, binds);
  return result.rows;
}

/**
 * Selects all favorite bookboxes by a given user from the database.
 * @param {number} userId
 * @returns {Promise<*>}
 */
async function getFavoritesbyUser (userId) {
  const sql = `SELECT *
               FROM bookboxes
               WHERE id IN (SELECT bookboxid FROM favorites WHERE userid = $1)`;

  const binds = [userId];
  const result = await Db.query(sql, binds);
  return result.rows;
}

module.exports = {
  createBookBox,
  getBookBox,
  getBookBoxes,
  getBookBoxesByUser,
  getFavoritesbyUser,
  updateBookBox
};
