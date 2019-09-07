const Crypto = require('crypto');
const Db = require('../lib/db');
const FileType = require('file-type');
const Fs = require('fs');
const Jimp = require('jimp');
const Path = require('path');

function checkFileType (file) {
  if (!file) return false;

  let mimetype = file.mimetype;

  if (file.buffer) {
    const type = FileType(file.buffer);
    mimetype = type.mime;
  }
  const allowedFiles = ['image/jpeg', 'image/png'];
  return allowedFiles.includes(mimetype);
}

/**
 * Generates a random filename for a given image.
 * @param {object} file
 * @returns {string}
 */
function generateFilename (file) {
  const bytes = Crypto.randomBytes(32);
  const checksum = Crypto.createHash('sha256')
    .update(bytes)
    .digest('hex');
  return checksum + file.ext;
}

/**
 * Generates the filename and thumbnail of a given image
 * and inserts the information into the database.
 * @param {object} file
 * @returns {Promise<null|Promise<null>>}
 */
async function save (file) {
  if (!file) return null;

  const filename = generateFilename(file);
  file.filename = filename;

  let path = process.env.UPLOAD_DIR;
  if (!Fs.existsSync(path)) {
    Fs.mkdirSync(path, { recursive: true });
  }

  path = Path.join(process.env.UPLOAD_DIR, filename);
  await Fs.writeFileSync(path, file.buffer);
  file.path = path;

  await saveThumbnail(file);

  return createImage(file);
}

/**
 * Generates a thumbnail for a given file.
 * @param {object} file
 * @returns {Promise<void>}
 */
async function saveThumbnail (file) {
  let path = Path.join(process.env.UPLOAD_DIR, 'thumbnail');
  if (!Fs.existsSync(path)) {
    Fs.mkdirSync(path, { recursive: true });
  }

  path = Path.join(process.env.UPLOAD_DIR, 'thumbnail', file.filename);

  const image = await Jimp.read(file.path);

  await image.resize(Jimp.AUTO, 200);
  await image.write(path);

  file.thumbnail = path;
}

/**
 * Inserts a new image into the database and returns the reult.
 * @param {image} file
 * @returns {Promise<null>}
 */
async function createImage (file) {
  const sql = `INSERT INTO images(filename,
                                  mimetype,
                                  destination,
                                  path,
                                  size,
                                  thumbnail)
               VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;

  const binds = [
    file.filename,
    file.mimetype,
    process.env.UPLOAD_DIR,
    file.path,
    file.size,
    file.thumbnail
  ];

  const result = await Db.query(sql, binds);
  return result.rows.length ? result.rows[0] : null;
}

/**
 * Selects a image from the database.
 * @param {number} imageId
 * @returns {Promise<null>}
 */
async function getImage (imageId) {
  const sql = `SELECT * FROM images WHERE id = $1`;

  const binds = [imageId];

  const result = await Db.query(sql, binds);

  return result.rows.length ? result.rows[0] : null;
}

module.exports = {
  checkFileType,
  save,
  getImage
};
