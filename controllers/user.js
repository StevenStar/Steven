var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var User = require('../proxy').User;
var Content = require('../proxy').Content;
var Comment = require('../proxy').Comment;
var Message = require('../proxy').Message;
var Music = require('../proxy').Music;
var Picture = require('../proxy').Picture;
var logger = require('../common/logger');
var tools = require('../common/tools');
var utility = require('utility');

// show admin page
module.exports.showAdmin = function(req, res, next) {
	// get content count
	var ep = new eventproxy();
	ep.fail(next);
	var events = ['content', 'comment', 'message', 'music', 'picture'];
	ep.all(events, function(content, comment, message, music, picture) {
		res.render('blog/admin/index', {
			title: '博客管理',
			contentTotal: content,
			commentTotal: comment,
			messageTotal: message,
			musicTotal: music,
			pictureTotal: picture
		});
	});

	var userId = req.session.user._id;
	Content.getContentTotal(userId, ep.done(function(count, here) {
		ep.emit('content', count);
	}));
	Comment.getCommentTotal(userId, ep.done(function(count) {
		ep.emit('comment', count);
	}));
	Message.getMessageTotal(userId, ep.done(function(count) {
		ep.emit('message', count);
	}));
	Music.getMusicTotal(userId, ep.done(function(count) {
		ep.emit('music', count);
	}));
	Picture.getPictureTotal(userId, ep.done(function(count) {
		ep.emit('picture', count);
	}));
};
// show setting page
module.exports.showSetting = function(req, res, next) {
	res.render('blog/admin/user/setting', {
		title: '修改资料'
	});
};
// update setting
module.exports.setting = function(req, res, next) {
	logger.info('get profile with: %j', req.body);

	var ep = new eventproxy();
	ep.fail(next);

	var action = req.body.action;
	if (action === 'change_profile') {
		var userQq = validator.trim(req.body.user_qq);
		var userLabel = validator.trim(req.body.user_label);
	    var userPhone = validator.trim(req.body.user_phone);
		var userSex = validator.trim(req.body.user_sex);
	    var userBirthday = validator.trim(req.body.user_birthday);
		var userCompany = validator.trim(req.body.user_company);
		var userProfession = validator.trim(req.body.user_profession);
	    var userUrl = validator.trim(req.body.user_url);
		var userWeibo = validator.trim(req.body.user_weibo);
	    var userInfo = validator.trim(req.body.user_info);

		User.getUserById(req.session.user._id, ep.done(function(user) {
			if (userQq) {
				user.user_qq = userQq;
			}
			if (userUrl) {
				user.user_url = userUrl;
			}
			if (userPhone) {
				user.user_phone = userPhone;
			}
			if (userLabel) {
				user.user_label = userLabel;
			}
			if (userSex) {
				user.user_sex = userSex;
			}
			if (userBirthday) {
				user.user_birthday = userBirthday;
			}
			if (userCompany) {
				user.user_company = userCompany;
			}
			if (userProfession) {
				user.user_profession = userProfession;
			}
			if (userWeibo) {
				user.user_weibo = userWeibo;
			}
			if (userInfo) {
				user.user_info = userInfo;
			}
			user.user_actived = Date.now();
			user.save(function(err) {
				if (err) {
					return next(err);
				}
				return res.render('blog/admin/user/setting', {title: '个人资料', success: '修改资料成功。'});
			});
		}));
	} else if (action === 'change_pwd') {
		var oldPass = validator.trim(req.body.user_oldpass);
		var newPass = validator.trim(req.body.user_newpass);
		var newRePass = validator.trim(req.body.user_newrepass);

		if (newPass !== newRePass) {
			return res.render('blog/admin/user/setting', {title: '修改密码', error: '两次输入的密码不正确。'});
		}

		User.getUserById(req.session.user._id, ep.done(function(user) {
			tools.bcompare(oldPass, user.user_pass, function(err, bool) {
				if (err) {
					return next(err);
				}
				if (!bool) {
					return res.render('blog/admin/user/setting', {title: '修改密码', error: '当前密码不正确。'});
				}
				tools.bhash(newPass, ep.done(function(passhash) {
					user.user_pass = passhash;
					user.user_actived = Date.now();
					user.save(function(err) {
						if (err) {
							return next(err);
						}
						return res.render('blog/admin/user/setting', {title: '修改密码', success: '修改密码成功。'});
					});
				}));
			});
		}));
	} else {
		return res.render('blog/admin/user/setting', {error: '提交的表单不存在。'});
	}
};
// show all users
module.exports.showUsers = function(req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);

	var page = req.params.page || 1;

	var events = ['user', 'total'];
	ep.all(events, function(users, total) {
		return res.render('blog/admin/user/index', {
			title: '用户管理',
			tools: tools,
			page: page,
			total: Math.ceil(total/config.page_limit),
			users: users
		});
	});
	User.getAllUsers(page, ep.done(function(users){
		ep.emit('user', users);
	}));
	User.getTotal(ep.done(function(total) {
		ep.emit('total', total);
	}));
};

// show user detail
module.exports.showUser = function(req, res, next) {
	logger.info('get user params with: %j', req.params);

	var userid = req.params.uid;
	var ep = new eventproxy();
	ep.fail(next);

	User.getUserById(userid, ep.done(function(user) {
		res.render('blog/admin/user/detail', {
			title: '用户详细信息',
			user: user
		});
	}));
};

// update user
module.exports.updateUser = function(req, res, next) {
	logger.info('get user params with: %j', req.params);
	logger.info('get user detail with: %j', req.body);

	var ep = new eventproxy();
	ep.fail(next);

	var userId = req.params.uid;
	var userQq = validator.trim(req.body.user_qq);
	var userLabel = validator.trim(req.body.user_label);
	var userPhone = validator.trim(req.body.user_phone);
	var userSex = validator.trim(req.body.user_sex);
	var userBirthday = validator.trim(req.body.user_birthday);
	var userCompany = validator.trim(req.body.user_company);
	var userProfession = validator.trim(req.body.user_profession);
	var userUrl = validator.trim(req.body.user_url);
	var userWeibo = validator.trim(req.body.user_weibo);
	var userInfo = validator.trim(req.body.user_info);
	var userIsAdmin = validator.trim(req.body.user_isadmin);
	userIsAdmin = (userIsAdmin === '0' ? true : false);
	User.getUserById(userId, ep.done(function(user) {
		if (!user) {
			return res.redirect('blog/admin/user/detail?id=' + userId);
		}
		if (userQq) {
			user.user_qq = userQq;
		}
		if (userUrl) {
			user.user_url = userUrl;
		}
		if (userPhone) {
			user.user_phone = userPhone;
		}
		if (userLabel) {
			user.user_label = userLabel;
		}
		if (userSex) {
			user.user_sex = userSex;
		}
		if (userBirthday) {
			user.user_birthday = userBirthday;
		}
		if (userCompany) {
			user.user_company = userCompany;
		}
		if (userProfession) {
			user.user_profession = userProfession;
		}
		if (userWeibo) {
			user.user_weibo = userWeibo;
		}
		if (userInfo) {
			user.user_info = userInfo;
		}
		user.user_isadmin = userIsAdmin;
		user.save(function(err) {
			if (err) {
				return next(err);
			}
			return res.render('blog/admin/user/detail', {title: '用户详细资料', success: '修改资料成功。', user: user});
		});
	}));
};
