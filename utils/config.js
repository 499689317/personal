var fs = require("fs");
var path = require("path");
var conf = module.exports = require("nconf");

const env = process.env.NODE_ENV || "development";

var confFile = path.join(__dirname, "../", `config/app_${env}.json`);
conf.file('server config', {
	file: confFile
});