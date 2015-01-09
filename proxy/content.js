var models = require('../models');
var config = require('../config');
var Content = models.Content;

/**
 * 根据用户id查询所有文章
 * @param {String} userid 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getAllCommentsByUserId = function(userid, callback) {
	Content.find({user_id: userid}, callback);
};

/**
 * 查询所有文章
 * @param {String} page 个数
 * @param {String} userId 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getAllContents = function(page, userId, callback) {
	Content.find({user_id: userId}, {}, {skip: (page - 1) * config.page_limit, limit: config.page_limit, sort: {content_created: -1}}, callback);
};

/**
 * 查询分页总数
 * @param {String} userId 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getTotal = function(userId, callback) {
	Content.count({user_id: userId}, callback);
};

/**
 * 添加文章
 * @param {String} userid 用户名id
 * @param {String} title 文章标题
 * @param {String} label 文章标签
 * @param {String} text 文章内容
 * @param {Function} callback 回调函数
 */
module.exports.newAndSave = function(userid, title, label, text, callback) {
	var content = new Content();
	content.user_id = userid;
	content.content_title = title;
	content.content_label = label;
	content.content_text = text;
	content.save(function(err) {
		callback(err);
	});
};

/**
 * 根据ID查询文章
 * @param {String} id 分享ID
 * @param {Function} callback 回调函数
 */
module.exports.getContentById = function(id, callback) {
	Content.findOne({_id: id}, callback);
};

/**
 * 根据ID删除文章
 * @param {String} id 文章id
 * @param {Function} callback 回调函数
 */
module.exports.deleteContentById = function(id, callback) {
	Content.remove({_id: id}, function(err) {
		callback(err);
	});
};

/**
 * 根据用户ID获取文章总数
 * @param {String} userid 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getContentTotal = function(userid, callback) {
	Content.count({user_id: userid}, function(err, count) {
		callback(err, count);
	});
};
