var models = require('../models');
var Message = models.Message;
var config = require('../config');

/**
 * 根据用户ID查询所有留言
 * @param {String} userid 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getAllMessagesByUserId = function(userid, callback) {
	Message.find({to_userid: userid}, callback);
};

/**
 * 查询所有留言
 * @param {String} page 个数
 * @param {String} userId 用户id  
 * @param {Function} callback 回调函数
 */
module.exports.getAllmessages = function(page, userId, callback) {
	Message.find({to_userid: userId}, {}, {skip: (page - 1) * config.page_limit, limit: config.page_limit, sort: {message_created: -1}}, callback);
};

/**
 * 查询分页总数
 * @param {String} userId 用户id  
 * @param {Function} callback 回调函数
 */
module.exports.getTotal = function(userId, callback) {
	Message.count({to_userid: userId}, callback);
};

/**
 * 查询未读留言
 * @param {String} userId 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getUnreadById = function(userId, callback) {
	Message.count({to_userid: userId, message_isread: false}, callback);
};

/**
 * 查询所有留言
 * @param {String} page 个数
 * @param {String} userId 用户id  
 * @param {Function} callback 回调函数
 */
module.exports.getAllMessages = function(page, userId, callback) {
	Message.find({to_userid: userId}, {}, {skip: (page - 1) * config.page_limit, limit: config.page_limit, sort: {message_created: -1}}, callback);
};

/**
 * 查询分页总数
 * @param {String} userId 用户id  
 * @param {Function} callback 回调函数
 */
module.exports.getTotal = function(userId, callback) {
	Message.count({to_userid: userId}, callback);
};

/**
 * 添加留言
 * @param {String} fromUserId 当前用户名id
 * @param {String} toUserId 管理员用户名id
 * @param {String} nickname 留言标签
 * @param {String} email 留言邮箱
 * @param {String} text 留言内容
 * @param {String} ip IP地址
 * @param {Function} callback 回调函数
 */
module.exports.newAndSave = function(fromUserId, toUserId, nickname, email,
									 text, ip, callback) {
	var message = new Message();
	message.from_userid = fromUserId;
	message.to_userid = toUserId;
	message.message_nickname = nickname;
	message.message_text = text;
	message.message_ip = ip;
	message.save(function(err) {
		callback(err);
	});
};

/**
 * 根据ID查询留言
 * @param {String} id 分享ID
 * @param {Function} callback 回调函数
 */
module.exports.getMessageById = function(id, callback) {
	Message.findOne({_id: id}, callback);
};

/**
 * 根据ID删除留言
 * @param {String} id 留言id
 * @param {Function} callback 回调函数
 */
module.exports.deleteMessageById = function(id, callback) {
	Message.remove({_id: id}, function(err) {
		callback(err);
	});
};

/**
 * 根据用户ID获取留言总数
 * @param {String} userid 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getMessageTotal = function(userid, callback) {
	Message.count({to_userid: userid}, function(err, count) {
		callback(err, count);
	});
};
