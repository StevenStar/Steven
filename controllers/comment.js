var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var Comment = require('../proxy').Comment;
var authMiddleWare = require('../middlewares/auth');
var logger = require('../common/logger');
var tools = require('../common/tools');
var utility = require('utility');

// show all comments
module.exports.comment = function(req, res, next) {
    logger.info('get contents params with : %j', req.params);

	var ep = new eventproxy();
	ep.fail(next);

	var page = parseInt(req.params.page) || 0;
    var userId = req.session.user._id;

    var events = ['comment', 'total'];
    ep.all(events, function(comments, total) {
        res.render('blog/admin/comment/index', {
			title: '分享管理',
			tools: tools,
            page: page,
            total: Math.ceil(total/config.page_limit),
			comments: comments
		});
    });

	Comment.getAllComments(page, userId, ep.done(function(comments) {
	    ep.emit('comment', comments);
    }));

    Comment.getTotal(userId, ep.done(function(total){
        ep.emit('total', total); 
    }));
};

// show comment detail
module.exports.showComment = function(req, res, next) {
    logger.info('get contents params with : %j', req.params);

	var commentId = req.params.cmid;
	var ep = new eventproxy();
	ep.fail(next);

	Comment.getCommentById(commentId, ep.done(function(comment) {
		res.render('blog/admin/comment/detail', {
			title: '文章详细信息',
			comment: comment
		});
	}));
};
// update comment detail
module.exports.updateComment = function(req, res, next) {
	logger.info('get comment detail with: %j', req.body);

	var ep = new eventproxy();
	ep.fail(next);

	var commentId = validator.trim(req.body.comment_id);
	var commentTitle = validator.trim(req.body.comment_title);
	var commentLabel = validator.trim(req.body.comment_label);
	var commentText = validator.trim(req.body.comment_text);

	Comment.getCommentById(commentId, ep.done(function(comment) {
		if (!comment) {
			return res.redirect('blog/admin/comment/detail?id=' + shareId);
		}
		if (commentTitle) {
			comment.comment_title = commentTitle;
		}
		if (commentLabel) {
			comment.comment_label = commentLabel;
		}
		if (commentText) {
			comment.comment_text = commentText;
		}
		comment.save(function(err) {
			if (err) {
				return next(err);
			}
			return res.render('blog/admin/comment/detail', {title: '文章详细资料', success: '修改资料成功。', comment: comment});
		});
	}));
};

// reply comment
module.exports.replyComment = function(req, res, next) {
    logger.info('get content detail with: %j', req.body);
	logger.info('get content params with: %j', req.params);
    
    var ep = new eventproxy();
    ep.fail(next);

    var commentId = req.params.cmid;
    var commentReply = req.body.comment_reply;

    Comment.getCommentById(commentId, ep.done(function(comment) {
        if (!comment) {
			return res.redirect('blog/admin/comment/' + commentId+ '/detail');
        }
        comment.comment_update = Date.now();
        comment.comment_reply = req.body.comment_reply;
        comment.comment_isreply = true;
        comment.save(ep.done(function() {
			return res.render('blog/admin/comment/detail', {
                title: '文章详细资料',
                success: '修改资料成功。',
                comment: comment
            });
        }));
    }));
};

// delete comment
module.exports.deleteComment = function(req, res, next) {
	logger.info('get deleting comment id with: %j', req.query);

	var commentId = req.query.id;

	var ep = new eventproxy();
	ep.fail(next);

	Comment.deleteCommentById(commentId, ep.done(function(err) {
		if (err) {
			return next(err);
		}
		return res.redirect('/blog/admin/comment?del=success');
	}));
};
