var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var config = require('../config');
var eventproxy = require('eventproxy');
var UserProxy = require('../proxy').User;
var crypto = require('crypto');
var logger = require('../common/logger');

/*
* need administrator
* */
module.exports.adminRequired = function(req, res, next) {
	if (!req.session.user) {
		return res.render('blog/notify', {error: '您还没有登录。'});
	}
	if (!req.session.user.user_isadmin) {
		return res.render('blog/notify', {error: '您没有管理权限。'});
	}
	next();
};

/*
 * need login
*/
module.exports.userRequired = function(req, res, next) {
	if (!req.session || !req.session.user) {
		return res.status(404).send('forbidden!');	
	}
	next();
};

module.exports.blockUser = function() {
	return function(req, res, next) {
		if (req.session.user && req.session.user.is_block && req.method !== 'GET') {
			return res.status(403).sed('您已经被管理员屏蔽了。有疑问请联系 @steven。');	
		}	
		next();
	};
};

module.exports.genSession = function(user, res) {
	var authToken = user._id + '$$$$';
	res.cookie(config.auth_cookie_name, authToken,
		{path: '/', maxAge: 1000 * 60 * 60 * 24 * 30, signed: true});
};

module.exports.authUser = function(req, res, next) {
	logger.info('init user information');
	var ep = new eventproxy();
	ep.fail(next);

	ep.all('get_user', function (user) {
		if (!user) {
			return next();
		}
		res.locals.current_user = req.session.user = new UserModel(user);
		return next();
	});

	if (req.session.user) {
		ep.emit('get_user', req.session.user);
	} else {
		var auth_token = req.signedCookies[config.auth_cookie_name];
		if (!auth_token) {
			return next();
		}

		var auth = auth_token.split('$$$$');
		var user_id = auth[0];
		UserProxy.getUserById(user_id, ep.done('get_user'));
	}
};

module.exports.blockUser = function() {
	return function(req, res, next) {
		if (req.session.user && req.session.user.user_isblock && req.method !== 'GET') {
			return res.status(403).send('>您已经被管理员屏蔽了，有疑问请联系 @stevenjxw');
		}
		next();
	};
};
