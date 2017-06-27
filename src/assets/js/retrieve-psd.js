//密码找回
myCode();

$("#bk-commit").on("click", function() {
	var mobile = $("#bk-mobile").val();
	var code = $("#bk-code").val();
	var passwd = $("#bk-newps").val();
	if(/^1(3|5|7|8)\d{9}$/.test(mobile) && code && passwd) {
		client.invoke("findPwd", [{
			"mobile": mobile,
			"code": code,
			"passwd": passwd
		}], function(result) {
			var result = $.parseJSON(result);
			if(result.res == 1) {
				$.toast("密码找回成功");
				setTimeout(function() {
					window.location.href = "./login.html";
				}, 1500);
			} else {
				$.toast("验证码不正确，请重新输入");
			}
		})
	} else {
		$.toast("请输入正确的资料");
	}
})