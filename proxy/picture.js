var models = require('../models');
var Picture = models.Picture;
var config = require('../config');

/**
 * 根据用户ID查询所有图片
 * @param {String} userid 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getAllPicturesByUserId = function(userid, callback) {
	Picture.find({user_id: userid}, callback);
};

/**
 * 查询所有图片
 * @param {String} page 个数
 * @param {String} userId 用户id  
 * @param {Function} callback 回调函数
 */
module.exports.getAllPictures = function(page, userId, callback) {
	var jOpitons = {};
	if (userId) {
		jOpitons.user_id = userId;
	}
	Picture.find(jOpitons, {}, {skip: (page - 1) * config.page_limit, limit: config.page_limit, sort: {picture_created: -1}}, callback);
};

/**
 * 查询分页总数
 * @param {String} userId 用户id  
 * @param {Function} callback 回调函数
 */
module.exports.getTotal = function(userId, callback) {
	var jOptions = {};
	if (userId) {
		jOptions.user_id = userId;
	}
	Picture.count(jOptions, callback);
};

/**
 * 添加图片
 * @param {String} userid 用户名id
 * @param {String} name 名称
 * @param {String} info 简介
 * @param {String} filename 文件名称
 * @param {String} mimetype 文件格式
 * @param {Number} size 大小
 * @param {String} md5 MD5 
 * @param {String} extension 扩展名 
 * @param {Function} callback 回调函数
 */
module.exports.newAndSave = function(userid, name, info, filename, mimetype, size, extension, md5, callback) {
	var picture = new Picture();
	picture.user_id = userid;
	picture.picture_name = name;
	picture.picture_size = size;
	picture.picture_filename = filename;
	picture.picture_info = info;
	picture.picture_extension = extension;
    picture.picture_md5 = md5;
	picture.save(function(err) {
		callback(err);
	});
};

/**
 * 根据ID查询图片
 * @param {String} id ID
 * @param {Function} callback 回调函数
 */
module.exports.getPictureById = function(id, callback) {
	Picture.findOne({_id: id}, callback);
};

/**
 * 根据md5查询图片
 * @param {String} md5 MD5 
 * @param {Function} callback 回调函数
 */
module.exports.getPictureById = function(id, callback) {
	Picture.findOne({_id: id}, callback);
};

/**
 * 根据ID删除图片
 * @param {String} id ID
 * @param {Function} callback 回调函数
 */
module.exports.deletePictureById = function(id, callback) {
	Picture.remove({_id: id}, function(err) {
		callback(err);
	});
};

/**
 * 根据用户ID获取图片总数
 * @param {String} userid 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getPictureTotal = function(userid, callback) {
	Picture.count({user_id: userid}, function(err, count) {
		callback(err, count);
	});
};
