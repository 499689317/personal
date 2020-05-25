// var path = require("path");
var errcode = require("../../utils/errcode.js");
var router = module.exports = require("express").Router();

router.post("/register", function(req, res, next) {

	var username = req.body.username;
	var password = req.body.password;
	Log.info("user/register", username, password);

	res.setHeader("Content-Type", "text/html");

	if (!username || !password) {
		Log.error("user/register param error");
		var data = {
			tips: {
				title: "Register Error",
				content: "账号密码错误，请重新注册"
			}
		};
		var errTip = Logic.render.renderFile("tips.htm", data);

		res.end(errTip);
		return;
	};

	var key = Logic.user.verifyStr(username);

	Logic.user.isUserExist(key, function(err, ret) {
		if (err) {
			res.end(Logic.render.renderFile("tips.htm", {
				tips: {
					title: "Register Error",
					content: "账号注册失败，请重新注册"
				}
			}));
			return;
		};
		if (ret) {
			res.end(Logic.render.renderFile("tips.htm", {
				tips: {
					title: "Register Already",
					content: "账号已注册，请重新注册"
				}
			}));
			return;
		};

		Logic.user.saveUserInfo(key, req.body, function(err, ret) {
			if (err) {
				var data = {
					tips: {
						title: "Register Error",
						content: "账号注册失败，请重新注册"
					}
				};
				res.end(Logic.render.renderFile("tips.htm", data));
				return;
			};
			res.redirect(302, "/login.html");
			// res.sendFile(path.join(__dirname, "../../public/login.html"));
		});
	});
});

router.post("/login", function(req, res, next) {

	var username = req.body.username;
	var password = req.body.password;
	Log.info("user/login", username, password);

	res.setHeader("Content-Type", "text/html");

	if (!username || !password) {
		Log.error("user/login param error");
		var data = {
			tips: {
				title: "Login Error",
				content: "账号密码错误，请重新输入"
			}
		};
		var errTip = Logic.render.renderFile("tips.htm", data);

		res.end(errTip);
		return;
	};

	var key = Logic.user.verifyStr(username);

	// 判断是否存在账号
	Logic.user.isUserExist(key, function(err, ret) {
		if (err) {
			Log.error("user/login login error");
			res.end(Logic.render.renderFile("tips.htm", {
				tips: {
					title: "Login Error",
					content: "用户登陆错误"
				}
			}));
			return;
		};
		// Log.info(ret);
		if (!ret) {
			Log.error("user/login user not exist");
			res.end(Logic.render.renderFile("tips.htm", {
				tips: {
					title: "User Not Found",
					content: "用户不存在"
				}
			}));
			return;
		};

		// 判断用户是否处于已登陆状态
		Logic.user.isUserLogin(username, function(err, ret) {
			if (err) {
				Log.error("user/login token error");
				res.end(Logic.render.renderFile("tips.htm", {
					tips: {
						title: "Login Error",
						content: "用户token错误"
					}
				}));
				return;
			};
			if (Number(ret) > 0) {
				Log.warn("user/login user already login");
				res.end(Logic.render.renderFile("tips.htm", {
					tips: {
						title: "Already Login",
						content: "用户已登陆"
					}
				}));
				return;
			};
			
			Logic.user.verifyPassword(key, password, function(err, ret) {
				if (err) {
					res.end(Logic.render.renderFile("tips.htm", {
						tips: {
							title: "Login Error",
							content: "账号密码错误，请重新输入"
						}
					}));
					return;
				};

				Logic.user.saveUserToken(username, key, null);

				/**
				 * TODO 返回网页相关
				 * 重定向到首页，重定向是客户端检测到状态码（301/302），再根据报头Location字段来实现跳转
				 * /index.html是相对于当前主机目录来定位新路径，
				 * index.html是相对于当前路径来定位新路径
				 * res.sendFild返回首页，直接返回值形式，路径为当前接口路径
				 * res.render返回，需要配合默认模板(ejs)一起使用
				 * res.send可以返回Buffer,String,Object,Array
				 * res.end只能返回Buffer,String
				 * res.write与res.end一起配合使用
				 */
				res.redirect(301, "/index.html");
				// res.sendFile(path.join(__dirname, "../../public/index.html"));
			});
		});
	});
});

router.get("/online", function(req, res, next) {

	var username = req.query.username;
	Log.info("user/online", username);

	var msg = {
		errcode: errcode.success,
		errdesc: "success",
		data: {}
	};

	if (!username) {
		Log.error("user/online param error");
		msg.errcode = errcode.errparam;
		msg.errdesc = "param error";
		res.end(JSON.stringify(msg));
		return;
	};

	// 判断玩家是否处于已登陆状态
	Logic.user.isUserLogin(username, function(err, ret) {
		if (err) {
			Log.error("user/online token error");
			msg.errcode = errcode.errtoken;
			msg.errdesc = "token error";
			res.end(JSON.stringify(msg));
			return;
		};
		if (Number(ret) > 0) {
			Log.warn("user/online user already login");
			msg.errcode = errcode.user_already_login;
			msg.errdesc = "用户已登陆";
			res.end(JSON.stringify(msg));
			return;
		};
		res.end(JSON.stringify(msg));
	});
});

router.get("/logout", function(req, res, next) {

	var username = req.query.username;
	Log.info("user/logout", username);

	var msg = {
		errcode: errcode.success,
		errdesc: "success",
		data: {}
	};

	if (!username) {
		Log.error("user/logout param error");
		msg.errcode = errcode.errparam;
		msg.errdesc = "param error";
		res.end(JSON.stringify(msg));
		return;
	};

	Logic.user.userLogout(username, function(err, ret) {
		if (err) {
			Log.error("user/logout token error");
			msg.errcode = errcode.user_logout_error;
			msg.errdesc = "logout error";
			res.end(JSON.stringify(msg));
			return;
		};
		
		res.end(JSON.stringify(msg));
	});
});