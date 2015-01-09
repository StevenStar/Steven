var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var User = require('../proxy').User;
var Content = require('../proxy').Content;
var Comment = require('../proxy').Comment;
var Message = require('../proxy').Message;
var Music = require('../proxy').Music;
var Picture = require('../proxy').Picture;
var authMiddleWare = require('../middlewares/auth');
var logger = require('../common/logger');
var tools = require('../common/tools');
var utility = require('utility');

// show blog home page
module.exports.blog = function(req, res, next) {
	logger.info('received blog index params with : %j', req.params);

	var ep = new eventproxy();
	ep.fail(next);

	var page = parseInt(req.params.page) || 1;
	var userNickname = req.params.name || config.default_user;

	var events = ['user', 'content', 'total', 'unread_comment', 'unread_message'];
	ep.all(events, function(user, contents, total, unreadComment, unreadMessage) {
		if (user) {
			res.render('blog/index', {
				title: '个人博客',
				tools: tools,
                page: page,
                total: Math.ceil(total/config.page_limit),
				user: user,
				unread: unreadComment + unreadMessage,
				contents: contents
			});
		} else {
			res.render('blog/notify', {
				title: '警告',
				error: '该用户不存在'
			});
		}
	});

	User.getUserByUserNickname(userNickname, ep.done(function(user) {
        if (user) {
		    ep.emit('user', user);
            var userId = user._id;
            Content.getAllContents(page, userId, ep.done(function(contents) {
                ep.emit('content', contents);
            }));
            Content.getTotal(userId, ep.done(function(total) {
                ep.emit('total', total);
            }));
            Comment.getUnreadById(userId, ep.done(function(count) {
                ep.emit('unread_comment', count);
            }));
            Message.getUnreadById(userId, ep.done(function(count) {
                ep.emit('unread_message', count);
            }));

        }
	}));
};

// show content detail
module.exports.content = function(req, res, next) {
	logger.info('get content id with', req.params);
	var contentId = req.params.id;
	var ep = new eventproxy();
	ep.fail(next);

	var events = ['content', 'user', 'comments'];
	ep.all(events, function(content, user, comments) {
		res.render('blog/content', {
			title: '文章信息',
			tools: tools,
			user: user,
			content: content,
			comments: comments
		});
	});

	Content.getContentById(contentId, ep.done(function(content) {
		if (content) {
			ep.emit('content', content);
			User.getUserById(content.user_id, ep.done(function(user) {
				ep.emit('user', user);
			}));
		} else {
			res.render('blog/notify', {
				title: '警告',
				error: '文章不存在。。。'
			});
		}
	}));
	Comment.getCommentsByContentId(contentId, ep.done(function(comments) {
		ep.emit('comments', comments)
	}));
};

// comment content
module.exports.comment = function(req, res, next) {
	logger.info('get comment params with: %j', req.params);
	logger.info('get comment body with: %j', req.body);

	var fromUserId = '';
	if (typeof req.session.user !== 'undefined') {
		fromUserId = req.session.user._id;
	}
	var toUserId = validator.trim(req.body.user_id);
	var contentId = req.params.id;
	var commentNickname = validator.trim(req.body.comment_nickname);
	var commentEmail = validator.trim(req.body.comment_email);
	var commentText = validator.trim(req.body.comment_text);
	var commentIp = req.ip;

	Comment.newAndSave(fromUserId, toUserId, contentId, commentNickname,
		commentEmail, commentText, commentIp, function(err) {
		if (err) {
			return next(err);
		}
		res.redirect('/blog/content/' + contentId + '?success');
	});
};

// leave a message
module.exports.message = function(req, res, next) {
	logger.info('get message detail with: %j', req.body);

	var fromUserId = req.session.user._id || '';
	var toUserId = req.session.user._id;
	var messageNickname = validator.trim(req.body.message_nickname);
	var messageEmail = validator.trim(req.body.message_email);
	var messageText = validator.trim(req.body.message_text);
	var messageIp = req.ip;

	Message.newAndSave(fromUserId, toUserId, messageNickname, messageEmail, messageText,
		messageIp, function(err) {
		if (err) {
			return next(err);
		}
		res.redirect('/blog/about');
	});
};

// show all shares
module.exports.share = function(req, res, next) {
	res.render('blog/share', {
		title: '分享'
	});
};

// show all musics
module.exports.music = function(req, res, next) {
    logger.info('get music page params with : ', req.params);

	var ep = new eventproxy();
	ep.fail(next);

	var events = ['music', 'total'];
	ep.all(events, function(musics, total) {
		return res.render('blog/music', {
			title: '音乐',
			tools: tools,
            total: Math.ceil(total/config.page_limit),
			musics: musics
		});
	});

	var userNickname = req.params.name || '';
	var page = req.params.page || 1;

	User.getUserByUserNickname(userNickname, ep.done(function(user) {
		var userId;
		if (user) {
			userId = user._id;
		}
		Music.getAllMusics(page, userId, ep.done(function(musics) {
			ep.emit('music', musics);
		}));
		Music.getTotal(userId, ep.done(function(total) {
			ep.emit('total', total);
		}));
	}));
};

// show all pictures
module.exports.picture = function(req, res, next) {
    logger.info('get picture params with : %j', req.params);

	var ep = new eventproxy();
	ep.fail(next);
    
    var events = ['picture', 'total'];
    ep.all(events, function(pictures, total) {
		res.render('blog/picture', {
			title: '图片',
			tools: tools,
            page: page,
            total: Math.ceil(total/config.page_limit),
			pictures: pictures
        });
    });

	var userNickname = req.params.name || '';
	var page = parseInt(req.params.page) || 1;

	User.getUserByUserNickname(userNickname, ep.done(function(user) {
		var userId;
		if (user) {
			userId = user._id;
		}
		Picture.getAllPictures(page, userId, ep.done(function(pictures) {
			ep.emit('picture', pictures);
		}));
		Picture.getTotal(userId, ep.done(function(total) {
			ep.emit('total', total);
		}));
	}));
};


// show unread messages and comments
module.exports.unread = function(req, res, next) {
	logger.info('get unread params with : %j', req.params);

	var path = req.path;
	logger.debug(path);
	var ep = new eventproxy();
	ep.fail(next);

	var userId = req.session.user._id;
	var page = req.params.page || 1;

	var events;
	if (path == '/unread') {
		events = ['unread_comment', 'unread_message', 'comment_total', 'message_total'];
		ep.all(events, function(comments, messages, commentTotal, messageTotal) {
			res.render('blog/unread', {
				title: '未读信息',
				tools: tools,
				page: page,
				comments: comments,
				comment_total: Math.ceil(commentTotal/config.page_limit),
				messages: messages,
				message_total: Math.ceil(messageTotal/config.page_limit)
			});
		});
	}
	if (path.indexOf('message') != -1) {
		events = ['unread_message', 'message_total'];
		ep.all(events, function(messages, total) {
			res.render('blog/unread', {
				title: '未读信息',
				tools: tools,
				page: page,
				messages: messages,
				message_total: Math.ceil(total/config.page_limit)
			});
		});
	} else if (path.indexOf('comment') != -1) {
		events = ['unread_comment', 'comment_total'];
		ep.all(events, function(comments, total) {
			res.render('blog/unread', {
				title: '未读信息',
				tools: tools,
				page: page,
				comments: comments,
				comment_total: Math.ceil(total/config.page_limit)
			});
		});
	}

	Comment.getAllComments(page, userId, ep.done(function(comments) {
		ep.emit('unread_comment', comments);
	}));
	Comment.getTotal(userId, ep.done(function(total) {
		ep.emit('comment_total', total);
	}));
	Message.getAllMessages(page, userId, ep.done(function(messages) {
		ep.emit('unread_message', messages);
	}));
	Message.getTotal(userId, ep.done(function(total) {
		ep.emit('message_total', total);
	}));
};

// show search result
module.exports.search = function(req, res, next) {
	res.render('blog/search', {
		title: '查询结果'
	});
};
