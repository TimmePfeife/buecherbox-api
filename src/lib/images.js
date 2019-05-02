const Crypto = require('crypto');
const Db = require('../lib/db');
const Fs = require('fs');
const Jimp = require('jimp');
const Path = require('path');

function generateFilename (file) {
  const bytes = Crypto.randomBytes(32);
  const checksum = Crypto.createHash('sha256')
    .update(bytes)
    .digest('hex');
  return checksum + file.ext;
}

async function save (file) {
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

async function saveThumbnail (file) {
  let path = Path.join(process.env.UPLOAD_DIR, 'thumbnail');
  if (!Fs.existsSync(path)) {
    Fs.mkdirSync(path, { recursive: true });
  }

  path = Path.join(process.env.UPLOAD_DIR, 'thumbnail', file.filename);

  const image = await Jimp.read(file.path);

  await image.resize(200, 200);
  await image.write(path);

  file.thumbnail = path;
}

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

async function getImage (imageId) {
  const sql = `SELECT * FROM images WHERE id = $1`;

  const binds = [imageId];

  const result = await Db.query(sql, binds);

  return result.rows.length ? result.rows[0] : null;
}

module.exports = {
  save,
  getImage
};
