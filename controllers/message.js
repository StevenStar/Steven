var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var Message = require('../proxy').Message;
var authMiddleWare = require('../middlewares/auth');
var logger = require('../common/logger');
var tools = require('../common/tools');
var utility = require('utility');

// show all messages
module.exports.message = function(req, res, next) {
    logger.info('get message params with : %j', req.params);
	var ep = new eventproxy();
	ep.fail(next);

    var page = parseInt(req.params.page) || 1;
    var userId = req.session.user._id;
    var events = ['message', 'total'];
    ep.all(events, function(messages, total) {
		res.render('blog/admin/message/index', {
			title: '图片管理',
			tools: tools,
            page: page,
            total: Math.ceil(total/config.page_limit),
			messages: messages
        });

    });
    Message.getAllMessages(page, userId, ep.done(function(messages) {
        ep.emit('message', messages);
	}));
    Message.getTotal(userId, ep.done(function(total) {
        ep.emit('total', total);
    }));
};

// show message detail
module.exports.showMessage = function(req, res, next) {
	var messageId = req.query.id;
	var ep = new eventproxy();
	ep.fail(next);

	Message.getMessageById(messageId, ep.done(function(message) {
		res.render('blog/admin/message/detail', {
			title: '留言详细信息',
			message: message
		});
	}));
};
// update message detail
module.exports.updateMessage = function(req, res, next) {
	logger.info('get message detail with: %j', req.body);

	var ep = new eventproxy();
	ep.fail(next);

	var messageId = validator.trim(req.body.message_id);
	var messageTitle = validator.trim(req.body.message_title);
	var messageLabel = validator.trim(req.body.message_label);
	var messageText = validator.trim(req.body.message_text);

	Message.getMessageById(messageId, ep.done(function(message) {
		if (!message) {
			return res.redirect('blog/admin/message/detail?id=' + shareId);
		}
		if (messageTitle) {
			message.message_title = messageTitle;
		}
		if (messageLabel) {
			message.message_label = messageLabel;
		}
		if (messageText) {
			message.message_text = messageText;
		}
		message.save(function(err) {
			if (err) {
				return next(err);
			}
			return res.render('blog/admin/message/detail', {title: '留言详细资料', success: '修改资料成功。', message: message});
		});
	}));
};
// delete message
module.exports.deleteMessage = function(req, res, next) {
	logger.info('get deleting message id with: %j', req.params);

	var messageId = req.params.id;

	var ep = new eventproxy();
	ep.fail(next);

	Message.deleteMessageById(messageId, ep.done(function() {
		return res.redirect('/blog/admin/message/1/index?del=success');
	}));
};
