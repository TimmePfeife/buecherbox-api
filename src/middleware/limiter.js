const Limiter = require('express-rate-limit');
const RedisLimiter = require('rate-limit-redis');

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

/**
 * Middleware to limit repeated requests to an endpoint.
 */
module.exports = Limiter({
  store: new RedisLimiter({}),
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5
});
