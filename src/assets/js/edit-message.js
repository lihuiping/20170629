
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

		var mobile = $("#bk-mobile").val();
		if(/^1(3|5|7|8)\d{9}$/.test(mobile)) {
			if($(e.target).hasClass('bg-gray')) {
				return false;
			} else {
				time($(this));
			}
			client.invoke("sendCode", [{ "mobile": mobile }], function(result) {
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

//密码找回
$(document).on("pageInit", "#backpsword", function(e, id, page) {
	myCode();

	$("#bk-commit").on("click", function() {
		var mobile = $("#bk-mobile").val();
		var code = $("#bk-code").val();
		var passwd = $("#bk-newps").val();
		if(/^1(3|5|7|8)\d{9}$/.test(mobile) && code && passwd) {
			client.invoke("findPwd", [{ "mobile": mobile, "code": code, "passwd": passwd }], function(result) {
				var result = $.parseJSON(result);
				if(result.res == 1) {
					$.toast("密码找回成功");
					setTimeout(function() {
						window.location.href = "login.html";
					}, 1500);
				} else {
					$.toast("验证码不正确，请重新输入");
				}
			})
		} else {
			$.toast("请输入正确的资料");
		}
	})
});

//播放页
$(document).on("pageInit", "#VideoPlay", function() {
	if(isLogin() == false) {
	//	noLogin();
	}
	$("#button-fenxiang").click(function() {
		$("#tip").addClass("zindex");
	})
	$("#tip").click(function() {
		$(this).removeClass("zindex");
	})

	$(".vpl_Collection").on("click", function() {
		if($(".vpl_Collection").attr('index') == "1") {
			$(".vpl_Collection").removeClass("icon-weishoucang");
			$(".vpl_Collection").addClass("icon-yishoucang");
			$(".vpl_Collection").css("color", "#ff8c24");
			$(".vpl_Collection").attr("index", "2");
		} else {
			$(".vpl_Collection").removeClass("icon-yishoucang");
			$(".vpl_Collection").addClass("icon-weishoucang");
			$(".vpl_Collection").css("color", "#383838");
			$(".vpl_Collection").attr("index", "1");
		}
	});
	$(".vpl_introduction").on("click", function() {
		$(".vpl_VideoDetail_member").toggle();
		$(".vpl_introduction").toggleClass("icon-up");

	});
	$(".vpl_slidemore_go").on("click", function() {
		$(".vpl_box_remonforyou").show();
		$(".vpl_middleline").hide();
		$(".vpl_VideoDetail").hide();
		$(".vpl_remonForyou").hide();
		$(".vpl_remonForyou_list").hide();
		$(".vpl_coment_section").hide();
		$(".vpl_remonForyou2").show();
		$(".vpl_remonForyou_list2").show();
		$(".vpl_remonForyou_list2").scrollTop(0);
	})
	$(".vpl_remonForyou_close").on("click", function() {
		$(".vpl_box_remonforyou").hide();
		$(".vpl_middleline").show();
		$(".vpl_VideoDetail").show();
		$(".vpl_remonForyou").show();
		$(".vpl_remonForyou_list").show();
		$(".vpl_coment_section").show();
		$(".vpl_remonForyou2").hide();
		$(".vpl_remonForyou_list2").hide();
	})

});


// 修改基础资料
$(document).on("pageInit", "#editmessage", function(e, id, page) {
//	client.invoke("getUserInfo", function(result) {
//		var result = $.parseJSON(result);
//		console.log(result);
//		Cache.set("issafe", result.data.isSafe);
//		var touxiang = result.data.imgurl ? result.data.imgurl : "/images/tx-120.png";
//		$("#mytouxiang-div").append("<img id='my-touxiang' src=" + touxiang + ">");
//		$("#mename").html(result.data.username ? result.data.username : result.data.mobile);
//		$("#megenger").val(parseInt(result.data.sex) ? "女" : "男");
//		$("#isAuth").html(parseInt(result.data.isAuth) ? "已认证" : "未认证");
//		$("#brdate").val(result.data.birth != '' ? result.data.birth : "");
//		$("#anquanmima").html(result.data.isSafe == 1 ? "去修改" : "去设置");
//		var phone = result.data.mobile.substr(0, 3) + "****" + result.data.mobile.substr(7);
//		$("#mobilephone").html(phone);
//		$('#brdate').date();
//		$('#brdate').on("click", function(e) {
//			e.preventDefault();
//		})
//
//	});
$("#megenger").val("女");
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
		$('#brdate').on("click",function(e){
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
	if(isWenxin) {
		$("#changetx").on("click", function() {
			var sendImg;
			client.invoke("getWxSdkSignInfo", [{ "url": window.location.href }], function(result) {
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
								client.invoke("modifyHeadImg", [{ "media_id": serverId }], function(res) {
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
					client.modifyInfo({ "imgurl": 'http://img.7cai.tv' + data.url }, function(result) {
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
		if($("#brdate").val() == "") { $.toast("请选择生日！"); return }
		var gender = $("#megenger").val() == "男" ? 0 : 1;
		client.invoke("modifyInfo", [{ "sex": gender, "birth": $("#brdate").val() }], function(result) {
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
			client.invoke("modifyPwd", [{ "oripasswd": old, "passwd": new1 }], function(result) {
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
}

//修改登录密码
$(document).on("pageInit", "#modifypwd", function(e, id, page) {
	$("#confirmmodifypwd").on("click", function() {
		ModifyPassword($("#mobile").val(), $("#password1").val(), $("#password2").val());
	})
})

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

//  反馈信息
$(document).on("pageInit", "#yijianfankui", function(e, id, page) {
	$("#tjfk").on("click", function() {
		if(!$("#fk-fklx").val()) {
			$.toast("请选择反馈类型！");
		} else if(!$(".yijian-text").val()) {
			$.toast("请输入反馈内容！");
		} else {
			client.invoke("getFKTypeLists", function(result) {
				var result = $.parseJSON(result);
			});
			var fklx = { "内容问题": 1, "播放问题": 2, "卡顿问题": 3, "会员问题": 4, "账号问题": 5, "闪退、页面加载问题": 6, "产品意见": 7 }
			client.invoke("addFkMsg", [{ "type": fklx[$("#fk-fklx").val()], "content": $(".yijian-text").val(), "contact": $(".liuyan-input").val() }], function(result) {
				var result = $.parseJSON(result);
				if(result.res == 1) {
					$.toast("已收到您的反馈！");
					setTimeout(function() {
						window.location.href = "/templets/gerenzhongxin/personmessage.html";
					}, 1500);
				}
			});
		}

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
			client.invoke("modifyInfo", [{ "username": $("#cname").val() }], function(result) {
				$.hideIndicator();
				var result = $.parseJSON(result);
				if(result.res == 1) {
					$.toast("修改成功");
					setTimeout(function() {
						window.location.href = "./editmessage.html";
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
			client.invoke("modifyMobile", [{ "orimobile": $("#old-phone").val(), "oripasswd": $("#old-passwd").val(), "mobile": $("#new-phone").val(), "code": $("#Captcha").val() }], function(result) {
				var result = $.parseJSON(result);
				if(result.res == 1) {
					$.toast("修改成功！")
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
$(document).on("pageInit", "#IdOccupied", function(e, id, page) {

	function IdentityCodeValid(code) {
		var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
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
						client.invoke("certification", [{ "truename": $("#realname").val(), "cardid": $("#testid").val() }], function(result) {
							var result = $.parseJSON(result);
							if(result.res == 1) {
								$.toast("您已通过实名认证！");
								setTimeout(function() {
									window.location.href = "/templets/gerenzhongxin/personMessage/editmessage.html";
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
		window.location.href = "./yqHaoyou.html"
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

// 开通会员    1-1     
$(document).on("pageInit", "#kaiHuiyuan", function(e, id, page) {
	$.showIndicator();

	client.invoke("getUserInfo", function(result) {
		$.hideIndicator();
		var result = $.parseJSON(result);
		if(result.res == 1) {
			if(result.data.imgurl) {
				$(".khy-tx").append("<img id='#khy-touxiang' src=" + result.data.imgurl + ">");
			} else {
				$(".khy-tx").append("<img id='#khy-touxiang' src=" + "'/images/tx-120.png'>");
			}
			if(result.data.username) {
				$("#khy-mobile").html(result.data.username + ' &nbsp;<i class="iconfont icon-kaitonghuiyuan" ></i>');
			} else {
				$("#khy-mobile").html(result.data.mobile + ' &nbsp;<i class="iconfont icon-kaitonghuiyuan" ></i>');
			}
			var isVIP = Cache.get("isVIP") || 0;
			if(!isVIP) {

				Cache.set("isVIP", result.data.isVip);
				isVIP = result.data.isVip;
				if(isVIP == 1) {
					// 已经是会员。		
					$(".user-box").append('<span id="huiyuanlogo">会员服务协议 <i class="iconfont icon-yingdaicon10"></i> &nbsp;</span>');
					$(".VIP").css("display", "none");
				}
			} else {
				$(".user-box").append('<span id="huiyuanlogo">会员服务协议 <i class="iconfont icon-yingdaicon10"></i> &nbsp;</span>');
				$(".VIP").css("display", "none");
			}
			$("#huiyuanlogo").on("click", function() {
				window.location.href = "./agreement.html";
			})
		} else {
			$.toast(result.msg);
		}

	});
	if(isWenxin) {
		var openid = Cache.get("openid") || null;
		if(!openid) {
			var code = getUrlVars()["code"] || null;
			if(code) {
				$.showIndicator();
				client.invoke("getOpenId", [{ "code": code }], function(result) {
					$.hideIndicator();
					var result = $.parseJSON(result);
					if(result.res == 1) {
						openid = result.data.openid;
						Cache.set("openid", result.data.openid);
					} else {
						$.toast(result.msg);
					}
				})
			} else {
				window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx880f0e36a4befaf8&redirect_uri=" + encodeURIComponent("http://v.7cai.tv/templets/gerenzhongxin/huiyuan/kaiHuiyuan.html") + "&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
			}
		}
	}

	//支付
	$("#kt-kaitong").on("click", function() {
		function Pay(style) {
			if(style == 'wx_pay_pub') {
				$.showIndicator();
				client.invoke("getPayOrderInfo", [{ "amount": 500, "type": style, "subject": "超级会员VIP" }], function(result) {
					$.hideIndicator();
					var result = $.parseJSON(result);
					if(result.res == 1) {
						if(result.data.isPay == 1) { //可以支付状态
							FUQIANLA.init({
								'appId': 'VWT0GaNzbX3Dqesop5zrOg', //应用ID号
								'merchId': 'm1610030006', //商户号
								'orderId': result.data.orderId, //订单号，此处为模拟订单号。具体以接入为准
								'channel': style, //开通的通道简称
								'amount': '500', //支付金额
								'subject': '超级VIP会员', //商品标题
								'notifyUrl': result.data.notifyUrl, //异步支付结果通知地址
								'extra': {
									'openid': openid,
									'cb': function() {
										window.location.href = "http://v.7cai.tv/templets/gerenzhongxin/huiyuan/tz.html";
										//											$.toast("恭喜您，成功加入VIP会员！")
										//											 setTimeout(function(){
										//											 	var token = Cache.get("flag") || "";
										//											 	var client2 = hprose.Client.create("http://192.168.1.241:82/api/api/voucher?t="+token,["isCapable"]);
										//													client2.isCapable({"actid":Cache.get("act").parseInt()},function(result){
										//														var result = $.parseJSON(result);
										//														if(result.res == 1){
										//															window.location.href = "./lqkj.html";
										//														}else{
										//															window.location.href = "/";
										//														}
										//													})
										//												
										//											},1000);
									}
								}
							});
						} else {
							$.toast(result.msg);
						}
					}
				});

			}
			if(style == "ali_pay_wap") {
				$.showIndicator();
				client.invoke("getPayOrderInfo", [{ "amount": 500, "type": style, "subject": "超级会员VIP" }], function(result) {
					$.hideIndicator();
					var result = $.parseJSON(result);
					if(result.res == 1) {
						FUQIANLA.init({
							'appId': 'VWT0GaNzbX3Dqesop5zrOg', //应用ID号
							'merchId': 'm1610030006', //商户号
							'orderId': result.data.orderId, //订单号，此处为模拟订单号。具体以接入为准
							'channel': 'ali_pay_wap', //开通的通道简称
							'amount': '500', //支付金额
							'subject': result.data.subject, //商品标题
							'notifyUrl': result.data.notifyUrl, //异步支付结果通知地址					   
						});
					} else { $.toast(result.msg) }
				});

			}

		}
		if(isWenxin) {
			Pay('wx_pay_pub');
		} else {
			Pay("ali_pay_wap");
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

	//圆圈勾选
	//	$(".my-select").on("click",function(){
	//		$(this).toggleClass("bg-myse");
	//		$(this).attr("checked",!$(this).attr("checked"));
	//	})
	//文本展开
	$(".tk-open").on("click", function() {
		$(this).toggleClass("icon-up");
		$(this).toggleClass("icon-down");
		$(this).parent().siblings().toggleClass("danhang");
	})
	//反馈问题选择
	$("#fk-fklx").picker({
		toolbarTemplate: '<header class="bar bar-nav border-no">\
		  <button class="button button-link pull-left no-border"><span class="color-gray"></span></button>\
		  <button class="button button-link pull-right close-picker color-f60"><span class="color-f60">确定</span></button>\
		  </header>',
		cols: [{
			textAlign: 'center',
			values: ['内容问题', '播放问题', '卡顿问题', '会员问题', '账号问题', '闪退、页面加载问题', '产品意见']
		}]
	});
	//退款原因选择
	$("#tuikuanyuanyin").picker({
		toolbarTemplate: '<header class="bar bar-nav border-no">\
		  <button class="button button-link pull-left no-border"><span class="color-gray"></span></button>\
		  <button class="button button-link pull-right close-picker color-f60"><span class="color-f60">确定</span></button>\
		  </header>',
		cols: [{
			textAlign: 'center',
			values: ['内容问题', '播放问题', '卡顿问题', '会员问题', '账号问题', '闪退、页面加载问题', '产品意见']
		}]
	});

	/*
		//退票按钮
		$(".mybutton-2").on("click",function(){
			$.confirm('确定要放弃观看电影吗？',
			function(){
				window.location.href="wddyp-tp.html"
			},
			function(){
				
			}
			)
		});*/

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