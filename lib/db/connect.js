const mongoose = require('mongoose');
const log = require('./../log')(module);
const config = require('./../config');

mongoose.connect(config.get('mongoose:uri'));

mongoose.connection.on('error', function (err) {
  log.error('connection error:', err.message);
});

mongoose.connection.once('open', function callback() {
  log.info("Connected to DB!");
});

module.exports = mongoose;