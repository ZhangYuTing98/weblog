// 编写一个中间件函数 如果此用户未登录 则可能继续访问路由 如果已经登录 就弹回首页 并提示已经登录 不需要再重复登录
exports.checkNotLogin = function (req, res, next) {
    if (req.session.user) { // 已经是登录状态
        req.session.error = '当前已经是登录状态';
        res.redirect('/');
    } else {
        next();
    }
};
// 编写一个中间件函数 如果此用户已登录 可以继续访问路由 如果此用户未登录 则跳过登录让用户继续登录
exports.checkLogin = function (req, res, next) {
    if (req.session.user) { // 已经是登录状态
        next();
    } else {
        req.session.error = '此链接需要登录才能访问，如想访问请登录';
        res.redirect('/user/signin');
    }
};