
var mysql = require('mysql');

var connection = require('./setting');

// 创建连接
var connected = mysql.createConnection(connection);
// 连接数据库
// connected.connect();

// 将连接暴露
module.exports = connected;