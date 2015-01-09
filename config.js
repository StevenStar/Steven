var path = require('path');

var debug = true;

var config = {
	debug: debug,
	allow_sign_up: true,
	name: 'StevenClub',
	description: 'Steven Personal Club',
	keywors: 'nodejs, node, exprss, mongodb',

	site_static_host: '',
	host: 'localhost',
	port: 8080,

	db: 'mongodb://127.0.0.1:27017/steven_club_dev',
	page_limit: 6,

	db_name: 'steven_club_dev',
    default_user: 'steven',

	session_secret: 'steven_club_secret',
	auth_cookie_name: 'steven_club',

	// mail config
	mail_opts: {
		host: '126',
		port: 25,
		secure: true,
		maxConnections: 5,
		maxMessages: 10,
		auth: {
			user: 'stevenjxw@126.com',
			pass: 'steven'
		}
	},

	CONTENT_PAGE: 10,

    PRO_PATH: __dirname,
	LOG_PATH: '/var/log/stevenLog.log',
	LOGPATH_INFO: '/var/log/stevenInfo.log',
	LOGPATH_ERROR: '/var/log/stevenError.log'
};

module.exports = config;
module.exports.config = config;
