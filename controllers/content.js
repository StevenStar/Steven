var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var Content = require('../proxy').Content;
var authMiddleWare = require('../middlewares/auth');
var logger = require('../common/logger');
var tools = require('../common/tools');
var utility = require('utility');

// show all contents
module.exports.content = function(req, res, next) {
    logger.info('get contents params with : %j', req.params);

	var ep = new eventproxy();
	ep.fail(next);

	var page = parseInt(req.params.page) || 1;
    var userId = req.session.user._id;
    var events = ['content', 'total'];
    ep.all(events, function(contents, total) {
		res.render('blog/admin/content/index', {
			title: '分享管理',
			tools: tools,
            page: page,
            total: Math.ceil(total/config.page_limit),
			contents: contents
        });

    });
	Content.getAllContents(page, userId, ep.done(function(contents) {
        ep.emit('content', contents);
	}));
    Content.getTotal(userId, ep.done(function(total) {
        ep.emit('total', total);
    }));
};

// show content detail
module.exports.showContent = function(req, res, next) {
	logger.info('get content body with: %j', req.body);
	logger.info('get content params with: %j', req.params);

	var contentId = req.params.ctid;
	var ep = new eventproxy();
	ep.fail(next);

	Content.getContentById(contentId, ep.done(function(content) {
		res.render('blog/admin/content/detail', {
			title: '文章详细信息',
			content: content
		});
	}));
};
// update content detail
module.exports.updateContent = function(req, res, next) {
	logger.info('get content detail with: %j', req.body);
	logger.info('get content params with: %j', req.params);

	var ep = new eventproxy();
	ep.fail(next);

	var contentId = req.params.ctid;
	var contentTitle = validator.trim(req.body.content_title);
	var contentLabel = validator.trim(req.body.content_label);
	var contentText = validator.trim(req.body.content_text);

	Content.getContentById(contentId, ep.done(function(content) {
		if (!content) {
			return res.redirect('blog/admin/content/' + shareId + '/detail');
		}
		if (contentTitle) {
			content.content_title = contentTitle;
		}
		if (contentLabel) {
			content.content_label = contentLabel;
		}
		if (contentText) {
			content.content_text = contentText;
		}
		content.save(function(err) {
			if (err) {
				return next(err);
			}
			return res.render('blog/admin/content/detail', {title: '文章详细资料', success: '修改资料成功。', content: content});
		});
	}));
};

// delete content
module.exports.deleteContent = function(req, res, next) {
	logger.info('get deleting content id with: %j', req.params);

	var contentId = req.params.ctid;

	var ep = new eventproxy();
	ep.fail(next);

	Content.deleteContentById(contentId, ep.done(function() {
		return res.redirect('/blog/admin/content/1/index?del=success');
	}));
};
// show add content page
module.exports.showAddContent = function(req, res, next) {
	res.render('blog/admin/content/add', {
		title: '添加文章'
	});
};
// add content
module.exports.addContent = function(req, res, next) {
	logger.info(' received content add params : %j', req.body);

	var ep = new eventproxy();
	ep.fail(next);

	ep.on('prop_err', function(msg) {
		res.status(422);
		res.render('blog/admin/content/add', {
			title: '添加文章',
			error: msg
		});
	});
	var contentUserid = req.session.user._id;
	var contentTitle = validator.trim(req.body.content_title);
	var contentLable = validator.trim(req.body.content_lable);
	var contentText = validator.trim(req.body.content_text);

	Content.newAndSave(contentUserid, contentTitle, contentLable, contentText, function(err) {
		if (err) {
			return next(err);
		}
		res.render('blog/admin/content/add', {
			title: '添加文章',
			success: '添加文章成功。'
		});
	});
};
