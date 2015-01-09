var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var User = require('../proxy').User;
var authMiddleWare = require('../middlewares/auth');
var logger = require('../common/logger');
var tools = require('../common/tools');
var utility = require('utility');

// sign up
module.exports.showSignup = function(req, res, next) {
	res.render('blog/signup', {
		title: '注册博客'
	});
};

module.exports.signup = function(req, res, next) {
	logger.info('sign up with : %j', req.body);
	var userNickname = validator.trim(req.body.user_nickname);
	var userEmail = validator.trim(req.body.user_email);
	var userPass = validator.trim(req.body.user_pass);
	var userRePass = validator.trim(req.body.user_repass);
	var ep = new eventproxy();
	ep.fail(next);
	ep.on('prop_err', function(msg) {
		res.status(422);
		res.render('blog/signup', {title: '注册博客', error: msg, loginname: userNickname, email: userEmail});
	});
	// validator register
	if ([userNickname, userPass, userRePass, userEmail].some(function(item) {
			return item === ''
		})) {
		ep.emit('prop_err', '信息填写不完整。');
		return;
	}
	if (userNickname.length < 5) {
		ep.emit('prop_err', '用户名至少需要5个字符串。');
		return;
	}
	if (!tools.validateId(userNickname)) {
		return ep.emit('prop_err', '用户名不合法。');
	}
	if (!validator.isEmail(userEmail)) {
		return ep.emit('prop_err', '邮箱不合法。');
	}
	if (userPass !== userRePass) {
		return ep.emit('prop_err', '两次密码输入不一致。');
	}

	User.getUsersByQuery({'$or': [
		{'user_nickname': userNickname},
		{'user_email': userEmail}
		]}, {}, function(err, users) {
		if (err) {
			return next(err);
		}
		if (users.length > 0) {
			return ep.emit('prop_err', '用户名或者邮箱已经被使用了。');
		}
	});
	tools.bhash(userPass, function(err, passhash) {
		if (err) {
			return next(err);
		}
		User.newAndSave(userNickname, userEmail, passhash, function(err) {
			if (err) {
				return next(err);
			}

			res.render('blog/signup', {
				title: '注册博客',
				success: '欢迎加入' + config.name + '!'
			})
		});
	});
};

//sign in
module.exports.showSignin = function(req, res, next) {
	res.render('blog/signin', {
		title: '登录博客'
	});
};
module.exports.signin = function(req, res, next) {
	var loginName = validator.trim(req.body.user_loginname);
	var loginPass = validator.trim(req.body.user_loginpass);
	logger.info('sign in with : %j', req.body);
	var ep = new eventproxy();
	ep.fail(next);
	ep.on('login_error', function(err) {
		res.status(403);
		res.render('blog/signin', {title: '登录博客', error: err});
	});
	if (!loginName || !loginPass) {
		res.status(422);
		return res.render('blog/signin', {title: '登录博客', error: '填写的信息不完整。'});
	}

	var getUser;
	if (loginName.indexOf('@') !== -1) {
		getUser = User.getUserByEmail;
	} else {
		getUser = User.getUserByUserNickname;
	}
	getUser(loginName, function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return ep.emit('login_error', '用户名不存在');
		}
		var passhash = user.user_pass;
		tools.bcompare(loginPass, passhash, ep.done(function(bool) {
			if (!bool) {
				return ep.emit('login_error', '密码不正确');
			}
			authMiddleWare.genSession(user, res);
			res.redirect('/blog');
		}));
	});
};

// sign out
module.exports.signout = function(req, res, next) {
	req.session.destroy();
	res.clearCookie(config.auth_cookie_name, {path: '/'});
	res.redirect('/blog');
};

// authenticate using our plain-object database of doom!
function authenticate(name, pass, fn) {
	var user = 'stevenjxw@126.com';
	if (!user) {
		return fn(new Error('cannot find user'));
	}
	tools.bhash(pass, user.salt, function(err, hash) {
		if (err) {
			return fn(err);
		}
		if (hash === user.hash) {
			return fn(null, user);
		}
		fn(new Error('invalid password'));
	});
}
