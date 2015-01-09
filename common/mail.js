var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var util = require('util');
var config = require('../config');
var logger = require('./logger');

var transport = nodemailer.createTransport(smtpTransport(config.mail_opts));
var SITE_ROOT_URL = 'http://' + config.host;

/*
*  Send an email
*  @param {Object} data 邮件对象
* */
var sendMail = function(data) {
    /*if (!config.debug) {
        return;
    }*/
    logger.info('send mail with : %j', data);
    transport.sendMail(data, function(err, msg) {
        if (err) {
            logger.error('send mail failed with ： ' +  err);
        } else {
            logger.info('send mail succeed with : ' + msg);
        }
    });
};
module.exports.sendMail = sendMail;

/*
* send active email
* @param {String} who the recipient's email address
* @param {String} token reset token string
* @param {String} name the recipient's username
* */
module.exports.sendActiveMail = function(who, token, name) {
    var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
    var to = who;
    var subject = config.name + '博客帐号激活';
    var html = html = '<p>您好：' + name + '</p>' +
        '<p>我们收到您在' + config.name + '社区的注册信息，请点击下面的链接来激活帐户：</p>' +
        '<a href="' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' +
        '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
        '<p>' + config.name + '社区 谨上。</p>';
    module.exports.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html
    });
};