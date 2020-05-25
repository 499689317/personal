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
			text = fs.readFileSync(path.join(__dirname, `../../../${_root_file}/${filename}`), "utf-8");
		} catch (e) {
			console.error(e);
			return "<p>模板文件错误</p>";
		}
		_cache[filename] = complie(text);
	};

	var complied = _cache[filename];
	var html = complied(escape, data);
	// console.log(html);
	return html;
};

(function() {

	var data = {
		user: {
			name: "Devin"
		},
		items: [
			{
				name: "Devin1"
			},
			{
				name: "Devin2"
			},
			{
				name: "Devin3"
			}
		]
	};

	var str = [
		"{{ if (user.name) { }}",
		"<h2>{{=user.name}}</h2>",
		"{{ } else { }}",
		"<h2>匿名用户</h2>",
		"{{ } }}"
	].join("\n");

	// console.log(mod.renderText(str, data));

	str = [
		"{{ for (var i = 0; i < items.length; i++) { }}",
		"{{ var item = items[i]; }}",
		"<p>{{= i+1 }}、{{= item.name }}</p>",
		"{{ } }}"
	].join("\n");

	// console.log(mod.renderText(str, data));

	console.log(mod.renderFile("tip.htm", {tips: {title: "ksadhflskfghklas"}}));

})();