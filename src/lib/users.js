const Db = require('./db');
const Jwt = require('jsonwebtoken');
const Secret = require('../config/secret');

function authenticateJwt(jwt) {
  const token = jwt.split(" ")[1];
  return Jwt.verify(token, Secret.secret);
}

async function authenticateUser(username, password) {
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

  const token = Jwt.sign({}, Secret.secret, {expiresIn: 24 * 60 * 60});

  return {
    token
  };
}

async function createUser(user, credentials) {
  const sql = `INSERT INTO Users (username, email, password)
               VALUES ($1, $2, crypt($3, gen_salt('bf'))) RETURNING *`;

  const binds = [
    credentials[0],
    user.email,
    credentials[1]
  ];

  await Db.query(sql, binds);
}

function getCredentials(auth) {
  const token = auth.split(" ")[1];
  return Buffer.from(token, 'base64').toString('ascii').split(':');
}

module.exports = {
  authenticateJwt,
  authenticateUser,
  createUser,
  getCredentials
};
