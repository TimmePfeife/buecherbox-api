const Db = require('./db');

async function getBookBoxes() {
  const sql = 'SELECT * FROM bookboxes';
  const result = await Db.query(sql);
  return result.rows;
}

async function createBookBox(bookBox) {
  const sql = `INSERT INTO bookboxes (userid, description, location, lat, lng, imgsrc, hint)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`;

  const binds = [
    bookBox.userid,
    bookBox.description,
    bookBox.location,
    bookBox.lat,
    bookBox.lng,
    bookBox.imgsrc,
    bookBox.hint
  ];

  await Db.query(sql, binds);
}

module.exports = {
  getBookBoxes,
  createBookBox
};
