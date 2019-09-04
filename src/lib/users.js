const Argon = require('argon2');
const Db = require('./db');
const Jwt = require('jsonwebtoken');

/**
 * Extracts username and password from a given basic authentication header.
 * @param {string} auth
 * @returns {string[]}
 */
function getCredentials (auth) {
  if (!auth) return null;

  const header = auth.split(' ');

  if (header[0].toLowerCase() !== 'basic') return null;

  const token = header[1];
  return Buffer.from(token, 'base64').toString('ascii').split(':');
}

/**
 * Extracts and verifies a json web token from a given bearer authentication header.
 * @param {string} jwt
 * @returns {null|*}
 */
function authenticateJwt (jwt) {
  if (!jwt) return null;

  const header = jwt.split(' ');

  if (header[0].toLowerCase() !== 'bearer') return null;

  const token = header[1];
  return Jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Creates a new json web token.
 * @param {number} userId
 * @returns {string|*}
 */
function createJwt (userId) {
  if (!userId) return '';

  const payload = {
    timestamp: Math.round((new Date()).getTime() / 1000),
    id: userId
  };

  return Jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 });
}

/**
 * Creates a hashed password.
 * @param {string} password
 * @returns {Promise<string>}
 */
async function hashPassword (password) {
  return Argon.hash(password);
}

/**
 * Verifies a hashed password.
 * @param {string} hash
 * @param {string} password
 * @returns {Promise<boolean>}
 */
async function verifyPassword (hash, password) {
  return Argon.verify(hash, password);
}

/**
 * Authenticates a user by his username and password. Creates a json web token
 * if the user is registered.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<null|{user: null, token: (string|*|string)}>}
 */
async function authenticateUser (username, password) {
  const sql = `SELECT *
               FROM Users
               WHERE username = $1`;

  const binds = [
    username
  ];

  const result = await Db.query(sql, binds);

  if (!result.rows.length) return null;

  const user = result.rows.length ? result.rows[0] : null;
  if (!user) return null;

  const valid = await verifyPassword(user.password, password);
  if (!valid) return null;

  const token = user ? createJwt(user.id) : '';

  return {
    user,
    token
  };
}

/**
 * Authenticates a user by his user id and password. Creates a json web token
 * if the user is registered.
 * @param {number} userId
 * @param {string} password
 * @returns {Promise<{user: null, token: (string|*|string)}>}
 */
async function authenticateUserById (userId, password) {
  let sql = `SELECT *
             FROM Users
             WHERE id = $1`;

  let binds = [
    userId
  ];

  const result = await Db.query(sql, binds);

  if (!result.rows.length) return null;

  const user = result.rows.length ? result.rows[0] : null;
  if (!user) return null;

  console.log(password);

  const valid = await verifyPassword(user.password, password);
  if (!valid) return null;

  const token = user ? createJwt(user.id) : '';

  return {
    user,
    token
  };
}

/**
 * Inserts a new user into the database and returns  the result.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<null>}
 */
async function createUser (username, password) {
  if (!username || !password) return null;

  const sql = `INSERT INTO Users (username, password)
               VALUES ($1, $2) RETURNING *`;

  const hash = await hashPassword(password);
  if (!hash) return null;

  const binds = [
    username,
    hash
  ];

  const result = await Db.query(sql, binds);
  return result.rows.length ? result.rows[0] : null;
}

/**
 * Selects an user by an id.
 * @param {number} userId
 * @returns {Promise<null>}
 */
async function getUser (userId) {
  const sql = `SELECT *
               from Users
               where id = $1`;

  const binds = [
    userId
  ];

  const result = await Db.query(sql, binds);

  return result.rows.length ? result.rows[0] : null;
}

/**
 * Delets an user by an id.
 * @param {number} userId
 * @returns {Promise<null>}
 */
async function deleteUser (userId) {
  const sql = `UPDATE users
               SET deleted = true
               WHERE id = $1`;

  const binds = [
    userId
  ];

  await Db.query(sql, binds);
}

/**
 * Inserts a new favorite bookbox for an user into the database.
 * @param {number} userId
 * @param {number} bookboxId
 * @returns {Promise<null>}
 */
async function addFavorite (userId, bookboxId) {
  const sql = `INSERT INTO favorites (userid, bookboxid)
               VALUES ($1, $2) RETURNING *`;

  const binds = [
    userId,
    bookboxId
  ];

  const result = await Db.query(sql, binds);

  return result.rows.length ? result.rows[0] : null;
}

/**
 * Deletes an users favorite bookbox from the database.
 * @param userId
 * @param bookboxId
 * @returns {Promise<void>}
 */
async function deleteFavorite (userId, bookboxId) {
  const sql = `DELETE
               FROM favorites
               WHERE userid = $1
                 AND bookboxid = $2`;

  const binds = [
    userId,
    bookboxId
  ];

  await Db.query(sql, binds);
}

/**
 * Deletes an users favorite bookbox from the database.
 * @param {number} id
 * @returns {Promise<void>}
 */
async function deleteFavoriteById (id) {
  const sql = `DELETE
               FROM favorites
               WHERE id = $1`;

  const binds = [
    id
  ];

  await Db.query(sql, binds);
}

/**
 * Selects all favorite bookboxes by an user from the database.
 * @param {number} userId
 * @returns {Promise<*>}
 */
async function getFavorites (userId) {
  const sql = `SELECT *
               from favorites
               where userid = $1`;

  const binds = [
    userId
  ];

  const result = await Db.query(sql, binds);

  return result.rows;
}

/**
 * Sets the last logon of the user in the database.
 * @param userId
 * @returns {Promise<void>}
 */
async function setUserLastLogin (userId) {
  const sql = `UPDATE users
               SET last_login = current_timestamp
               WHERE id = $1`;

  const binds = [
    userId
  ];

  await Db.query(sql, binds);
}

/**
 * Selects user favorite by userid and bookboxid from the database.
 * @param {number} userId
 * @param {number} bookboxId
 * @returns {Promise<*>}
 */
async function getFavorite (userId, bookboxId) {
  const sql = `SELECT *
               from favorites
               where userid = $1 AND bookboxid = $2`;

  const binds = [
    userId,
    bookboxId
  ];

  const result = await Db.query(sql, binds);

  return result.rows.length ? result.rows[0] : null;
}

/**
 * Changes the password of user by his user id in the database.
 * @param userId
 * @param newPassword
 * @returns {Promise<void>}
 */
async function changePassword (userId, newPassword) {
  if (!userId || !newPassword) return null;

  const sql = `UPDATE Users
         SET password = $1,
             updated  = current_timestamp
         WHERE id = $2`;

  const hash = await hashPassword(newPassword);
  if (!hash) return null;

  const binds = [
    hash,
    userId
  ];

  await Db.query(sql, binds);
}

module.exports = {
  authenticateJwt,
  createJwt,
  authenticateUser,
  authenticateUserById,
  createUser,
  getCredentials,
  getUser,
  deleteUser,
  addFavorite,
  deleteFavoriteById,
  deleteFavorite,
  getFavorites,
  getFavorite,
  setUserLastLogin,
  changePassword
};
