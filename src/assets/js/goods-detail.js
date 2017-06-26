var conf = 1;
//var url = "http://v.zy7c.com/";
var tokens = token();
var shopList = ['', baseUrl() + 'index.php?r=Goods&m=goods&id=']; //商品信息接口
var goodShopList = ['', baseUrl() + 'index.php?r=Goods&m=business&id=']; //店铺信息接口
var evaluateList = ['', baseUrl() + 'index.php?r=Comment&m=index&goods_id=']; //评价信息接口
var coventList = ['', baseUrl() + 'member.php?r=Fav_goods&m=selectfav']; //获取收藏接口
var collectList = ['', baseUrl() + 'member.php?r=Fav_goods&m=addfav']; //获取添加收藏接口
var delCollectList = ['', baseUrl() + 'member.php?r=Fav_goods&m=delfav']; //获取删除收藏接口
var addCartList = ['', baseUrl() + 'index.php?r=cart&m=add']; //获取加入购物车和立即兑换的接口
var normList = ['../assets/data/goodsRule.json', baseUrl() + 'index.php?r=Goods&m=get_det_attr']; //popup规格接口
var platformList = ['', baseUrl() + 'index.php?r=Discount_coupon&m=getAdminCoupon']; //获取平台优惠券接口
var platform = ['', baseUrl() + 'index.php?r=User_discount_coupon&m=addUserCoupon']; //获取领取优惠券接口
var shopCouponList = ['', baseUrl() + 'index.php?r=Discount_coupon&m=getShopCoupon']; //获取商店优惠券接口
var platformCoupons = ['../assets/data/platformCoupon.json', ''];
var shopCoupons = ['../assets/data/shopCoupon.json', ''];

//获取token值
//function token(){
//	return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiMTI5NSIsInYiOjEsImlhdCI6MTQ5MjE1MzE1OX0.DtxFtP4HUs6anprmhI46-MEhTHB3_YS1LawBwYOnVSU';
//}

//获取地址参数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

//axios请求跨域  公用
var header = {
	'content-type': 'application/x-www-form-urlencoded'
};
//axios处理数据转换格式  公用
function transformRequest(data) {
	var ret = '';
	for(var it in data) {
		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	};
	return ret;
};
var orderID = GetQueryString('id');

function unscape(html) {
	return html
		.replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, "\"")
		.replace(/&#39;/g, "\'");
}

//获取商品详情页面数据
var goodsDatail = new Vue({
	el: "#goods-datail",
	data: {
		datail: [],
		shop: [],
		Comment: [],
		keep: "icon-shoucang",
		keepId: ""
	},

	mounted: function() {
		//初始化加载数据
		this.showGoods();
		this.$nextTick(function() {
			this.swiper();
			this.swiper2();
		})
	},
	methods: {
		swiper2: function() {
			var tabsSwiper = new Swiper('#tabs-container', {
				speed: 100,
				onSlideChangeStart: function(swiper) {
					//三个tab切换时，通过增删.active名改变tab样式
					$(".buttons-tab  .active").removeClass('active')
					$(".buttons-tab a").eq(swiper.activeIndex).addClass('active')
				}
			});

			$(".goodsDetail-tab a").on('click', function(e) {
				e.preventDefault()
				$(".goodsDetail-tab .active").removeClass('active')
				$(this).addClass('active')
				tabsSwiper.slideTo($(this).index())
			});
			$(".goodsDetail-tab a").click(function(e) {
				e.preventDefault()
			});
		},
		swiper: function() {
			var mySwiper = new Swiper('#goodsDetailBanner', {
				//autoplay: 1000, //可选选项，自动滑动
				pagination: '.swiper-pagination',
				//loop: true,
				autoplayDisableOnInteraction: false,
				observer: true, //修改swiper自己或子元素时，自动初始化swiper
				observeParents: true, //修改swiper的父元素时，自动初始化swiper
			});    
		},
		showGoods: function() {
			//获取商品信息
			var _this = this;
			axios.get(shopList[conf] + orderID).then(function(response) {
				var data = response.data.data;
				goodsDatail.datail = data;
				goodsDatail.datail.content = unscape(goodsDatail.datail.content);
				$("#goods_id").val(data.id);
			});
			//获取店铺信息
			axios.get(goodShopList[conf] + orderID).then(function(response) {
				var data = response.data.data;
				goodsDatail.shop = data;

			});
			//获取评价
			axios.get(evaluateList[conf] + orderID).then(function(response) {
				var data = response.data.data;
				if(response.data.res === 1) {
					goodsDatail.Comment = data;
				}
			});
			//获取收藏
			axios.get(coventList[conf] + '&goodsId=' + orderID, {
				params: {
					token: tokens
				}
			}).then(function(response) {
				var data = response.data.data;
				if(response.data.res == 1) {
					$(".detail-col i").addClass("icon-yishoucang2")
					goodsDatail.keepId = data;
				}
			});
		},
		showGoodRule: function() {
			$(document).on('click', '.open-rule', function() {
				$.popup('#popup-rule');
				//初始化加载数据
				goodRule.showParameterRule();
			});
		},
		clickKeep: function(keepId) {
			if(keepId == "") {
				//添加收藏
				axios.post(collectList[conf], transformRequest({
					token: token(),
					goodsId: orderID
				}), {
					headers: header
				}).then(function(response) {
					var res = response.data.res,
						data = response.data.data;
					var msg = response.data.msg;
					if(res == 1) {
						if($(".detail-col i").addClass("icon-shoucang")) {
							$(".detail-col i").addClass("icon-yishoucang2");
							$(".detail-col i").removeClass("icon-shoucang");
							$(".detail-col p").text("已收藏");
						}
						goodsDatail.keepId = data;
						layer.open({
							content: '收藏成功',
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
					} else {
						if(data == 1) {
							layer.open({
								content: '您还没有登录,请登录!',
								skin: 'msg',
								time: 2, //2秒后自动关闭
							});
							window.location.href = 'login.html';
						}
					}
				});
			} else {
				//删除收藏
				axios.post(delCollectList[conf], transformRequest({
					token: tokens,
					id: keepId
				}), {
					headers: header
				}).then(function(response) {
					var res = response.data.res;
					goodsDatail.keepId = "";
					var msg = response.data.msg;
					if(res == 1) {
						goodsDatail.keep = "icon-shoucang";

						if($(".detail-col i").addClass("icon-yishoucang2")) {
							$(".detail-col i").addClass("icon-shoucang");
							$(".detail-col i").removeClass("icon-yishoucang2");
							$(".detail-col p").text("收藏");
						}
						layer.open({
							content: '已取消收藏',
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
					} else {
						layer.open({
							content: msg,
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
					}
				});
			}
		},
		//加入购物车和立即兑换
		addShoping: function(num) {
			//加入购物车
			if(num == 1) {
				var flag = true;
				var ids = "";

				$(".ruleClass b").each(function(i, v) {
					if($(v).text() == "") {
						layer.open({
							content: '请选择' + $(v).attr('data-val'),
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
						flag = false;
						return false;
					} else {
						if(ids == "") {
							ids = $(v).attr("attrId");
						} else {
							ids += "," + $(v).attr("attrId");
						}
					}
				});

				if(flag) {
					var goods_id = $("#goods_id").val();
					var goods_number = $("#goods_number").val();
					axios.post(addCartList[conf], transformRequest({
						token: tokens,
						goods_id: goods_id,
						attr: ids,
						number: goods_number,
						fast: 0
					}), {
						headers: header
					}).then(function(response) {
						var res = response.data.res;
						var msg = response.data.msg;
						var carId = response.data.data;
						if(res == 1) {
							layer.open({
								content: '商品已加入购物车, </br> 赶紧把它抱回家吧~',
								skin: 'msg',
								time: 2, //2秒后自动关闭
							});
						} else {
							if(msg == "请先登录！") {
								layer.open({
									content: '您还没有登录,请登录!',
									skin: 'msg',
									time: 2, //2秒后自动关闭
								});
								setTimeout(function() {
									window.location.href = 'login.html';
								}, 1000);
							} else {
								if(msg == "属性选择错误") {
									layer.open({
										content: '请选择样式!',
										skin: 'msg',
										time: 2, //2秒后自动关闭
									});
								} else {
									layer.open({
										content: msg,
										skin: 'msg',
										time: 2, //2秒后自动关闭
									});
								}

							}
						}
					});
				}
			} else if(num == 0) {
				//立即支付  参数fast 不能删 必传1
				var flag = true;
				var ids = "";
				$(".ruleClass b").each(function(i, v) {
					if($(v).text() == "") {
						layer.open({
							content: '请选择' + $(v).attr('data-val'),
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
						flag = false;
						return false;
					} else {
						if(ids == "") {
							ids = $(v).attr("attrId");
						} else {
							ids += "," + $(v).attr("attrId");
						}
					}

				});
				if(flag) {
					var goods_id = $("#goods_id").val();
					var goods_number = $("#goods_number").val();
					axios.post(addCartList[conf], transformRequest({
						token: tokens,
						goods_id: goods_id,
						attr: ids,
						number: goods_number,
						fast: 1
					}), {
						headers: header
					}).then(function(response) {
						var res = response.data.res;
						var msg = response.data.msg;
						var carId = response.data.data;
						if(res == 1) {
							window.location.href = "./confirmOrder.html?attr=" + carId;
						} else {
							if(msg == "请先登录！") {
								layer.open({
									content: '您还没有登录,请登录!',
									skin: 'msg',
									time: 2, //2秒后自动关闭
								});
								setTimeout(function() {
									window.location.href = 'login.html';
								}, 1000);
							} else {
								layer.open({
									content: msg,
									skin: 'msg',
									time: 2, //2秒后自动关闭
								});
							}
						}
					});
				}
			}
		}
	}
});

//加载购物车规格POPUP
var goodRule = new Vue({
	el: '#popup-rule',
	data: {
		parameterRule: [],
		quantity: 1,
		imgSrc: "",
		imageSrc: ""
	},
	mounted: function() {
		$(document).on('click', '.popup-overlay', function() {
			var goodsDetails = $(".ruleClass").text();
			$(".item-size").text(goodsDetails);
		});
	},
	methods: {
		showParameterRule: function() {
			//初始化数据
			axios.get(normList[conf] + "&goodsId=" + orderID).then(function(response) {
				var data = response.data.data;
				goodRule.parameterRule = data;
				if(goodRule.imgSrc == "") {
					goodRule.imgSrc = data.goods_thumb;
					goodRule.imageSrc = data.goods_thumb;
				}
			});
		},
		//点击规格触发事件
		selectRule: function(chooseRule, index, pro_id, attr_id, img, data_ID) {
			var _this = this;
			$('li[data-pub="' + attr_id + '"]').removeClass('active');
			$('li[data_ID="' + data_ID + '"]').addClass('active');
			$("." + attr_id).html(chooseRule + " ");
			$("." + attr_id).attr("attrId", data_ID);
			if(img == null || img == "") {
				_this.imgSrc = _this.imageSrc;
			} else {
				_this.imgSrc = img;
			}
		},
		//点击加减号触发事件
		changeNum: function(item, num) {
			var sellPrice;
			var moneyPrice;
			//选择数量
			if(num > 0) {
				if(goodRule.quantity == item.goods_number) {
					goodRule.quantity == item.goods_number;
					layer.open({
						content: '选择数量大于库存数量',
						skin: 'msg',
						time: 2, //2秒后自动关闭
					});
				} else {
					goodRule.quantity++;
					sellPrice = item.sell_price * goodRule.quantity;
					moneyPrice = item.money * goodRule.quantity;
					$(".r-qicai em").text(sellPrice);
					$(".r-rmb em").text(moneyPrice);

				}
			} else {
				goodRule.quantity--;
				sellPrice = item.sell_price * goodRule.quantity;
				moneyPrice = item.money * goodRule.quantity;
				$(".r-qicai em").text(sellPrice);
				$(".r-rmb em").text(moneyPrice);
				if(goodRule.quantity < 1) {
					goodRule.quantity = 1;
					sellPrice = item.sell_price * goodRule.quantity;
					moneyPrice = item.money * goodRule.quantity;
					$(".r-qicai em").text(sellPrice);
					$(".r-rmb em").text(moneyPrice);
				}
			}
			$("#goods_number").val(goodRule.quantity);
		},
		//点击加入购物车触发事件
		selectFinish: function() {
			var flag = true;
			var ids = "";
			$(".ruleClass b").each(function(i, v) {
				if($(v).text() == "") {
					layer.open({
						content: '请选择' + $(v).attr('data-val'),
						skin: 'msg',
						time: 2, //2秒后自动关闭
					});
					flag = false;
					return false;
				} else {
					if(ids == "") {
						ids = $(v).attr("attrId");
					} else {
						ids += "," + $(v).attr("attrId");
					}
				}

			});
			if(flag) {
				var goods_id = $("#goods_id").val();
				var goods_number = $("#goods_number").val();
				axios.post(addCartList[conf], transformRequest({
					token: tokens,
					goods_id: goods_id,
					attr: ids,
					number: goods_number,
					fast: 0
				}), {
					headers: header
				}).then(function(response) {
					var res = response.data.res;
					var msg = response.data.msg;
					if(res == 1) {
						$.closeModal('.popup-about');
						layer.open({
							content: '商品已加入购物车, </br> 赶紧把它抱回家吧~',
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
						var goodsDetails = $(".ruleClass").text();
						$(".item-size").text(goodsDetails);
					} else {
						if(msg == "请先登录！") {
							layer.open({
								content: '您还没有登录,请登录!',
								skin: 'msg',
								time: 2, //2秒后自动关闭
							});
							setTimeout(function() {
								window.location.href = 'login.html';
							}, 1000);

						} else {
							layer.open({
								content: msg,
								skin: 'msg',
								time: 2, //2秒后自动关闭
							});
						}
					}
				});
			}
		},
		//点击立即兑换触发事件
		selectConvert: function() {
			var flag = true;
			var ids = "";
			$(".ruleClass b").each(function(i, v) {
				if($(v).text() == "") {
					layer.open({
						content: '请选择' + $(v).attr('data-val'),
						skin: 'msg',
						time: 2, //2秒后自动关闭
					});
					flag = false;
					return false;
				} else {
					if(ids == "") {
						ids = $(v).attr("attrId");
					} else {
						ids += "," + $(v).attr("attrId");
					}
				}

			});
			if(flag) {
				var goods_id = $("#goods_id").val();
				var goods_number = $("#goods_number").val();
				//				var tokens = token();
				axios.post(addCartList[conf], transformRequest({
					token: tokens,
					goods_id: goods_id,
					attr: ids,
					number: goods_number,
					fast: 1
				}), {
					headers: header
				}).then(function(response) {
					var res = response.data.res;
					var msg = response.data.msg;
					var carId = response.data.data;
					if(res == 1) {
						window.location.href = "./confirmOrder.html?attr=" + carId;
					} else {
						if(msg == "请先登录！") {
							layer.open({
								content: '您还没有登录,请登录!',
								skin: 'msg',
								time: 2, //2秒后自动关闭
							});
							setTimeout(function() {
								window.location.href = 'login.html';
							}, 1000);
						} else {
							layer.open({
								content: msg,
								skin: 'msg',
								time: 2, //2秒后自动关闭
							});
						}
					}
				});
			}
		},
		//点击叉号时
		finishClose: function() {
			var goodsDetails = $(".ruleClass").text();
			$(".item-size").text(goodsDetails);
		}
	}
});

//添加平台优惠券POPUP
var platformCoupon = new Vue({
	el: '.popup-stageticket',
	data: {
		platformCouponList: [],
		platformStatus: "",
		platform: ""
	},
	filters: {
		//人民币和七彩币切换
		couponsMoney: function(value, currency) {
			if(currency == 2) {
				//.toFixed(2)
				return "￥" + value;

			} else if(currency == 1) {
				return "七彩币" + value;
			}
		},
		//领劵和已领取切换
		receiveStatus1: function(sta) {
			if(sta == 1) {
				return value = "已领取";
			} else {
				return value = "领券";
			}
		}
	},
	mounted: function() {
		var _this = this;
		$(document).on('click', '.open-stageticket', function() {
			$.popup('.popup-stageticket');
			//初始化加载数据
			_this.showCoupon();
		});
	},
	methods: {
		showCoupon: function() {
			//获取优惠券数据
			axios.post(platformList[conf], transformRequest({
				token: tokens
			})).then(function(response) {
				var data = response.data;
				platformCoupon.platformCouponList = data;
				//优惠券无数据时,显示为空
//				if(data.res == 0) {
//					$(".gd-box li").text("暂无优惠券")
//				}
			});
		},
		receiveCoupons: function(id) {
			//领取优惠券
			//			platformCoupon.platform = "333";
			if($("#" + id).html() == "领券") {
				axios.post(platform[conf], transformRequest({
					token: tokens,
					discount_coupon_id: id
				}), {
					headers: header
				}).then(function(response) {
					var res = response.data.res;
					var msg = response.data.msg;
					if(res == 1) {
						$("#" + id).html("已领取");
						layer.open({
							content: '成功领取优惠券',
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
						var price = $("#" + id).parent().find(".price span").html();
						$(".item-nump").text(price);
					} else {
						layer.open({
							content: msg,
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
					};
				});
			};
		}
	}
});

//添加商店优惠券POPUP
var shopCoupon = new Vue({
	el: '.popup-shopticket',
	data: {
		shopCouponList: []
	},
	filters: {
		couponsMoney: function(value, currency) {
			if(currency == 2) {
				//.toFixed(2)
				return "￥" + value;

			} else if(currency == 1) {
				return "七彩币" + value;
			}
		},
		receiveStatus: function(status) {
			if(status == 1) {
				return value = "已领取";

			} else {
				return value = "领券";
			}
		}
	},
	mounted: function() {

		var _this = this;
		$(document).on('click', '.open-shopticket', function() {
			$.popup('.popup-shopticket');
			//初始化加载数据
			_this.showShopCoupon();
		});
	},
	methods: {
		showShopCoupon: function() {
			var shopId = $(".userInfo").attr("shop_id");
			//			console.log(shopId);
			//获取优惠券数据
			axios.post(shopCouponList[conf], transformRequest({
				token: tokens,
				shop_id: shopId
			})).then(function(response) {
				var data = response.data;
				shopCoupon.shopCouponList = data;
				//				console.log(data);
				//优惠券无数据时,显示为空
				if(data.res == 0) {
					$(".gd-box").hide();
				}
			});
		},
		receiveCoupons: function(id) {
			//领取优惠券
			if($("#" + id).html() == "领券") {
				axios.post(platform[conf], transformRequest({
					token: tokens,
					discount_coupon_id: id
				}), {
					headers: header
				}).then(function(response) {
					var res = response.data.res;
					var msg = response.data.msg;
					if(res == 1) {
						$("#" + id).html("已领取");
						layer.open({
							content: '成功领取优惠券',
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
						var pt_price = $("#" + id).parent().find(".price span").html();
						$(".item-num").text(pt_price);
					} else {
						layer.open({
							content: msg,
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
					};
				});
			};
		}
	}
});

//分享
var allShare = new Vue({
	el: '.popup-share',
	data: {

	},
	mounted: function() {
		var _this = this;
		$(document).on('click', '.open-share', function() {
			$.popup('#popup-share');
		});
	},
	methods: {}
});

$('.buttons-tab').fixedTab({
	offset: 70
});

$(".fixed-wrap").on('click', ".buttons-tab", function(e) {
	var $buttonsTab = $(".buttons-tab").offset().top;
	var $nativeTop = $(".native-scroll").offset().top;
	var $nativeScroll = $(".native-scroll").scrollTop();
	var $heightTab = $(".buttons-tab").height();
	if($buttonsTab > $nativeTop) {
		$(".native-scroll").scrollTo({
			toT: $buttonsTab + $nativeScroll - $heightTab - 70
		});
	} else {
		//         $(".native-scroll").scrollTo({toT:cc});
	}

})

//分享功能
//获取地址参数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
var goodsShareID = GetQueryString('id');

var qq;
var wx;
apiready = function() {
	qq = api.require('qq');
	wx = api.require('wx');

};

function qqshareNews_QFriend() { //分享新闻qq给好友
	qq.shareNews({
		url: 'http://www.apicloud.com',
		title: '新闻分享',
		description: '新闻描述',
		imgUrl: 'widget://res/news.png',
		type: "QFriend"
	}, function(ret, err) {
		if(ret.status) {
			alert(JSON.stringify(ret))
		} else {
			alert(JSON.stringify(err));
		}
	});
}

function qqshareNews_QZone() { //分享新闻到QQ空间
	$.ajax({
		type: "get",
		url: "http://shop.7cai.tv/index.php?r=goods&m=share",
		data: {
			goods_id: goodsShareID,
			token: tokens
		},
		async: true,
		success: function(res) {
			qq.shareNews({
				url: 'http://www.apicloud.com',
				title: res.data.title,
				description: res.data.content,
				imgUrl: res.data.img_url,
				type: "QZone"
			}, function(ret, err) {
				if(ret.status) {
					$.toast("分享成功");
				} else {
					if(err.code == -4){
						$.toast("取消分享");
					}else if(err.code == 10009){
						$.toast("当前设备未安装qq客户端 ");
					}else{
						$.toast("分享失败");
					}
				}
			});
		}
	});
}

function shareWebpage(Vscene) { //分享微信好友,朋友圈 . 参数: session（会话） timeline（朋友圈）favorite（收藏）
	$.ajax({
		type: "get",
		url: "http://shop.7cai.tv/index.php?r=goods&m=share",
		data: {
			"goods_id": goodsShareID,
			"token": tokens
		},
		async: true,
		success: function(res) {
			wx.shareWebpage({
				apiKey: 'wx64c1ec0115c22f7f',
				scene: Vscene,
				title: res.data.title,
				description: res.data.content,
				thumb: res.data.img,
				contentUrl: 'http://www.apicloud.com'
			}, function(ret, err) {				
				if(ret.status) {
					$.toast("分享成功");
				} else {
					if(err.code == 2){
						$.toast("取消分享");
					}else if(err.code == 3){
						$.toast("发送失败");
					}else{
						$.toast("分享失败");
					}
				}
			});
		}
	});
}

//进店按钮
function goInShop() {
	layer.open({
		content: '暂未开放,敬请期待',
		skin: 'msg',
		time: 2, //2秒后自动关闭
	});
};

$.init();