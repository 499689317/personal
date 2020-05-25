;
(function() {

	window.onload = function() {

		window.User = {};

		// 验证用户注册登陆表单提交
		User.verify_register = function(regform) {

			if (!regform.username.value || !regform.password1.value || !regform.password.value) {
				alert("账号密码不能为空");
				return false;
			};
			if (regform.password1.value === regform.password.value) {
				// alert(`注册${regform.username.value}新用户`);
				return true;
			};
			alert("请正确输入账号密码");
			return false;
		};
		User.verify_login = function(loginform) {

			with(loginform) {
				if (!loginform.username.value || !loginform.password.value) {
					alert("请正确输入账号密码");
					return false;
				};
			};
			// alert(`用户${loginform.username.value}登陆`);
			return true;
		};

		var register_submit = document.getElementById("register_submit");
		if (register_submit) {
			EventUtil.addHandler(register_submit, "submit", function(evt) {
				// alert("register submit before");
			});
		};
		var login_submit = document.getElementById("login_submit");
		if (login_submit) {
			EventUtil.addHandler(login_submit, "submit", function(evt) {
				
				var target = EventUtil.getTarget(EventUtil.getEvent(evt));
				var u = target.elements[0].value;
				// var p = target.elements[1].value;
				
				Utils.setLData("lu", u);
				// Utils.setLData("lp", p);
				
			});
		};
		
	};
})();