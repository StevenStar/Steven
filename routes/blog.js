var express = require('express');
var config = require('../config');
var logger = require('../common/logger');
var blog = express.Router();
var sign = require('../controllers/sign');
var user = require('../controllers/user');
var comment = require('../controllers/comment');
var content = require('../controllers/content');
var message = require('../controllers/message');
var music = require('../controllers/music');
var picture = require('../controllers/picture');
var site = require('../controllers/site');
var auth = require('../middlewares/auth.js');

blog.use(function(req, res, next) {
  logger.info(req.method, 'blog' + req.url);
  next();
});

// GET blog page
blog.get('/', site.blog);
// GET blog page
blog.get('/index/:name/:page/index', site.blog);
// show content detail
blog.get('/content/:id', site.content);
// add comment content
blog.post('/content/:id/comment', site.comment);
// show all shares
blog.get('/share', site.share);
// show all musics
blog.get('/music', site.music);
// show all pictures
blog.get('/picture/:page/index', site.picture);
// add comment content
blog.post('/about/message', site.message);
// show unread comment and message
blog.get('/unread', site.unread);
blog.get('/unread/:page/comment', site.unread);
blog.get('/unread/:page/message', site.unread);
// show unread comment and message
blog.get('/search', site.search);

// sign
if (config.allow_sign_up) {
  blog.get('/signup', sign.showSignup);
  blog.post('/signup', sign.signup);
}
blog.get('/signin', sign.showSignin);
blog.post('/signin', sign.signin);
blog.get('/signout', sign.signout);
blog.get('/signin', sign.signin);

// admin
blog.get('/admin', auth.adminRequired, user.showAdmin);
blog.get('/admin/user/setting', auth.adminRequired, user.showSetting);
blog.post('/admin/user/setting', auth.adminRequired, user.setting);
blog.get('/admin/user/:page/index', auth.adminRequired, user.showUsers);
blog.get('/admin/user/:uid/detail', auth.adminRequired, user.showUser);
blog.post('/admin/user/:uid/update', auth.adminRequired, user.updateUser);

// comments
blog.get('/admin/comment/:page/index', auth.adminRequired, comment.comment);
blog.get('/admin/comment/:cmid/detail', auth.adminRequired, comment.showComment);
blog.post('/admin/comment/:cmid/update', auth.adminRequired, comment.updateComment);
blog.get('/admin/comment/del', auth.adminRequired, comment.deleteComment);
blog.post('/admin/comment/:cmid/del', auth.adminRequired, comment.deleteComment);
blog.post('/admin/comment/:cmid/reply', auth.adminRequired, comment.replyComment);

// messages
blog.get('/admin/message/:page/index', auth.adminRequired, message.message);
blog.get('/admin/message/:mid', auth.adminRequired, message.showMessage);
blog.post('/admin/message/:mid/update', auth.adminRequired, message.updateMessage);
blog.get('/admin/message/:mid/del', auth.adminRequired, message.deleteMessage);

// contents
blog.get('/admin/content/:page/index', auth.adminRequired, content.content);
blog.get('/admin/content/:ctid/detail', auth.adminRequired, content.showContent);
blog.post('/admin/content/:ctid/update', auth.adminRequired, content.updateContent);
blog.get('/admin/content/:ctid/del', auth.adminRequired, content.deleteContent);
blog.get('/admin/content/add', auth.adminRequired, content.showAddContent);
blog.post('/admin/content/add', auth.adminRequired, content.addContent);

// musics
blog.get('/admin/music/:page/index', auth.adminRequired, music.music);
blog.get('/admin/music/:mid/del', auth.adminRequired, music.deleteMusic);
blog.get('/admin/music/add', auth.adminRequired, music.showAddMusic);
blog.post('/admin/music/add', auth.adminRequired, music.addMusic);

// pictures
blog.get('/admin/picture/:page/index', auth.adminRequired, picture.picture);
blog.get('/admin/picture/:pid/del', auth.adminRequired, picture.deletePicture);
blog.get('/admin/picture/add', auth.adminRequired, picture.showAddPicture);
blog.post('/admin/picture/add', auth.adminRequired, picture.addPicture);

// concat
blog.get('/concat', function(req, res) {
  res.render('blog/concat', {
    title: '联系我'
  });
});

// history
blog.get('/history', function(req, res) {
  res.render('blog/history', {
    title: '历史版本'
  });
});

// about
blog.get('/about', function(req, res) {
  res.render('blog/about', {
    title: '关于我'
  });
});

module.exports = blog;
