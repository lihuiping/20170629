//注册页面  
//1-2
var act = getUrlVars()["act"];
if(Cache.get("tuijianma")) {
	$("#mr-tuijian").val(Cache.get("tuijianma"));
	$("#tuijianren").css("display", "none");
	var tuijian = 1;
}

$("#mr-wc").on("click", function() {
	var data = [];
	var mobile = $("#mr-mobile").val();
	var psword = $("#mr-psword").val() ? $("#mr-psword").val() : "123456";
	if(/^1(3|5|7|8)\d{9}$/.test(mobile) && /^(.){6,20}$/.test(psword)) {
		if(act) {
			Cache.set("act", act);
			data = [{
				"mobile": mobile,
				"passwd": psword,
				"act": act
			}];
		} else {
			if(tuijian) {
				data = [{
					"mobile": mobile,
					"passwd": psword,
					"topuser": $("#mr-tuijian").val()
				}];
			} else {
				data = [{
					"mobile": mobile,
					"passwd": psword,
					"tjmobile": $("#mr-tuijian").val()
				}];
			}
		}

		client.invoke("register", data, function(result) {
			var result = $.parseJSON(result);
			if(result.res == 1) {
				client.invoke("login", [{
					"mobile": mobile,
					"passwd": psword
				}], function(result) {
					var result = $.parseJSON(result);
					if(result.res == 1) {
						$.toast("注册成功");
						Cache.set("flag", result.data.sig);
						Cache.set("whole_mobile", mobile);
						Cache.set("passwd", psword);
						setTimeout(function() {
							window.location.href = "./login.html";
						}, 1500);
					} else {
						$.toast(result.msg);
					}
				});
			} else {
				$.toast(result.msg);
			}
		});
	} else {
		$.toast("手机号或密码格式不正确!");
	}
});

//条款跳转
$(".tiaokuan-tiaozhuan").on("click", function() {
	window.location.href = "./agreement.html";
})

$.init();
