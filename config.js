module.exports = {
  environment: process.env.NODE_ENV,

  server: {
    port: process.env.PORT
  },

  logs: {
    dir: process.env.LOG_DIR,
    name: process.env.LOG_NAME
  },

  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  },

  token: {
    secret: process.env.JWT_SECRET
  },

  upload: {
    dir: process.env.UPLOAD_DIR,
    size: process.env.UPLOAD_SIZE
  },

  limits: {
    standard: 100,
    critical: 5,
    timeout: 1 * 60 * 1000 // 1 minute
  }
};
