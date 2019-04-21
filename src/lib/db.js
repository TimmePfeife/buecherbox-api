const Config = require('../config/database');
const Pool = require('pg').Pool;

module.exports = new Pool(Config);
