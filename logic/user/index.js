var crypto = require("crypto");

var mod = module.exports = {};

mod.verifyStr = function(str) {
	if (!str) {
		return "";
	};
	return crypto.createHash('md5').update(str).digest("hex");
};

mod.verifyPassword = function(key, password, cb) {
	if (!key || !password) {
		Log.error("verifyPassword param error");
		cb && cb(new Error("param error"));
		return;
	};
	this.getUserInfoFiled(key, "password", function(err, ret) {
		if (err) {
			Log.error(err);
			cb && cb(err);
			return;
		};

		if (mod.verifyStr(password) !== ret) {
			Log.error("verifyPassword 密码不一致", password);
			cb && cb(new Error("verifyPassword password error"));
			return;
		};
		cb && cb(null, true);
	});
};

mod.getUserInfo = function(key, cb) {

};
mod.getUserInfoFiled = function(key, filed, cb) {

	if (!Db || !Db.redis) {
		Log.error("getUserInfoFiled redis error");
		cb && cb(new Error("redis error"));
		return;
	};

	Db.redis.hget(`user:${key}`, filed, function(err, ret) {
		if (err) {
			Log.error(err);
			cb && cb(err);
			return;
		};
		cb && cb(null, ret);
	});
};

mod.isUserExist = function(key, cb) {

	if (!Db || !Db.redis) {
		Log.error("isExistUser redis error");
		cb && cb(new Error("redis error"));
		return;
	};

	Db.redis.exists(`user:${key}`, function(err, ret) {
		if (err) {
			Log.error(err);
			cb && cb(err);
			return;
		};
		cb && cb(null, ret);
	});
};
mod.isUserLogin = function(username, cb) {

	if (!Db || !Db.redis) {
		Log.error("isUserLogin redis error");
		cb && cb(new Error("redis error"));
		return;
	};

	Db.redis.ttl(`token:${username}`, function(err, ret) {
		if (err) {
			Log.error(err);
			cb && cb(err);
			return;
		};
		cb && cb(null, ret);
	});
};

mod.userLogout = function(username, cb) {

	if (!Db || !Db.redis) {
		Log.error("userLogout redis error");
		cb && cb(new Error("redis error"));
		return;
	};

	Db.redis.del(`token:${username}`, function(err, ret) {
		if (err) {
			Log.error(err);
			cb && cb(err);
			return;
		};
		cb && cb(null, ret);
	});
};

mod.saveUserToken = function(username, token, cb) {

	if (!Db || !Db.redis) {
		Log.error("saveUserToken redis error");
		cb && cb(new Error("redis error"));
		return;
	};

	Db.redis.set(`token:${username}`, token, "EX", 1800, function(err, ret) {
		if (err) {
			Log.error(err);
			cb && cb(err);
			return;
		};
		cb && cb(null, ret);
	});
};
mod.saveUserInfo = function(key, info, cb) {

	if (!Db || !Db.redis) {
		Log.error("saveUserInfo redis error");
		cb && cb(new Error("redis error"));
		return;
	};

	var l = [];
	for (var k in info) {
		if (k == "password1") {
			continue;
		};

		if (k == "password") {
			var p = this.verifyStr(info[k]);
			l = l.concat([k, p]);
		} else {
			l = l.concat([k, info[k]]);
		}
	};
	Log.info(l);
	Db.redis.hmset(`user:${key}`, l, function(err, ret) {
		if (err) {
			Log.error(err);
			cb && cb(err);
			return;
		};
		cb && cb(null, ret);
	});
};