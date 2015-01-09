var models = require('../models');
var Music = models.Music;
var config = require('../config');

/**
 * 根据用户ID查询所有音乐
 * @param {String} userid 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getAllMusicsByUserId = function(userid, callback) {
	Music.find({to_userid: userid}, callback);
};

/**
 * 查询所有音乐
 * @param {String} page 个数
 * @param {String} userId 用户id  
 * @param {Function} callback 回调函数
 */
module.exports.getAllMusics = function(page, userId, callback) {
	var jOptions = {};
	if (userId) {
		jOptions.user_id = userId;
	}
	Music.find(jOptions, {}, {skip: (page - 1) * config.page_limit, limit: config.page_limit, sort: {music_created: -1}}, callback);
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
	Music.count(jOptions, callback);
};

/**
 * 添加音乐
 * @param {String} userid 用户名id
 * @param {String} name 名称
 * @param {String} author 作者
 * @param {String} albumname 专辑
 * @param {String} info 简介
 * @param {String} filename 文件名称 
 * @param {String} extension 扩展名 
 * @param {Number} size 大小 
 * @param {String} mimetype 文件格式 
 * @param {Function} callback 回调函数
 */
module.exports.newAndSave = function(userid, name, author, albumname, info, filename, extension, size, mimetype, callback) {
	var music = new Music();
	music.user_id = userid;
	music.music_name = name;
	music.music_author = author;
	music.music_albumname = albumname;
	music.music_info = info;
	music.music_extension = extension;
	music.music_size = size;
	music.music_mimetype = mimetype;
	music.save(function(err) {
		callback(err);
	});
};

/**
 * 根据ID查询音乐
 * @param {String} id 音乐ID
 * @param {Function} callback 回调函数
 */
module.exports.getMusicById = function(id, callback) {
	Music.findOne({_id: id}, callback);
};

/**
 * 根据ID删除音乐
 * @param {String} id 音乐id
 * @param {Function} callback 回调函数
 */
module.exports.deleteMusicById = function(id, callback) {
	Music.remove({_id: id}, function(err) {
		callback(err);
	});
};

/**
 * 根据用户ID获取音乐总数
 * @param {String} userid 用户id
 * @param {Function} callback 回调函数
 */
module.exports.getMusicTotal = function(userid, callback) {
	Music.count({user_id: userid}, function(err, count) {
		callback(err, count);
	});
};
