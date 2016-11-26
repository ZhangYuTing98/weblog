// 第一步引入操作mongodb数据库的模块
var mongoose = require('mongoose');
mongoose.Promise = Promise;
// 第二步连接数据库
var config = require('../config');
mongoose.connect(config.dbUrl);

// 第三步定义用户的Schema模型骨架
var UserSchema = new mongoose.Schema({
    avatar: String,
    username: String, // 定义此集合中的文件拥有username属性
    password: String // 定义此集合中的文件拥有password属性
}, {collection: 'user'}); // 指定存储在数据库中集合的名称

// 第四步 定义模型
var User = mongoose.model('User', UserSchema);
exports.User = User;

// 文章标题title: String
// 内容content: String
// 作者user: ObjectId
// 发表时间createAt: Date
var ObjectId = mongoose.Schema.Types.ObjectId;
var ArticleSchema = new mongoose.Schema({
    title: String,
    content: String,
    user: {type: ObjectId, ref: 'User'}, // 类型是对象ID类型 ref表示引用哪个模型 此ID是哪个集合的ID
    createAt: {type: String, default: new Date()}
}, {collection: 'article'});
// 如果没有指定集合的名称 那么集合会是Article -> 小写 articles（复数）
exports.Article = mongoose.model('Article', ArticleSchema);