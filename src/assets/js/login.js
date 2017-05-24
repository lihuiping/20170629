//登录点击
$("#lg-denglu").on('click', function() {
	var mobile = $("#lg-mobile").val();
	var passwd = $("#lg-psword").val();
	if(mobile && passwd && /^1(3|5|7|8)\d{9}$/.test(mobile) && /^(.){6,20}$/.test(passwd)) {
		$.showIndicator();
		client.invoke("login", [{
			"mobile": mobile,
			"passwd": passwd
		}], function(result) {
			$.hideIndicator();
			var result = $.parseJSON(result);
			if(result.res == 1) {
				$.toast("欢迎," + mobile);
				Cache.set("flag", result.data.sig);
				Cache.set("whole_mobile", mobile);
				Cache.set("passwd", passwd);
				setTimeout(function() {
					window.location.href = "./index.html";
				}, 1500);
			} else {
				$.toast(result.msg);
			}
		})
	} else {
		$.toast("请填写正确的账户密码！");
	}
});
//用户注册
$("#user-re").on("click",function(){
		window.location.href="./register.html"
});

//忘记密码
$("#forget-ps").on("click",function(){
		window.location.href="./retrieve-psd.html"
});

$.init();