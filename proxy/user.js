var models = require('../models');
var config = require('../config');
var User = models.User;

/**
 * 注册用户
 * @param {String} name 用户名列表
 * @param {String} email 用户名列表
 * @param {String} pass 用户名列表
 * @param {Function} callback 回调函数
 */
module.exports.newAndSave = function(name, email, pass, callback) {
	var user = new User();
	user.user_nickname = name;
	user.user_email = email;
	user.user_pass = pass;
	user.save(function(err) {
		callback(err, user);
	});
};

/**
 * 根据用户名列表查找用户列表
 * @param {Array} name 用户名列表
 * @param {Function} callback 回调函数
 */
module.exports.getUserByLoginName = function(name, callback) {
	User.findOne({user_email: name}, callback);
};

/**
 * 根据关键字获取一组用户
 * @param {Array} query 关键字
 * @param {Array} opt 选项
 * @param {Function} callback 回调函数
 */
module.exports.getUsersByQuery = function(query, opt, callback) {
	User.find(query, opt, callback);
};

/**
 * 根据昵称查询用户
 * @param {String} nickname 登录名称
 * @param {Function} callback 回调函数
 */
module.exports.getUserByUserNickname = function(nickname, callback) {
	User.findOne({'user_nickname': nickname}, callback);
};

/**
 * 根据用户邮箱查询用户
 * @param {String} email 关键字
 * @param {Function} callback 回调函数
 */
module.exports.getUserByEmail = function(email, callback) {
	User.findOne({user_email: email}, callback);
};

/**
 * 根据用户ID查询用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
module.exports.getUserById = function(id, callback) {
	User.findOne({_id: id}, callback);
};

/**
 * 查询所有用户
 * @param {Number} page 页数
 * @param {Function} callback 回调函数
*/
module.exports.getAllUsers = function(page, callback) {
	User.find({}, {}, {skip: (page - 1) * config.page_limit, limit: config.page_limit, sort: {user_created: -1}}, callback);
};

/**
 * 查询分页总数
 * @param {Function} callback 回调函数
 */
module.exports.getTotal = function(callback) {
	User.count({}, callback);
};