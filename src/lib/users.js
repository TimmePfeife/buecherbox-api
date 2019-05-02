const Db = require('./db');
const Jwt = require('jsonwebtoken');

function getCredentials (auth) {
  const token = auth.split(' ')[1];
  return Buffer.from(token, 'base64').toString('ascii').split(':');
}

function authenticateJwt (jwt) {
  if (!jwt) return null;
  const token = jwt.split(' ')[1];
  return Jwt.verify(token, process.env.JWT_SECRET);
}

function createJwt (userId) {
  const payload = {
    timestamp: Math.round((new Date()).getTime() / 1000),
    id: userId
  };

  return Jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 });
}

async function authenticateUser (username, password) {
  const sql = `SELECT *
               FROM Users
               WHERE username = $1
                 AND password = crypt($2, password)`;

  const binds = [
    username,
    password
  ];

  const result = await Db.query(sql, binds);

  if (!result.rows.length) return null;

  const user = result.rows.length ? result.rows[0] : null;
  const token = user ? createJwt(user.id) : '';

  return {
    user,
    token
  };
}

async function createUser (user, credentials) {
  const sql = `INSERT INTO Users (username, password)
               VALUES ($1, crypt($2, gen_salt('bf'))) RETURNING *`;

  const binds = [
    credentials[0],
    credentials[1]
  ];

  const result = await Db.query(sql, binds);
  return result.rows[0];
}

async function getUser (userId) {
  const sql = `SELECT * from Users where id = $1`;

  const binds = [
    userId
  ];

  const result = await Db.query(sql, binds);

  return result.rows.length ? result.rows[0] : null;
}

async function deleteUser (userId) {
  const sql = `UPDATE users SET deleted = true WHERE id = $1`;

  const binds = [
    userId
  ];

  await Db.query(sql, binds);
}

module.exports = {
  authenticateJwt,
  createJwt,
  authenticateUser,
  createUser,
  getCredentials,
  getUser,
  deleteUser
};
