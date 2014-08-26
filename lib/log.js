var bunyan = require('bunyan');

var log = bunyan.createLogger({name: 'glare'});

module.exports = log;
