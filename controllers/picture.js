var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var Picture = require('../proxy').Picture;
var authMiddleWare = require('../middlewares/auth');
var logger = require('../common/logger');
var tools = require('../common/tools');
var utility = require('utility');
var formidable = require('formidable');

// show all pictures
module.exports.picture = function(req, res, next) {
    logger.info('get picture params with : %j', req.params);

	var ep = new eventproxy();
	ep.fail(next);
    
    var page = parseInt(req.params.page) || 1;
    var userId = req.session.user._id;
    var events = ['picture', 'total'];
    ep.all(events, function(pictures, total) {
		res.render('blog/admin/picture/index', {
			title: '图片管理',
			tools: tools,
            page: page,
            total: Math.ceil(total/config.page_limit),
			pictures: pictures
        });
    });
    Picture.getAllPictures(page, userId, ep.done(function(pictures) {
        ep.emit('picture', pictures);
	}));
    Picture.getTotal(userId, ep.done(function(total) {
        ep.emit('total', total);
    }));
};

// show add picture form
module.exports.showAddPicture = function(req, res, next) {
	res.render('blog/admin/picture/add', {
		title: '添加图片'
	});
};

// add picture
module.exports.addPicture = function(req, res, next) {
	logger.info(' received picture add params : %j', req.body);
	logger.info(' received picture files : %j', req.files);
	var ep = new eventproxy();
	ep.fail(next);

	ep.on('prop_err', function(msg) {
		res.status(422);
		res.render('blog/admin/picture/add', {
			title: '添加图片',
			error: msg
		});
	});

	var userid = req.session.user._id;
	var pictureName = validator.trim(req.body.picture_name);
	var pictureInfo = validator.trim(req.body.picture_info);
	var pictureFilename = req.files.picture_file.name;
	var pictureMimetype = req.files.picture_file.mimetype;
	var pictureSize = req.files.picture_file.size;
	var pictureExtension = req.files.picture_file.extension;

    tools.getmd5(config.PRO_PATH + '/uploads/' + pictureFilename, ep.done(function(md5){
        var pictureMd5 = md5; 
        Picture.getPictureByMd5(md5, ep.done(function(picture){
            if (picture) {
                return ep.emit('prop_err', '图片已经存在了。'); 
            }
	        Picture.newAndSave(userid, pictureName, pictureInfo, pictureFilename, pictureMimetype, pictureSize, pictureExtension, pictureMd5, ep.done(function(err) {
		        res.render('blog/admin/picture/add', {
			        title: '添加图片',
			        success: '添加图片成功。'
		        });
	        }));
        }));
    }));
};

// delete picture
module.exports.deletePicture = function(req, res, next) {
	logger.info('get deleting picture id with: %j', req.params);

	var pictureId = req.params.id;

	var ep = new eventproxy();
	ep.fail(next);

	Picture.deletePictureById(pictureId, ep.done(function(err) {
		return res.redirect('/blog/admin/picture/1/index?del=success');
	}));
};
