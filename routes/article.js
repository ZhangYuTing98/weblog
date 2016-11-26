var express = require('express');
var Article = require('../model').Article;
var router = express.Router();
var auth = require('../auth');

router.get('/add', auth.checkLogin, function(req, res){
    res.render('article/add', {title: '发表文章', article:{}});
});
router.post('/add', auth.checkLogin, function (req, res) {
    var article = req.body;
    if (article._id) {
        Article.update({_id: article._id}, {title:article.title, content:article.content},function (err, doc) {
            if (err) {
                req.session.error = inspect(err);
                res.redirect('back');
            } else {
                req.session.success = '文章修改成功';
                res.redirect('/article/detail/' + article._id);
            }
        });
    } else {
        article.user = req.session.user._id; // 把当前会话中的user属性的主键_id赋给user属性
        article.createAt = new Date();
        delete article._id; // 要删掉ID 因为如果提供的对象中有_id属性的话 mongodb会直接保存 不帮我们生成真正的_id 新增加的_id是一个空字符串 但是其实ID不能为空
        Article.create(article, function (err, doc) {
            if (err) {
                req.session.error = util.inspect(err);
                res.redirect('back');
            } else {
                req.session.success = '文章提交成功';
                res.redirect('/');
            }
        });
    }
});
router.get('/detail/:_id', function (req, res) {
    Article.findById(req.params._id, function (err, article) {
        res.render('article/detail', {title: '文章详情', article});
    })
});
router.get('/update/:_id', function(req, res){
    Article.findById(req.params._id, function(err, article){
        res.render('article/add', {title:'修改文章', article});
    });
});
router.get('/delete/:_id', auth.checkLogin, function (req, res) {
    Article.findById(req.params._id, function (err, article) {
        if (article.user == req.session.user._id) {
            Article.remove({_id: req.params._id}, function (err, result) {
                if (err) {
                    req.session.error = inspect(err);
                    res.redirect('back');
                } else {
                    req.session.success = '删除成功';
                    res.redirect('/');
                }
            });
        } else {
            req.session.error = '这不是你的文章，你没有权限删除';
            res.redirect('back');
        }
    });
});
module.exports = router;