var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var MongoStore = require('connect-mongo')(session);
var compress = require('compression');
var cookieParser = require('cookie-parser');
var csurf = require('csurf');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorhandler = require('errorhandler');
require('./models');
var config = require('./config');
var moment = require('./common/tools').dateFormat;
var auth = require('./middlewares/auth');

var routes = require('./routes/index');
var blog = require('./routes/blog');

var app = express();

// view engine setup
app.engine('.ejs', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// setting
morgan.token('date', function() {
    return moment(Date.now(), false);
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'files')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));
app.use(multer({
	dest: './uploads',
	limits: {
		fieldNameSize: 100,
		files: 2,
		fields: 5
		}
}));
app.use(cookieParser(config.session_secret));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
	secret: config.session_secret,
    cookie: {secure: true},
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: config.db
    })

}));

// customer middleware
app.use(auth.authUser);
app.use(auth.blockUser());

app.use('/', routes);
app.use('/blog', blog);

if (!config.debug) {
    app.use(csurf());
    app.set('view cache', true);
}
app.use(busboy({
    limits: {
     Size: 10 * 1024 * 1024 // 10M
    }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
// error handler
if (config.debug) {
	app.use(errorhandler());
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if (err.status === 404) {
            return res.render('error', {
                title: '访问出错',
                message: err.message,
                error: {}
            });
        } else {
            return next(err);
        }
    });

}

module.exports = app;
