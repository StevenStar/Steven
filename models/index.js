var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../common/logger');

mongoose.connect(config.db, function(err) {
	if (err) {
		logger.info('connect to %s err or: ', config.db, err.message);
		process.exit(1);
	}
	logger.info('connect to %s success ', config.db);
});

// models
require('./user');
require('./content');
require('./comment');
require('./message');
require('./music');
require('./picture');

module.exports.User = mongoose.model('User');
module.exports.Content = mongoose.model('Content');
module.exports.Comment = mongoose.model('Comment');
module.exports.Message = mongoose.model('Message');
module.exports.Music = mongoose.model('Music');
module.exports.Picture = mongoose.model('Picture');
