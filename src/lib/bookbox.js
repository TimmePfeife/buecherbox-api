const Db = require('./db');

async function getBookBoxes() {
  const result = await Db.query('SELECT * FROM bookboxes');
  return result.rows;
}

module.exports = {
  getBookBoxes
};
