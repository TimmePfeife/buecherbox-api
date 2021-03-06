const Config = require('../../config');
const { checkFileType } = require('../lib/images');
const Multer = require('multer');
const Path = require('path');

/**
 * Allows only allowed file extensions for upload.
 * @param req
 * @param file
 * @param cb
 */
const fileFilter = (req, file, cb) => {
  // TODO: Logging
  if (checkFileType(file)) {
    file.ext = Path.extname(file.originalname).toLowerCase();
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const options = {
  dest: Config.upload.dir,
  limits: {
    fileSize: Config.upload.size * 1024 * 1024
  },
  fileFilter,
  storage: Multer.memoryStorage()
};

module.exports = Multer(options);
