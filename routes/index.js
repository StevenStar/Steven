var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: '个人主页'
    });
});

router.get('/error', function(req, res) {
    res.render('error', {
        title: '访问出错'
    });
});

module.exports = router;