var models = require('../models');
var Comment = models.Comment;
var config = require('../config');

/**
 * 根据用户ID查询所有评论
 * @param {String} userid 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getAllCommentsByUserId = function(userid, callback) {
	Comment.find({to_userid: userid}, callback);
};

/**
 * 查询所有评论
 * @param {String} page 个数
 * @param {String} userId 用户id  
 * @param {Function} callback 回调函数
 */
module.exports.getAllComments = function(page, userId, callback) {
	Comment.find({to_userid: userId}, {}, {skip: (page - 1) * config.page_limit, limit: config.page_limit, sort: {comment_created: -1}}, callback);
};

/**
 * 查询分页总数
 * @param {String} userId 用户id  
 * @param {Function} callback 回调函数
 */
module.exports.getTotal = function(userId, callback) {
	Comment.count({to_userid: userId}, callback);
};

/**
 * 查询未读评论
 * @param {String} userId 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getUnreadById = function(userId, callback) {
	Comment.count({to_userid: userId, comment_isread: false}, callback);
};

/**
 * 根据ID查询评论
 * @param {String} id 分享ID
 * @param {Function} callback 回调函数
 */
module.exports.getCommentById = function(id, callback) {
	Comment.findOne({_id: id}, callback);
};

/**
 * 根据ID删除评论
 * @param {String} id 评论id
 * @param {Function} callback 回调函数
 */
module.exports.deleteCommentById = function(id, callback) {
	Comment.remove({_id: id}, function(err) {
		callback(err);
	});
};

/**
 * 根据用户ID获取评论总数
 * @param {String} userid 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getCommentTotal = function(userid, callback) {
	Comment.count({to_userid: userid}, function(err, count) {
		callback(err, count);
	});
};
/**
 * 根据评论ID获取评论
 * @param {String} id 评论id
 * @param {Function} callback 回调函数
 */
module.exports.getCommentsByContentId = function(id, callback) {
	Comment.find({content_id: id}, callback);
};

/**
 * 添加评论
 * @param {String} fromUserId 评论用户id
 * @param {String} toUserId 文章所属用户id
 * @param {String} contentId 评论id
 * @param {String} nickname 昵称
 * @param {String} email 邮箱
 * @param {String} text 内容
 * @param {String} ip IP地址
 * @param {Function} callback 回调函数
 */
module.exports.newAndSave = function(fromUserId, toUserId, contentId,
									 nickname, email, text, ip, callback) {
	var comment = new Comment();
	if (fromUserId) {
		comment.from_userid = fromUserId;
	}
	comment.to_userid = toUserId;
	comment.content_id = contentId;
	comment.comment_nickname = nickname;
	comment.comment_email = email;
	comment.comment_text = text;
	comment.comment_ip = ip;
	comment.save(function(err) {
		callback(err);
	});
};
