var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var Music = require('../proxy').Music;
var authMiddleWare = require('../middlewares/auth');
var logger = require('../common/logger');
var tools = require('../common/tools');
var utility = require('utility');

// show all musics
module.exports.music = function(req, res, next) {
    logger.info('get music params with : %j', req.params);

	var ep = new eventproxy();
	ep.fail(next);

    var page = parseInt(req.params.page) || 1;
    var userId = req.session.user._id;
    var events = ['music', 'total'];
    ep.all(events, function(musics, total) {
		res.render('blog/admin/music/index', {
			title: '分享管理',
			tools: tools,
            page: page,
            total: Math.ceil(total/config.page_limit),
			musics: musics
        });

    });
	Music.getAllMusics(page, userId, ep.done(function(musics) {
        ep.emit('music', musics);
	}));
    Music.getTotal(userId, ep.done(function(total) {
        ep.emit('total', total);
    }));

	var page = req.query.page || 0;
	Music.getAllMusics(page, ep.done(function(musics) {
		res.render('blog/admin/music/index', {
			title: '音乐管理',
			tools: tools,
			musics: musics
		});
	}));
};

// show add music form
module.exports.showAddMusic = function(req, res, next) {
	res.render('blog/admin/music/add', {
		title: '添加音乐'
	});
};

// add music
module.exports.addMusic = function(req, res, next) {
	logger.info(' received music add params : %j', req.body);
	logger.info('received music files : %j', req.files);
	var ep = new eventproxy();
	ep.fail(next);

	ep.on('prop_err', function(msg) {
		res.status(422);
		res.render('blog/admin/music/add', {
			title: '添加音乐',
			error: msg
		});
	});
	var userid = req.session.user._id;
	var musicName = validator.trim(req.body.music_name);
	var musicAuthor = validator.trim(req.body.music_author);
	var musicAlbumname = validator.trim(req.body.music_albumname);
	var musicInfo = validator.trim(req.body.music_info);
	var musicFilename = req.files.music_file.name;
	var musicExtension = req.files.music_file.extension;
	var musicSize = req.files.music_file.size;
	var musicMimetype = req.files.music_file.mimetype;

	Music.newAndSave(userid, musicName, musicAuthor, musicAlbumname, musicInfo, musicFilename, musicExtension, musicSize, musicMimetype, function(err) {
		if (err) {
			return next(err);
		}
		res.render('blog/admin/music/add', {
			title: '添加音乐',
			success: '添加音乐成功。'
		});
	});
};

// delete music
module.exports.deleteMusic = function(req, res, next) {
	logger.info('get deleting music id with: %j', req.params);

	var musicId = req.params.id;

	var ep = new eventproxy();
	ep.fail(next);

	Music.deleteMusicById(musicId, ep.done(function(err) {
		return res.redirect('/blog/admin/music/1/index?del=success');
	}));
};
