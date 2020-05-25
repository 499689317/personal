;
(function() {

	window.Travel = {};

	function userOnline(username, cb) {
		Utils.get(`/user/online?username=${username}`, function(err, ret) {
			cb && cb(err, ret);
		});
	};

	function userLogout(username, cb) {
		Utils.get(`/user/logout?username=${username}`, function(err, ret) {
			cb && cb(err, ret);
		});
	};

	function getTravelList(username, cb) {

	};

	function userLoginView(con) {
		$("#nav_logout").hide();
		$("#nav_login").show();
		$("#nav_user").text(`当前用户：${con}`);
	};

	function userLogoutView() {
		$("#nav_logout").show();
		$("#nav_login").hide();
	};

	$(function() {

		// 获取当前用户登陆信息
		// 获取当前用户个人信息

		var u = Utils.getLData("lu");
		if (u) {
			userOnline(u, function(err, ret) {
				if (err) {
					console.log("userOnline error");
					return;
				};

				if (ret.errcode != 1000) {
					console.warn("没有用户登陆", u);
					return;
				};

				userLoginView(u);

			});
		};

		$("#nav_logout_btn").click(function(event) {
			var u = Utils.getLData
			userLogout(Utils.getLData("lu"), function(err, ret) {
				if (err) {
					console.log("userLogout error");
					return;
				};
				if (ret.errcode) {
					console.log("userLogout failed");
					return;
				};
				userLogoutView();
				Utils.delLData("lu");
			});
		});

	});

})();