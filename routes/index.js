var express = require('express');
var router = express.Router();
var connection = require('../database/msession');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/login').get(function (req, res) {
    if (req.session.user) {
        res.redirect('/home');
    }
    res.render('login', {title : '用户登录'});
}).post(function (req, res) {

    console.log(req.body.username);
    var  sql = "SELECT * FROM Users where name=?";//+req.body.username;
    var parameters = [req.body.username];
    connection.connect();
    connection.query(sql, parameters,function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.redirect('/login');
            return;
        }
        var pwd = result[0].userpwd;

        console.log(result[0].userid + '  ' + result[0].name + '  ' + result[0].userpwd);

        if (req.body.password === pwd) {
            // var user= {
            //     username: result[0].name,
            //     password: result[0].userpwd,
            // }
            req.session.user = result[0];
            res.redirect('home');
        } else {
            req.session.error = '用户名或密码不正确';
            res.redirect('/login');
        }
        connection.end();
    });


    // var user = {
    //     username: 'admin',
    //     password: '123456'
    // }
    // if (req.body.username === user.username && req.body.password === user.password) {
    //     req.session.user = user;
    //     res.redirect('/home');
    // } else {
    //     req.session.error = '用户名或密码不正确';
    //     res.redirect('/login');
    // }

});

router.get('/logout', function (req, res) {
    req.session.user = null;
    res.redirect('/');
});

router.get('/home', function (req, res) {
    authentication(req, res);
    res.render('home', {title: 'Home',});
});

function authentication(req, res) {
    if (!req.session.user) {
        req.session.error = '请先登录';
        return res.redirect('/login');
    }
}

module.exports = router;
