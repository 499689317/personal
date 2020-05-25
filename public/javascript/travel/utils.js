;
(function() {

	window.Utils = {};

	Utils.get = function(url, cb) {
		$.ajax({
				url: url,
				type: 'GET'
			})
			.done(function(ret) {
				console.log("get success", ret);
				cb && cb(null, ret);
			})
			.fail(function(err) {
				console.error("get error", err);
				cb && cb(err);
			});
	};
	Utils.post = function(url, data, cb) {
		$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data: data
			})
			.done(function(ret) {
				console.log("post success", ret);
				cb && cb(null, ret);
			})
			.fail(function(err) {
				console.error("post error", err);
				cb && cb(err);
			});
	};

	Utils.getLData = function(key) {
		if (typeof(Storage) == "undefined") {
			console.error("请使用其它浏览器访问");
			return "";
		} else {
			return localStorage.getItem(key);
		};
	};
	Utils.setLData = function(key, value) {
		if (typeof(Storage) == "undefined") {
			console.error("请使用其它浏览器访问");
		} else {
			return localStorage.setItem(key, value);
		};
	};
	Utils.delLData = function(key) {
		if (typeof(Storage) == "undefined") {
			console.error("请使用其它浏览器访问");
		} else {
			return localStorage.removeItem(key);
		};
	};
	Utils.getSData = function(key) {
		if (typeof(Storage) == "undefined") {
			console.error("请使用其它浏览器访问");
			return "";
		} else {
			return sessionStorage.getItem(key);
		};
	};
	Utils.setSData = function(key, value) {
		if (typeof(Storage) == "undefined") {
			console.error("请使用其它浏览器访问");
		} else {
			return sessionStorage.setItem(key, value);
		};
	};
	Utils.delSData = function(key) {
		if (typeof(Storage) == "undefined") {
			console.error("请使用其它浏览器访问");
		} else {
			return sessionStorage.removeItem(key);
		};
	};
})();