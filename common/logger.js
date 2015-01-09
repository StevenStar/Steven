var fs = require('fs');
var log4js = require('log4js');
var config = require('../config');

log4js.configure({
    appenders: [
        {type: 'console'},
        {
            type: 'file',
            filename: config.LOG_PATH,
            maxLogSize: 20480,
            backups: 3,
            category: 'steven'
        }
    ]
});
log4js.loadAppender('file');
var logger = log4js.getLogger('steven - blog');

module.exports = logger;
module.exports.logger = logger;
