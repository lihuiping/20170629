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
//获取token
function sclient() {
	var token = Cache.get("flag") || "";
	return hprose.Client.create("http://test.7cai.tv/index.php/api/api/user?t=" + token, ["login", "register", "isLogin", "logout", "findPwd", "sendCode", "getUserInfo", "isSafe", "modifyInfo", "isRegister", "modifyMobile", "modifyHeadImg", "certif ication", "modifyPwd", "modifySafePwd", "getAddressList", "getAddress", "addOrEditAddress", "setDefaultAddress", "delAddress", "getPayOrderInfo", "getOpenId ", "getUploadParams", "getFriends", "getPoints", "getTicketUrl", "getFkTypeLists", "addFkMsg", "getWxSdkSignInfo"]);
	//http://test.7cai.tv/index.php
}

var client = sclient();

var getUrlVars = function() {
	var vars = [],
		hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

//判断是否登录
var isLogin = function() {
	if(Cache.get("flag")) {
		if(!Cache.get("Login")) {
			client.invoke("isLogin", [{
				"mobile": Cache.get("whole_mobile")
			}], function(result) {
				var result = $.parseJSON(result);
				if(result.res == 0) {
					$.toast("您还未登录！");
					return false;
				} else {
					Cache.set("Login", 1);
					return true;
				}
			})
		} else {
			return true;
		}

	} else {
		$.toast("您还未登录！");
		return false;
	}
}

//提示未登录跳转
var noLogin = function() {
	setTimeout(function() {
		window.location.href = "./login.html";
	}, 1500);
}

//是否VIP
var isVip = function() {
	var isVIP = Cache.get("isVIP") || 0;
	if(!isVIP) {
		client.getUserInfo(function(result) {
			var result = $.parseJSON(result);
			console.log(result);
			if(result.res == 1) {
				Cache.set("isVIP", result.data.isVip);
				isVIP = result.data.isVip;
				if(isVIP == 1) {
					window.location.href = "./perMessage-huiyuan.html";
				} else {
					window.location.href = "./user-center.html";
				}
			} else {
				$.toast(result.msg);
			}
		})
	} else {
		window.location.href = "./perMessage-huiyuan.html";
	}
}

//获取分享码
var getUrlVars = function() {
	var vars = [],
		hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
//  新增收货地址
$(document).on("pageInit", "#add-address", function(e, id, page) {
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
	$("#address-commit").on('click', function() {
		var name = $("#sh-name").val();
		var phone = $("#sh-phone").val();
		var sharea = $("#ad-ad-arpicker").val();
		var detail = $("#sh-detail").val();
		var isdef = $("#sh-moren").attr("checked") ? 1 : 0;
		if(name && /^1(3|5|7|8)\d{9}$/.test(phone) && sharea && detail) {
			$.showIndicator();
			client.invoke("addOrEditAddress", [{
				"name": name,
				"phone": phone,
				"area": sharea,
				"detail": detail,
				"isdef": isdef,
				"type": 0
			}], function(result) {
				$.hideIndicator();
				var result = $.parseJSON(result);
				if(result.res == 1) {
					$.toast("添加成功");
					setTimeout(function() {
						window.location.href = "/templets/gerenzhongxin/personMessage/MyAddress.html";
					}, 1500)
				} else {
					$.toast(result.msg);
				}
			});
		} else {
			$.toast("请填写正确的资料(或手机格式)");
		}

	})
})

//MyAddress   我的地址
$(document).on("pageInit", "#myAddress", function(e, id, page) {

	client.invoke("getAddressList", function(result) {
		var result = $.parseJSON(result);
		if(result.res == 1) {
			if(result.data.length < 1) {
				window.location.href = "./AdNnewaddress.html";
			} else {
				for(var i = 0; i < result.data.length; i++) {
					var newaddress = '<li class="isdef' + result.data[i].isdef + '"><div class="wj_address_tel"><div style="overflow:hidden;"> <span class="wj_name clearfix">' + result.data[i].name + '</span><span class="wj_tel clearfix">' + result.data[i].phone + '</span> </div> <div class="wj_adds">' +
						result.data[i].area + result.data[i].detail + '</div></div> <div class="wj_address_opration"><div class="wj_address_opration_left">	<div class="my-select">	<input type="radio" /><i class="iconfont icon-fankui"></i></div>   <span class="setdefault">设为默认<div style="display:none" class="setdefaultbutton">' + result.data[i].id + '</div></span>  </div>   <div class="wj_address_opration_right"><span class="edit-ad"><i class="iconfont  icon-bianji1"></i> 编辑<div class="sh-id" style="display:none">' + result.data[i].id + '</div></span> <span><i class="iconfont icon-shanchu1"></i></span><span class="deleteAddress"> 删除<div class="sh-id" style="display:none">' + result.data[i].id + '</div></span> </div> </div><div class="fenge"></div></li>';
					$("#getAddress").append(newaddress);
				}
			}
			//默认地址置顶
			var sm = $(".isdef1");
			$(".isdef1").remove();
			$("#getAddress").prepend(sm);
			$(".isdef1 .my-select").addClass("bg-myse");

			//设置默认地址
			$(".my-select").on("click", function() {
				var morenid = $(this).siblings("span").find(".setdefaultbutton").text();
				client.invoke("setDefaultAddress", [{
					"id": morenid
				}], function(result) {
					var result = $.parseJSON(result);
					if(result.res == 1) {
						$.toast("已设为默认地址！")
					} else {
						$.taost(result.msg);
					}
				})

			})
			//点击删除事件
			$(".deleteAddress").on("click", function() {
				var delid = parseInt(this.childNodes[1].innerHTML);
				$.confirm("您确定要删除地址吗？",
					function() {

						client.invoke("delAddress", [{
							"id": delid
						}], function(result) {
							var result = $.parseJSON(result);
							if(result.res == 1) {
								$.toast("成功删除")
								$("#getAddress .needdelete").remove();
							} else {
								$.toast(result.msg);
							}
						})
					},
					function() {})
				this.parentNode.parentNode.parentNode.className = "needdelete";
			})
			//注册点击事件
			$(".my-select").on("click", function() {
				$(".my-select").removeClass("bg-myse");
				$(this).toggleClass("bg-myse");
				$(this).attr("checked", !$(this).attr("checked"));
			})

			// 点击编辑地址事件
			$(".edit-ad").on("click", function(e) {
				Cache.set("editAddressId", $(this).find(".sh-id").text());
				window.location.href = "./editaddress.html";
			})
		} else if(result.res == 0) {
			//  	window.location.href = "/staticPage/gerenzhongxin/personMessage/AdNnewaddress.html";
		}

	});

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
};
//编辑地址 渲染
$(document).on("pageInit", "#editaddress", function(e, id, page) {
	client.invoke("getAddress", [{
		"id": parseInt(Cache.get("editAddressId"))
	}], function(result) {
		var result = $.parseJSON(result);
		myInput("#adperson", result.data.name);
		myInput("#ed-mobile", result.data.phone);
		myInput("#ed-address", result.data.detail);
		$("#ed-chosearea").val(result.data.area);
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
		})

		//编辑地址完成
		$(".button").on('click', function() {
			var name = $("#adperson").val();
			var phone = $("#ed-mobile").val();
			var sharea = $("#ed-chosearea").val();
			var detail = $("#ed-address").val();
			var isdef = $("#item-input input").attr("checked") ? 1 : 0;
			if(name && /^1(3|5|7|8)\d{9}$/.test(phone) && sharea && detail) {
				$.showIndicator();
				client.invoke("addOrEditAddress", [{
					"name": name,
					"phone": phone,
					"area": sharea,
					"detail": detail,
					"isdef": isdef,
					"type": 1,
					"id": parseInt(Cache.get("editAddressId"))
				}], function(result) {
					$.hideIndicator();
					var result = $.parseJSON(result);
					if(result.res == 1) {
						$.toast("修改成功");
						setTimeout(function() {
							window.location.href = "/templets/gerenzhongxin/personMessage/MyAddress.html";
						}, 1500)
					} else {
						$.toast(result.msg);
					}
				});
			} else {
				$.toast("请填写正确的资料(或手机格式)");
			}
		});

	})

});

// 编辑页面的删除地址
$(document).on("pageInit", "#deadd", function(e, id, page) {
	$("#deadd").on("click", function() {
		$.confirm('您确定要删除该地址吗？',
			function() {
				client.invoke("delAddress", [{
					"id": parseInt(Cache.get("editAddressId"))
				}], function(result) {
					var result = $.parseJSON(result);
					if(result.res == 1) {
						$.toast("已删除当前地址！")
						setTimeout(function() {
							window.location.href = "/templets/gerenzhongxin/personMessage/MyAddress.html";
						}, 1500)
					}
				});
			},
			function() {}
		)
	});
});



//修改密码
function ModifyPassword(old, new1, new2) {
	$.showIndicator();
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
				$.hideIndicator();
				var result = $.parseJSON(result);
				if(result.res == 1) {
					$.toast("修改成功！");
					setTimeout(function() {
						window.location.href = "/templets/gerenzhongxin/personMessage/editmessage.html";
					}, 1500)
				} else {
					$.toast(result.msg);
				}
			})
		}
	} else {
		$.toast("密码格式不正确！")
	}
};

//修改登录密码
$(document).on("pageInit", "#modifypwd", function(e, id, page) {
	$("#confirmmodifypwd").on("click", function() {
		ModifyPassword($("#mobile").val(), $("#password1").val(), $("#password2").val());
	})
});

//导航跳转
function myNav() {
	//首页
	$("#nav-shouye").on("click", function() {
		$.showIndicator();
		$("#nav-shouye span:nth-child(1)").addClass("icon-shouye-tianchong");
		$("#nav-shangcheng span:nth-child(1)").addClass("icon-shangcheng1");
		$("#nav-shangcheng span:nth-child(1)").removeClass("icon-shangcheng-tianchong");
		$("#nav-goupiao span:nth-child(1)").addClass("icon-goupiao1");
		$("#nav-goupiao span:nth-child(1)").removeClass("icon-goupiao-tianchong");
		$("#nav-faxian span:nth-child(1)").removeClass("icon-faxian-tianchong");
		$("#nav-wode span:nth-child(1)").addClass("icon-wode1");
		$("#nav-wode span:nth-child(1)").removeClass("icon-wode-tianchong");
		window.location.href = "/";
	});
	//商城
	$("#nav-shangcheng").on("click", function() {
		$("#nav-shangcheng span:nth-child(1)").addClass("icon-shangcheng-tianchong");
		$("#nav-shouye span:nth-child(1)").removeClass("icon-shouye-tianchong");
		$("#nav-goupiao span:nth-child(1)").addClass("icon-goupiao1");
		$("#nav-goupiao span:nth-child(1)").removeClass("icon-goupiao-tianchong");
		$("#nav-faxian span:nth-child(1)").removeClass("icon-faxian-tianchong");
		$("#nav-wode span:nth-child(1)").addClass("icon-wode1");
		$("#nav-wode span:nth-child(1)").removeClass("icon-wode-tianchong");
		window.location.href = "/templets/shangcheng/shangcheng.html";
	});
	//购票
	$("#nav-goupiao").on("click", function() {
		$("#nav-goupiao span:nth-child(1)").addClass("icon-goupiao-tianchong");
		$("#nav-shouye span:nth-child(1)").removeClass("icon-shouye-tianchong");
		$("#nav-shangcheng span:nth-child(1)").removeClass("icon-shangcheng-tianchong");
		$("#nav-faxian span:nth-child(1)").removeClass("icon-faxian-tianchong");
		$("#nav-wode span:nth-child(1)").addClass("icon-wode1");
		$("#nav-wode span:nth-child(1)").removeClass("icon-wode-tianchong");
		window.location.href = "/templets/goupiao/goupiao.html";
	});
	//发现
	$("#nav-faxian").on("click", function() {
		$("#nav-faxian span:nth-child(1)").addClass("icon-faxian-tianchong");
		$("#nav-shouye span:nth-child(1)").removeClass("icon-shouye-tianchong");
		$("#nav-shangcheng span:nth-child(1)").removeClass("icon-shangcheng-tianchong");
		$("#nav-goupiao span:nth-child(1)").addClass("icon-goupiao1");
		$("#nav-goupiao span:nth-child(1)").removeClass("icon-goupiao-tianchong");
		$("#nav-wode span:nth-child(1)").addClass("icon-wode1");
		$("#nav-wode span:nth-child(1)").removeClass("icon-wode-tianchong");
		window.location.href = "/templets/faxian/faxian.html";
	});
	//我的
	$("#nav-wode").on("click", function(e) {
		$("#nav-wode span:nth-child(1)").removeClass("icon-wode1");
		$("#nav-wode span:nth-child(1)").addClass("icon-wode-tianchong");
		$("#nav-shouye span:nth-child(1)").removeClass("icon-shouye-tianchong");
		$("#nav-shangcheng span:nth-child(1)").removeClass("icon-shangcheng-tianchong");
		$("#nav-goupiao span:nth-child(1)").addClass("icon-goupiao1");
		$("#nav-goupiao span:nth-child(1)").removeClass("icon-goupiao-tianchong");
		$("#nav-faxian span:nth-child(1)").removeClass("icon-faxian-tianchong");
		$.showIndicator();
		if(isLogin() == false) {
			e.preventDefault();
			noLogin();
		} else {
			isVip();
		}
	});
}

myNav();

$.init();