var bcrypt = require('bcrypt');
var moment = require('moment');
var crypto = require('crypto');
var fs = require('fs');

module.exports.dateFormat = function(date, friendly) {
    date = moment(date);
    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm:ss');
    }
};

// string to hash
module.exports.bhash = function(str, callback) {
    bcrypt.hash(str, 10, callback);
};
// compare hash
module.exports.bcompare = function(str, hash, callback) {
    bcrypt.compare(str, hash, callback);
};
// check id
module.exports.validateId = function(str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

// get file md5
module.exports.getmd5 = function(file, callback) {
    fs.readFile(file, function(err, buf) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, crypto.createHash('md5').update(buf).digest('hex'));
    });
};
