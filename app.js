var path = require("path");
var http = require('http');
var express = require('express');

var app = express();

var argv = (function() {
    var arg = {};
    var args = process.argv;
    for (var i = 0; i < args.length; i++) {
        var tmp = args[i].split("=");
        arg[tmp[0]] = tmp[1];
    };
    return arg;
})();

global.Conf = require('./utils/config');
global.Log = require("./utils/logger").colorprint;
global.Cout = require("./utils/logger").cout;
global.Db = require("./db");
global.Logic = require("./logic");

app.enable('trust proxy');
app.disable('etag');
app.disable('x-powered-by');

app.use(require('cors')({
    origin: true,
    credentials: true
}));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({
    extended: false
}));
app.use(require('cookie-parser')());

app.use(function(req, res, next) {
    // TODO 部份api接口需要处理中文乱码问题
    // 这里通过writeHead方式写入请求头时候，在请求静态页面时报错
    // 这里有个问题，当请求静态文件时也走这个中间件，猜测一下，访问静态文件不会被setHeader影响，但调用writeHead报错
    res.setHeader("Content-Type", "application/json");
    // res.writeHead(200, {"Content-Type": "application/json"});
    next();
});
app.use(require("./routes"));
app.use(require('./utils/errorhandler')());

app.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', function(err) {
    console.error('Uncaught Exception: ', err.message, err.stack);
});

var port = Conf.get("http:port");
var httpserver = http.createServer(app);
httpserver.listen(port, "0.0.0.0");
httpserver.on('error', function(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
httpserver.on('listening', function() {
    var addr = httpserver.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.info('http listening on ' + bind);
});