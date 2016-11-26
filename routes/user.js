//创建一个处理用户相关路由的路由中间件
var express = require('express');

// 当require是一个文件夹的时候 会自动加载文件夹下面的index.js模块
var User = require('../model').User;

var multer = require('multer');

var upload = multer({dest: 'public/'});

var util = require('util');

var auth = require('../auth');

// 创建一个路由中间件的实例
var router = express.Router();

// 它也是一个路由的容器，里面可以定义很多路由
// /signin
router.get('/signup', auth.checkNotLogin, function(req, res){
    res.render('user/signup', {title: '用户注册'});
});
// 处理提交的用户注册表单 username=com$age=10 {username: 'com', age: 10}
router.post('/signup', auth.checkNotLogin, upload.single('avatar'), function (req, res) {
    var user = req.body; // username:'com', password: 'com';
    user.avatar = '/' + req.file.filename;
    User.findOne({username: user.username}, function (err, doc) {
        if (err) {
            req.session.error = util.inspect(err);
            res.redirect('back');
        } else {
            if (doc) {
/*
                // code: fail失败 ok成功 data代表数据
                res.send({code: 'fail', data: '此用户名已经被使用，请更换'});
*/
                req.session.error = '此用户名已经被使用，请更换';
                // 跳回到上一个页面 从哪来到哪去
                res.redirect('back');
            } else {
                User.create(user, function (err, doc) {
                    if (err) {
                        req.session.error = util.inspect(err);
                        res.redirect('back');
                    } else {
                        req.session.success = '恭喜你注册成功';
                        res.redirect('/user/signin');
                    }
                });
            }
        }
    });
});

router.get('/signin', auth.checkNotLogin, function(req, res){ // 登录
    res.render('user/signin', {title: '用户登录'});
});
router.post('/signin', auth.checkNotLogin, function (req, res) { // 处理用户登录表单
    var user = req.body;
    User.findOne(user, function (err, doc) {
        if (err) {
            req.session.error = util.inspect(err);
            res.redirect('back');
        } else {
            if (doc) {
                req.session.success = '登录成功';
                req.session.user = doc;
                res.redirect('/');
            } else {
                req.session.error = '用户名或密码不正确';
                res.redirect('back');
            }
        }
    })
});

router.get('/signout', auth.checkLogin, function(req, res){ // 退出
    req.session.user = null;
    req.session.success = '已退出登录';
    res.redirect('/');
});

module.exports = router;

