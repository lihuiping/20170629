var Cookie = {
		Get: function(a) {
			var d, b = document.cookie.split("; "),
				c = [];
			for(i = 0; i < b.length; i++) d = b[i].split("="), c[d[0]] = unescape(d[1]);
			return a ? c[a] : c
		},
		Set: function(a, b, c, d, e, f) {
			var g, h;
			return a && b ? "" == a || "" == b ? !1 : (c && (/^[0-9]+$/.test(c) ? (g = new Date, c = new Date(g.getTime() + 1e3 * c).toGMTString()) : /^wed, \d{2} \w{3} \d{4} \d{2}\:\d{2}\:\d{2} GMT$/.test(c) || (c = void 0)), h = a + "=" + escape(b) + ";" + (c ? " expires=" + c + ";" : "") + (d ? "path=" + d + ";" : "") + (e ? "domain=" + e + ";" : "") + (f && 0 != f ? "secure" : ""), h.length < 4096 ? (document.cookie = h, !0) : !1) : !1
		},
		Del: function(a, b, c) {
			return a ? "" == a ? !1 : this.Get(a) ? (document.cookie = a + "=;" + (b ? "path=" + b + ";" : "") + (c ? "domain=" + c + ";" : "") + "expires=Thu, 01-Jan-1970 00:00:01 GMT;", !0) : !1 : !1
		}
	},
	Cache = function() {
		var storage, api = {},
			pre = "NetCQ_",
			win = window,
			doc = win.document,
			localStorageName = "localStorage",
			globalStorageName = "globalStorage",
			JsonToStr = function(a) {
				var c, b = [];
				if("string" == typeof a) return '"' + a.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + '"';
				if("undefined" == typeof a) return "undefined";
				if("object" == typeof a) {
					if(null === a) return "null";
					if(a.sort) {
						for(c = 0; c < a.length; c++) b.push(JsonToStr(a[c]));
						b = "[" + b.join() + "]"
					} else {
						for(c in a) b.push('"' + c + '":' + JsonToStr(a[c]));
						b = "{" + b.join() + "}"
					}
					return b
				}
				return a.toString()
			};
		return api.set = function() {}, api.get = function() {}, api.remove = function() {}, api.clear = function() {}, localStorageName in win && win[localStorageName] ? (storage = win[localStorageName], api.set = function(a, b) {
			"object" == typeof b ? storage.setItem(pre + a, JsonToStr(b)) : storage.setItem(pre + a, b)
		}, api.get = function(key) {
			var _v, _cache = storage.getItem(pre + key) || "";
			try {
				_v = eval("(" + _cache + ")")
			} catch(e) {
				_v = _cache
			}
			return _v
		}, api.clear = function(a) {
			a ? storage.removeItem(pre + a) : storage.clear()
		}) : globalStorageName in win && win[globalStorageName] ? (storage = win[globalStorageName][win.location.hostname], api.set = function(a, b) {
			"object" == typeof b ? storage[pre + a] = JsonToStr(b) : storage[a] = b
		}, api.get = function(key) {
			var _v, _cache = storage[pre + key].value || "";
			try {
				_v = eval("(" + _cache + ")")
			} catch(e) {
				_v = _cache
			}
			return _v
		}, api.clear = function(a) {
			if(a) delete storage[pre + a];
			else
				for(var a in storage) delete storage[a]
		}) : (api.set = function(a, b) {
			Cookie.Set(pre + a, b)
		}, api.get = function(a) {
			return Cookie.Get(pre + a)
		}, api.clear = function(a) {
			var b, c;
			if(a) Cookie.Del(pre + a);
			else if(b = document.cookie.match(/[^ =;]+(?=\=)/g))
				for(c = b.length; c--;) document.cookie = b[c] + "=0;expires=" + new Date(0).toUTCString()
		}), api
	}();
var isVIP = '';
var token = token();
//获取token
function sclient() {
	//	var token = Cache.get("flag") || "";
	return hprose.Client.create("http://test.7cai.tv/index.php/api/api/user?t=" + token, ["login", "register", "isLogin", "logout", "findPwd", "sendCode", "getUserInfo", "isSafe", "modifyInfo", "isRegister", "modifyMobile", "modifyHeadImg", "certif ication", "modifyPwd", "modifySafePwd", "getAddressList", "getAddress", "addOrEditAddress", "setDefaultAddress", "delAddress", "getPayOrderInfo", "getOpenId ", "getUploadParams", "getFriends", "getPoints", "getTicketUrl", "getFkTypeLists", "addFkMsg", "getWxSdkSignInfo"]);
	//http://test.7cai.tv/index.php
}

var client = sclient();
//获取地址参数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
var editId = GetQueryString('id');

//发送验证码
function myCode() {
	var i = 60; // 倒计时时间
	function time(t) {
		if(i == 0) {
			t.removeClass('bg-gray');
			t.html('再次发送');
			i = 60; // 与声明的倒计时时间相同
			t.bind('click'); // 时间结束后，再次绑定click事件
		} else {
			var timeWord = i < 10 ? "0" + i : i;
			t.html('已发送<span>(' + timeWord + 's)</span>'); // 显示的倒计时
			t.addClass('bg-gray');
			t.unbind('click'); // 取消click事件
			i--;
			setTimeout(function() {
				time(t);
			}, 1000);
		}
	}
	$(document).on('click', '.yanzhengma', function(e) { // 绑定事件给document元素绑定on事件，然后找要点击的class

		var mobile = $("#new-phone").val();
		if(/^1(3|5|7|8)\d{9}$/.test(mobile)) {
			if($(e.target).hasClass('bg-gray')) {
				return false;
			} else {
				time($(this));
			}
			client.invoke("sendCode", [{
				"mobile": mobile
			}], function(result) {
				var result = $.parseJSON(result);
				if(result.res == 0) {
					$.toast("验证码发送失败！");
					i = 0;
				}
			})

		} else {
			$.toast("请输入正确的手机号！")
		}
	})
}

//新增地址选择地区
$("#ad-ad-arpicker").on("click", function(e) {
	e.preventDefault();
	$("#ad-ad-arpicker").cityPicker({
		toolbarTemplate: '<header class="bar bar-nav">\
						    <button class="button button-link pull-right close-picker">确定</button>\
						    <h1 class="title">选择地区</h1>\
						    </header>'
	})
});
//添加地址按钮
var url = baseUrl() + 'member.php?r=address&m=addOrEditAddress';
$("#address-commit").on('click', function() {
	var name = $("#sh-name").val();
	var phone = $("#sh-phone").val();
	var sharea = $("#ad-ad-arpicker").val();
	var detail = $("#sh-detail").val();
	var isdef = $("#sh-moren").attr("checked") ? 1 : 0;
	if(name && /^1(3|5|7|8)\d{9}$/.test(phone) && sharea && detail) {
		$.showIndicator();
		$.ajax({
			type: "post",
			url: url,
			async: false,
			data: {
				"token": token,
				"name": name,
				"phone": phone,
				"area": sharea,
				"detail": detail,
				"isdef": isdef,
				"type": 0
			},
			success: function(result) {
				$.hideIndicator();
				var result = $.parseJSON(result);
				console.log(result);
				if(result.res == 1) {
					$.toast("添加成功");
					setTimeout(function() {
						window.location.href = "./my-address.html";
					}, 1500)
				} else {
					$.toast(result.msg);
				}
			}
		});
	} else {
		$.toast("请填写正确的资料(或手机格式)");
	}

});

//清除输入框
function myInput(dom, value) {
	$(dom).val(value);
	$(dom).on("focus", function() {
		$(this).val("");
		$(this).on("blur", function() {
			if($(this).val() == "") {
				$(this).val(value);
			}
		})
	})
}

//编辑地址 渲染
var editUrl = baseUrl() + 'member.php?r=address&m=getAddress';
$.ajax({
	type: "post",
	url: editUrl,
	async: false,
	data: {
		id: editId,
		token: token
	},
	success: function(result) {
		var result = $.parseJSON(result);
		$("#adperson").val(result.data.name);
		$("#ed-mobile").val(result.data.phone);
		$("#ed-address").val(result.data.detail);
		$(".ed-chosearea").val(result.data.area);
		$("#item-input input").attr(result.data.isdef ? "checked" : "none");
		//选择地区-编辑地址
		$("#ed-chosearea").on("click", function(e) {
			e.preventDefault();
			$("#ed-chosearea").cityPicker({
				toolbarTemplate: '<header class="bar bar-nav">\
							    <button class="button button-link pull-right close-picker">确定</button>\
							    <h1 class="title">选择地区</h1>\
							    </header>'
			});
		});
	}
});

//编辑地址完成

$("#editAddressCommit").on('click', function() {
	var name = $("#adperson").val();
	var phone = $("#ed-mobile").val();
	var sharea = $(".ed-chosearea").val();
	var detail = $("#ed-address").val();
	var isdef = $("#item-input input").attr("checked") ? 1 : 0;
	if(name && /^1(3|5|7|8)\d{9}$/.test(phone) && sharea && detail) {
		$.showIndicator();
		$.ajax({
			type: "post",
			url: url,
			async: false,
			data: {
				"token": token,
				"name": name,
				"phone": phone,
				"area": sharea,
				"detail": detail,
				"isdef": isdef,
				"type": 1,
				"id": editId
			},
			success: function(result) {
				$.hideIndicator();
				var result = $.parseJSON(result);
				if(result.res == 1) {
					$.toast("修改成功");
					setTimeout(function() {
						window.location.href = "./my-address.html";
					}, 1500)
				} else {
					$.toast(result.msg);
				};
			}
		});
	} else {
		$.toast("请填写正确的资料(或手机格式)");
	}
});

//编辑页面的点击删除地址
var delUrl = baseUrl() + 'member.php?r=address&m=delAddress';
$("#editAdd-del").on("click", function(e) {
	var id = $(e.currentTarget).attr('id');
	$.confirm('您确定要删除该地址吗？', function() {

		$.ajax({
			type: "post",
			url: delUrl,
			async: false,
			data: {
				id: editId,
				token: token
			},
			success: function(result) {
				var result = $.parseJSON(result);
				if(result.res == 1) {
					window.location.href = "my-address.html";
				} else {
					$.toast(result.data.msg);
				}
			}
		});
	});
});

function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleString().substr(0, 8);
}

// 修改基础资料
$(document).on("pageInit", "#editmessage", function(e, id, page) {
	client.invoke("getUserInfo", function(result) {
		var result = $.parseJSON(result);
		var time = getLocalTime(result.data.birthday);
		Cache.set("issafe", result.data.isSafe);
		var touxiang = result.data.imgurl ? result.data.imgurl : "assets/images/tx-120.png";
//		var touxiang = result.data.headimg ? result.data.headimg : "assets/images/tx-120.png";
		
		$("#mytouxiang-div").append("<img style='width: 3rem; height:3rem;border-radius:50%;' id='my-touxiang' src=" + touxiang + ">");
		$("#mename").html(result.data.username ? result.data.username : result.data.mobile);
		$("#megenger").val(parseInt(result.data.sex) ? "女" : "男");
		$("#isAuth").html(parseInt(result.data.isAuth) ? "已认证" : "未认证");
		$("#brdate").val(time != '' ? time : "");
		$("#anquanmima").html(result.data.isSafe == 1 ? "去修改" : "去设置");
		var phone = result.data.mobile.substr(0, 3) + "****" + result.data.mobile.substr(7);
		$("#mobilephone").html(phone);

	});
	//	$("#megenger").val("女");
	//选择性别
	$("#megenger").on("click", function(e) {

		var buttons = [{
				text: "男",
				onClick: function() {
					$("#megenger").val("男");
				}
			},
			{
				text: "女",
				onClick: function() {
					$("#megenger").val("女");
				}
			}
		]
		$.actions(buttons);
	})
	//选择生日
	$('#brdate').date();
	$('#brdate').on("click", function(e) {
		e.preventDefault();
	})
	//更改手机号跳转
	$("#changemobile").on("click", function() {
		window.location.href = "./ModifyMobile.html"
	})

	//更改名称跳转
	$("#c-username").on("click", function() {
		window.location.href = "./changename.html"
	})
	//实名跳转
	$("#smrz").on("click", function() {
		window.location.href = "./IdOccupied.html"
	})
	//安全密码跳转
	$("#c-secpsword").on("click", function() {
		window.location.href = "./ModifySecPassword.html"
	})

	//登录密码跳转
	$("#c-lgpsword").on("click", function() {
		window.location.href = "./ModifyPassword.html"
	})

	//头像
	//	$("#changetx").on("click", function() {
	//		sendImg = function(type) {
	//			if(type == 1) { // 拍照
	//				//获取一张图片
	//				api.getPicture({
	//					sourceType: 'camera',
	//					encodingType: 'jpg',
	//					mediaValue: 'pic',
	//					allowEdit: false,
	//					quality: 90,
	//					saveToPhotoAlbum: true,
	//					destinationType: 'url' //base64   字符流
	//				}, function(ret, err) {
	//					// 获取拍照数据并处理
	//					var imgSrc = ret.data;
	//					if(imgSrc != "") {
	//						var ele = $api.dom('#my-touxiang');
	//						$api.attr(ele, 'src', imgSrc);
	//					}
	//				});
	//			} else {
	//				api.getPicture({
	//					sourceType: 'album',
	//					encodingType: 'jpg',
	//					mediaValue: 'pic',
	//					destinationType: 'url',
	//					allowEdit: true,
	//					quality: 50,
	//					targetWidth: 100,
	//					targetHeight: 100,
	//					saveToPhotoAlbum: false
	//				}, function(ret, err) {
	//					if(ret) {
	//						var imgSrc = ret.data;
	//						if(imgSrc != "") {
	//							var ele = $api.dom('#my-touxiang');
	//							var ss = $api.append(ele, '<img style="width: 3rem; height:3rem;border-radius:50%;"></img>');
	//							$api.attr(ss, 'src', imgSrc);
	//						}
	//					} else {
	//						alert(JSON.stringify(err));
	//					}
	//				});
	//			}
	//
	//		};
	//		var buttons1 = [{
	//				text: "修改头像",
	//				label: true,
	//				color: "gray"
	//			},
	//			{
	//				text: '拍照',
	//				bold: true,
	//				color: 'danger',
	//				onClick: function() {
	//					sendImg(1);
	//				}
	//			},
	//			{
	//				text: '相册',
	//				//bold:true,
	//				color: 'warning',
	//				onClick: function() {
	//					sendImg(0);
	//				}
	//			}
	//		];
	//		var buttons2 = [{
	//			text: '取消'
	//		}];
	//		var groups = [buttons1, buttons2];
	//		$.actions(groups);
	//	});

		var timestamp = (new Date()).valueOf();
		var savekey = "/tx/" + timestamp;
		var options = {
			"bucket": "qicai",
			"expiration": Math.floor(new Date().getTime() / 1000) + 86400,
			'save-key': savekey,
		};
		var policy = window.btoa(JSON.stringify(options));
		var signature = md5(policy + '&Tv+UtjmQj0nWt0mUv4Q2psJI8hY=');
		options.policy = policy;
		options.signature = signature;

		$('#file_upload').uploadifive({
			'auto': true,
			'buttonClass': 'myUpload',
			'buttonText': '',
			'height': '', //按钮的大小
			'width': '',
			'formData': options,
			'fileObjName': 'file',
			'queueSizeLimit': 1,
			'removeCompleted': true,
			'multi': false,
			'fileSizeLimit': '5MB',
			'uploadScript': "http://v0.api.upyun.com/qicai",
			'onProgress': function(file, e) {
				if(e.lengthComputable) {
					var percent = Math.round((e.loaded / e.total) * 100);
				}
				if(percent == 100) {
					$.hideIndicator();
				}
			},
			'onUploadComplete': function(file, data) {
				data = $.parseJSON(data);
				if(data.message == "ok") {
					$("#my-touxiang").attr("src", 'http://img.7cai.tv' + data.url);
					$.showPreloader('上传完成，正在处理中');
					client.modifyInfo({
						"imgurl": 'http://img.7cai.tv' + data.url
					}, function(result) {
						var result = $.parseJSON(result);
						if(result.res == 1) {
							$.hidePreloader();
							$.toast("修改完成!");
						} else {
							$.toast(result.msg)
						}
					})

				} else {
					$.toast(data.message);
				}
			},
		});

	//点击我的地址
	$("#c-myaddress").on("click", function() {
		client.invoke("getAddressList", function(result) {
			var result = $.parseJSON(result);
			if(result.data.length > 0) {
				window.location.href = "my-address.html";
			} else {
				window.location.href = "add-address.html";
			}
		})
	});
	// 修改完成
	$("#modifymessage").on("click", function() {
		var imgUrl = $("#my-touxiang").attr("src");
		if($("#brdate").val() == "") {
			$.toast("请选择生日！");
			return
		}
		var gender = $("#megenger").val() == "男" ? 0 : 1;
		client.invoke("modifyInfo", [{
			"sex": gender,
			"birth": $("#brdate").val(),
			"imgurl": imgUrl
		}], function(result) {
			var result = $.parseJSON(result);
			if(result.res == 1) {
				$.toast("修改完成！");
				setTimeout(function() {
					window.location.href = "user-center.html";
				}, 1500)
			} else {
				$.toast(result.msg);
			}
		});
	});
});

//修改密码
function ModifyPassword(old, new1, new2) {
	//	$.showIndicator();
	if(/^(.){6,20}$/.test(old) && /^(.){6,20}$/.test(new1) && /^(.){6,20}$/.test(new2)) {
		if(new1 != new2) {
			$.toast("两次输入密码不一致!")
		} else if(old == new1) {
			$.toast("不能与原密码相同！")
		} else {
			client.invoke("modifyPwd", [{
				"oripasswd": old,
				"passwd": new1
			}], function(result) {
				//				$.hideIndicator();
				var result = $.parseJSON(result);
				if(result.res == 1) {
					$.toast("修改成功！");
					setTimeout(function() {
						window.location.href = "edit-message.html";
					}, 1500)
				} else {
					$.toast(result.msg);
				}
			})
		}
	} else {
		$.toast("密码格式不正确！")
	}
}

//修改登录密码
//$(document).on("pageInit", "#modifypwd",function(e, id, page) {
$("#confirmmodifypwd").on("click", function() {
	ModifyPassword($("#mobile").val(), $("#password1").val(), $("#password2").val());
})
//})

//修改安全密码
$(document).on("pageInit", "#modifysecpwd", function(e, id, page) {
	if(Cache.get("issafe") == 1) {
		$("#secmobile").attr("placeholder", "请输入安全密码");
	} else {
		$("#secmobile").attr("placeholder", "初始安全密码为:123456");
	}
	$("#confirmmodifysecpwd").on("click", function() {
		ModifyPassword($("#secmobile").val(), $("#secpassword1").val(), $("#secpassword2").val());
	});
});

//修改用户名
$(document).on("pageInit", "#changename", function(e, id, page) {
	$.showIndicator();
	client.invoke("getUserInfo", function(result) {
		$.hideIndicator();

		var result = $.parseJSON(result);
		if(result.res == 1) {
			if(result.data.username) {
				$("#cname").val(result.data.username);
			} else {
				$("#cname").val(result.data.mobile);
			}
		} else {
			$.toast(result.msg);
		}
	});

	//清除名称输入框
	$("#name-guanbi").on("click", function() {
		$("#cname").val("");
	})

	// 点击修改
	$("#chname").on("click", function() {

		if($("#cname").val()) {
			$("#chname").on("click", function() {
				if($("#cname").val().length < 6 || $("#cname").val().length > 20 || containSpecial($("#cname").val())) {
					$.toast("请按提示重新输入！");
				}
			})

			function containSpecial(s) {
				var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)]/);
				return(containSpecial.test(s));
			}
			$.showIndicator();
			client.invoke("modifyInfo", [{
				"username": $("#cname").val()
			}], function(result) {
				$.hideIndicator();
				var result = $.parseJSON(result);
				if(result.res == 1) {
					$.toast("修改成功");
					setTimeout(function() {
						window.location.href = "edit-message.html";
					}, 1000)
				} else {
					$.toast(result.msg);
				}
			});
		}
	});
});

//修改手机号
$(document).on("pageInit", "#modifynumber", function(e, id, page) {
	myCode();
	$("#modifymobile").on("click", function() {
		if($("#old-phone").val() && $("#old-passwd").val() && $("#new-phone").val() && $("#Captcha").val()) {
			client.invoke("modifyMobile", [{
				"orimobile": $("#old-phone").val(),
				"oripasswd": $("#old-passwd").val(),
				"mobile": $("#new-phone").val(),
				"code": $("#Captcha").val()
			}], function(result) {
				var result = $.parseJSON(result);
				console.log(result.res)
				if(result.res == 1) {
					$.toast("修改成功！")
					window.location.href = "edit-message.html"
				} else {
					$.toast(result.msg);
				};
			});
		} else {
			$.toast("项目不能为空！")
		}
	});
});

//实名认证
$("#IdOccupied").on(function(e, id, page) {

	function IdentityCodeValid(code) {
		var city = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江 ",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北 ",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏 ",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外 "
		};
		var tip = "";
		var pass = true;
		if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
			tip = "身份证号格式错误";
			pass = false;
		} else if(!city[code.substr(0, 2)]) {
			tip = "地址编码错误";
			pass = false;
		} else {
			//18位身份证需要验证最后一位校验位
			if(code.length == 18) {
				code = code.split('');
				//∑(ai×Wi)(mod 11)
				//加权因子
				var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				//校验位
				var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
				var sum = 0;
				var ai = 0;
				var wi = 0;
				for(var i = 0; i < 17; i++) {
					ai = code[i];
					wi = factor[i];
					sum += ai * wi;
				}
				var last = parity[sum % 11];
				if(parity[sum % 11] != code[17]) {
					tip = "校验位错误";
					pass = false;
				}
			}
		}
		// if(!pass) return (tip);
		return pass;
	}

	client.invoke("getUserInfo", function(result) {
		var result = $.parseJSON(result);
		console.log(result);
		if(result.res == 1) {
			if(result.data.isAuth == 1) {
				$("input").attr("placeholder", "");
				$("input").attr("disabled", true);
				$("#realname").val(result.data.realname);
				$("#testid").val(result.data.idCard);
				$("#shiming").css("display", "none");
				$("input").css("background-color", "#ebebe4");
				$(".content").append("<p class='id-p'>您已通过实名认证!</p>");
			} else {
				$("#realname").attr("placeholder", "请输入真实姓名");
				$("#testid").attr("placeholder", "请输入18位身份证号");
				$("#shiming").on("click", function() {
					var realname = $("#realname").val();
					if(!realname || !/^[\u4e00-\u9fa5]{2,6}$/.test(realname)) {
						$.toast("请输入2-6位中文姓名");
					} else if(!IdentityCodeValid($("#testid").val())) {
						$.toast("请输入18位有效身份证号");
					} else {
						client.invoke("certification", [{
							"truename": $("#realname").val(),
							"cardid": $("#testid").val()
						}], function(result) {
							var result = $.parseJSON(result);
							if(result.res == 1) {
								$.toast("您已通过实名认证！");
								setTimeout(function() {
									window.location.href = "edit-message.html";
								}, 1500)
							} else {
								$.toast(result.msg);
							}
						});
					}
				});
			}
		} else {
			$.toast(result.msg)
		}
	})
});

// 推荐好友
$(document).on("pageInit", "#tuijianYouli", function(e, id, page) {

	//好友页
	$("#haoyou-page").on("click", function() {
		window.location.href = "myshare.html"
	})

	//二维码生成
	var qrcode = new QRCode(document.getElementById("tj-erwei"), {});
	//   var uniquemark = Cache.get("uniquemark") || null;
	if(!uniquemark) {
		client.invoke("getUserInfo", function(result) {
			var result = $.parseJSON(result);
			if(result.res == 1) {
				Cache.set("uniquemark", result.data.unique);
				uniquemark = result.data.unique;
				qrcode.makeCode("http://v.7cai.tv" + "?unique=" + uniquemark);
			}
		});
	} else {
		qrcode.makeCode("http://v.7cai.tv" + "?unique=" + uniquemark);
	}

	$("#sinashare").on("click", function() {
		window.location.href = "http://service.weibo.com/share/share.php?appkey=&title=" + link + "&url=&pic=&searchPic=false&style=simple";
	});
	//点击复制链接1-1
	$("#share-link").on("click", function() {
		$("#link-address div").html("http://v.7cai.tv" + "?unique=" + uniquemark);
		$("#link-address").show();
		$("#link-address").on("click", function() {
			$(this).hide();
		})
	})
});

//好友页渲染1-1
$(document).on("pageInit", "#yqHaoyou", function(e, id, page) {
	client.invoke("getFriends", function(result) {
		var result = $.parseJSON(result);
		if(result.res == 1) {
			if(result.data.length > 0) {
				for(var m = 0; m < result.data.length; m++) {
					var friend = '<div class="mid-90"><li class="yq-li"><div><img src="/images/touxiang1.png"/></div><div><p>' + result.data[m].username + '</p><p>' + result.data[m].time + '</p></div></li></div>';
					$("#yqHaoyou").prepend(friend);
				}
			} else {
				$("#yqHaoyou").prepend('<div class="box" id="box"><i class="iconfont icon-xiaoxizhongxin"></i><p>您还没有推荐好友~  赶快点击推荐吧</p></div>');
			}
		} else {
			$.toast(result.msg);
			setTimeout(function() {
				window.location.href = "./tuijianYouli.html";
			}, 1500)

		}
	})
});

//部分交互，跳转
function test() {

	//在线电影卷
	$("#zxyhj-page").on("click", function() {
		window.location.href = "zxyhj.html"
	})
	//门店卡卷
	$("#mendianyouhuiquan").on("click", function() {
		window.location.href = "zxyhj.html"
	})
	//系统消息
	$("#xitxx-page").on("click", function() {
		window.location.href = "noxiaoxi.html"
	})
	//评论赞
	$("#pinglz-page").on("click", function() {
		window.location.href = "noxiaoxi.html"
	})

	//添加地址			
	$("#aa").on("click", function() {
		window.location.href = "./AddAddress.html"
	})

	//条款跳转
	$(".tiaokuan-tiaozhuan").on("click", function() {
		window.location.href = "./agreement.html";
	})

	//选择框
	$(".label-switch").on("click", function() {
		if($(this).children("input").attr("checked") == "checked") {
			$(this).children("input").attr("checked", false);
			$(this).children("div").removeClass("bg-ff8");
			$(this).children("div").addClass("bg-f5");
		} else {
			$(this).children("input").attr("checked", true);
			$(this).children("div").removeClass("bg-f5");
			$(this).children("div").addClass("bg-ff8");
		}
	});

	$(".mytouch").on("touchstart", function() {
		$(this).addClass("myop");
	})
	$(".mytouch").on("touchend", function() {
		$(this).removeClass("myop");
	})

	//文本展开
	$(".tk-open").on("click", function() {
		$(this).toggleClass("icon-up");
		$(this).toggleClass("icon-down");
		$(this).parent().siblings().toggleClass("danhang");
	});

	//阻止IOS底部拖动
	function noscroll() {
		var content = document.querySelector('.content') || null;
		var startY;

		if(content) {
			content.addEventListener('touchstart', function(e) {
				startY = e.touches[0].clientY;
			});

			content.addEventListener('touchmove', function(e) {
				// 高位表示向上滚动
				// 底位表示向下滚动
				// 1容许 0禁止
				var status = '11';
				var ele = this;

				var currentY = e.touches[0].clientY;

				if(ele.scrollTop === 0) {
					// 如果内容小于容器则同时禁止上下滚动
					status = ele.offsetHeight >= ele.scrollHeight ? '00' : '01';
				} else if(ele.scrollTop + ele.offsetHeight >= ele.scrollHeight) {
					// 已经滚到底部了只能向上滚动
					status = '10';
				}

				if(status != '11') {
					// 判断当前的滚动方向
					var direction = currentY - startY > 0 ? '10' : '01';
					// 操作方向和当前允许状态求与运算，运算结果为0，就说明不允许该方向滚动，则禁止默认事件，阻止滚动
					if(!(parseInt(status, 2) & parseInt(direction, 2))) {
						e.preventDefault();
					}
				}
			});
		}
	}
	noscroll();
}

test();
$.init();