const Db = require('./db');

async function getBookBoxes () {
  const sql = 'SELECT * FROM bookboxes';
  const result = await Db.query(sql);
  return result.rows;
}

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

async function getBookBoxesByUser (userId) {
  const sql = `SELECT *
               FROM bookboxes
               WHERE userid = $1`;
  const binds = [userId];
  const result = await Db.query(sql, binds);
  return result.rows;
}

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
  getBookBoxes,
  getBookBoxesByUser,
  getFavoritesbyUser
};
