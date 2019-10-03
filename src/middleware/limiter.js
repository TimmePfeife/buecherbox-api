const Config = require('../../config');
const Limiter = require('express-rate-limit');
const RedisLimiter = require('rate-limit-redis');

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

/**
 * Middleware to limit repeated requests to an endpoint.
 */
module.exports = (max) => Limiter({
  store: new RedisLimiter({}),
  windowMs: Config.limits.timeout,
  max: max
});
