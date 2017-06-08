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

// 修改基础资料
$(document).on("pageInit", "#editmessage", function(e, id, page) {

	client.invoke("getUserInfo", function(result) {
		var result = $.parseJSON(result);
		console.log(result);
		Cache.set("issafe", result.data.isSafe);
		var touxiang = result.data.imgurl ? result.data.imgurl : "/images/tx-120.png";
		$("#mytouxiang-div").append("<img id='my-touxiang' src=" + touxiang + ">");
		$("#mename").html(result.data.username ? result.data.username : result.data.mobile);
		$("#megenger").val(parseInt(result.data.sex) ? "女" : "男");
		$("#isAuth").html(parseInt(result.data.isAuth) ? "已认证" : "未认证");
		$("#brdate").val(result.data.birth != '' ? result.data.birth : "");
		$("#anquanmima").html(result.data.isSafe == 1 ? "去修改" : "去设置");
		var phone = result.data.mobile.substr(0, 3) + "****" + result.data.mobile.substr(7);
		$("#mobilephone").html(phone);
		$('#brdate').date();
		$('#brdate').on("click", function(e) {
			e.preventDefault();
		})

	});

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
	if(isWenxin) {
		$("#changetx").on("click", function() {
			var sendImg;
			client.invoke("getWxSdkSignInfo", [{
				"url": window.location.href
			}], function(result) {
				var result = $.parseJSON(result);
				if(result.res == 1) {
					wx.config({
						debug: false,
						appId: result.data.appid,
						timestamp: result.data.timestamp,
						nonceStr: result.data.noncestr,
						signature: result.data.signature,
						jsApiList: ["chooseImage", "previewImage", "uploadImage"]
					});
				} else {
					$.toast(result.msg);
				}
			});
			sendImg = function(type) {
				wx.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						wx.uploadImage({
							localId: localIds[0],
							isShowProgressTips: 1,
							success: function(res) {
								var serverId = res.serverId;
								client.invoke("modifyHeadImg", [{
									"media_id": serverId
								}], function(res) {
									var res = $.parseJSON(res);
									if(res.res == 1) {
										$.toast("修改成功");
									} else {
										$.toast(res.msg);
									}
								})

							}
						})
						$("#my-touxiang").attr("src", localIds);

					},
					fail: function(res) {
						$.toast("图片获取失败");
					}
				});
			};
			var buttons1 = [{
					text: "修改头像",
					label: true,
					color: "gray"
				},
				{
					text: '拍照',
					bold: true,
					color: 'danger',
					onClick: function() {
						sendImg('camera');
					}
				},
				{
					text: '相册',
					//bold:true,
					color: 'warning',
					onClick: function() {
						sendImg('album');
					}
				}
			];
			var buttons2 = [{
				text: '取消'
			}];
			var groups = [buttons1, buttons2];
			$.actions(groups);
		});

	} else {
		var timestamp = (new Date()).valueOf();
		var savekey = "/tx/" + timestamp;
		//var savekey = "/tx/"+Cache.get("whole_mobile");
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
			//				'queueID': 'queue',
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
			//				'onAddQueueItem' : function(file) {
			//					var fileSize = file.size;
			//					var fileSizeKb = parseFloat(fileSize/1024);
			//					if(fileSizeKb>5120){
			//						$('#file_upload').uploadifive('clearQueue');
			//						alert('照片大小不能超过5MB!');
			//					}else{
			//					}
			//				},
			'onUploadComplete': function(file, data) {
				data = $.parseJSON(data);

				if(data.message == "ok") {
					//$('#file_upload').uploadifive('clearQueue');
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
	}

	//点击我的地址
	$("#c-myaddress").on("click", function() {
		client.invoke("getAddressList", function(result) {
			var result = $.parseJSON(result);
			if(result.data.length > 0) {
				window.location.href = "/templets/gerenzhongxin/personMessage/MyAddress.html";
			} else {
				window.location.href = "./AdNnewaddress.html";
			}
		})
	});
	// 修改完成
	$("#modifymessage").on("click", function() {
		if($("#brdate").val() == "") {
			$.toast("请选择生日！");
			return
		}
		var gender = $("#megenger").val() == "男" ? 0 : 1;
		client.invoke("modifyInfo", [{
			"sex": gender,
			"birth": $("#brdate").val()
		}], function(result) {
			var result = $.parseJSON(result);
			if(result.res == 1) {
				$.toast("修改完成！");
				setTimeout(function() {
					isVip();
				}, 1500)
			} else {
				$.toast(result.msg);
			}
		});
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