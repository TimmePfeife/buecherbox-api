const Multer = require('multer');
const Path = require('path');

const fileFilter = (req, file, cb) => {
  const allowedFiles = ['.jpg', '.png'];

  const ext = Path.extname(file.originalname).toLowerCase();

  file.ext = ext;

  // TODO: Logging
  if (allowedFiles.includes(ext)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const options = {
  dest: process.env.UPLOAD_DIR,
  limits: {
    fileSize: process.env.UPLOAD_SIZE * 1024 * 1024
  },
  fileFilter,
  storage: Multer.memoryStorage()
};

module.exports = Multer(options);
