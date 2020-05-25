var fs = require("fs");
var path = require("path");

// 模板渲染

var mod = module.exports = {};

var _cache = {};
var _root_file = "public/views";

/**
 * 正则提取普通字符串与表达式
 * 不检测代码：{{}}对应正则表达式为/{{([\s\S]+?)}}/g
 * 检测代码：{{=}}对应正则表达式为/{{=([\s\S]+?)}}/g
 */

function complie(str) {

	var tpl = str.replace(/\n/g, "\\n")
					.replace(/{{=([\s\S]+?)}}/g, function(match, code) {
						return "' + escape(" + code + ") + '";
					}).replace(/{{=([\s\S]+?)}}/g, function(match, code) {
						return "' + " + code + " + '";
					}).replace(/{{([\s\S]+?)}}/g, function(match, code) {
						return "';\n" + code + "\ntpl += '";
					}).replace(/\'\n/g, "\'")
					.replace(/\n\'/gm, "\'");

	tpl = "tpl = '" + tpl + "';";

	tpl = tpl.replace(/''/g, "\'\\n\'");

	tpl = 'var tpl = "";\nwith (data || {}) {\n' + tpl + '\n}\nreturn tpl;';

	// console.log(tpl);

	return new Function("escape", "data", tpl);
};

function escape(str) {
	// (?=...)：正先行断言，匹配跟随断言中定义的格式
	// (?!...)：负先行断言，匹配不跟随断言中定义的格式
	return String(str).replace(/&(?!\w+;)/g, "&amp;")
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;")
						.replace(/"/g, "&quot;")
						.replace(/'/g, "&#039");
};

mod.renderText = function(str, data) {
	return complie(str)(escape, data);
};

mod.renderFile = function(filename, data) {

	if (!_cache[filename]) {
		var text;
		try {
			text = fs.readFileSync(path.join(__dirname, `../../${_root_file}/${filename}`), "utf-8");
		} catch (e) {
			console.error(e);
			return "<p>模板文件错误</p>";
		}
		_cache[filename] = complie(text);
	};

	var complied = _cache[filename];
	return complied(escape, data);
};