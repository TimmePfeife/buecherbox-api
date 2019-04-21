const Db = require('./db');

async function getBookBoxes() {
  const sql = 'SELECT * FROM bookboxes';
  const result = await Db.query(sql);
  return result.rows;
}

async function createBookBox(bookBox) {
  const sql = `INSERT INTO bookboxes (userid, description, location, lat, lng, imgsrc, hint)
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

  const binds = [
    bookBox.userid,
    bookBox.description,
    bookBox.location,
    bookBox.lat,
    bookBox.lng,
    bookBox.imgsrc,
    bookBox.hint
  ];

  const result = await Db.query(sql, binds);
  return result.rows.pop();
}

async function getBookBoxesByUser(userId) {
  const sql = `SELECT * FROM bookboxes WHERE userid = $1`;
  const binds = [userId];
  const result = await Db.query(sql, binds);
  return result.rows;
}

module.exports = {
  createBookBox,
  getBookBoxes,
  getBookBoxesByUser
};
