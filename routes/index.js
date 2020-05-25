var fs = require("fs");
var path = require("path");
var router = module.exports = require("express").Router();

(function() {

	function transform(filename) {
		return filename.slice(0, filename.lastIndexOf('.'))
			// 分隔符转换
			.replace(/\\/g, '/')
			// index去除
			.replace('/index', '/')
			// 路径头部/修正
			.replace(/^[/]*/, '/')
			// 路径尾部/去除
			.replace(/[/]*$/, '')
	};

	function filterHideFile(list) {
		var arr = [];
		for (var i = 0; i < list.length; i++) {
			if (list[i].substr(0, 1) === ".") {
				continue;
			};
			arr.push(list[i]);
		};
		return arr;
	};
	(function scanDirRoutes(rootDir, excludeFile) {

		if (!excludeFile) {
			// 默认入口文件为目录下的 index.js
			excludeFile = path.join(rootDir, 'index.js');
		}
		// Log.info(excludeFile);

		// 模块集合
		const routers = {}
		// 获取目录下的第一级子文件为路由文件队列
		let files = fs.readdirSync(rootDir);
		filenames = filterHideFile(files);

		// Log.info(filenames);

		while (filenames.length) {
			// 路由文件相对路径
			const relativeFilePath = filenames.shift()
			// 路由文件绝对路径
			const absFilePath = path.join(rootDir, relativeFilePath)
			// 排除入口文件
			if (absFilePath === excludeFile) {
				continue
			}
			if (fs.statSync(absFilePath).isDirectory()) {
				// 是文件夹的情况下，读取子目录文件，添加到路由文件队列中
				var sfiles = fs.readdirSync(absFilePath);
				var ffiles = filterHideFile(sfiles);
				const subFiles = ffiles.map(v => path.join(absFilePath.replace(rootDir, ''), v));
				filenames = filenames.concat(subFiles);
			} else {
				// 是文件的情况下，将文件路径转化为路由前缀，添加路由前缀和路由模块到模块集合中
				const prefix = transform(relativeFilePath)
				routers[prefix] = require(absFilePath)
			}
		};

		// Log.info(routers);
		for (const prefix in routers) {
			if (routers.hasOwnProperty(prefix)) {
				router.use(prefix, routers[prefix])
			}
		}
	})(__dirname, __filename);
})();