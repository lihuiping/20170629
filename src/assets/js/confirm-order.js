var conf = 1; //0为本地测试接口ata；1为真实接口
var toke = token(); //获取token
var address_info = ['../assets/data/address.json', baseUrl() + 'member.php?r=address&m=getDefAddress&token=' + toke]; //用户地址信息
var orderSubmit = ['../assets/data/shopping-cart.json', baseUrl() + 'index.php?r=cart&token=' + toke]; //商品列表
var normsList = ['', baseUrl() + 'index.php?r=cart&m=get_cart_goods_attr&token=' + toke]; //规格
var editGoods = ['', baseUrl() + 'index.php?r=cart&m=editcart&token=' + toke]; //编辑属性规格
var subOrder = ['', baseUrl() + 'member.php?r=order&m=doOrder&uid=1&token=' + toke]; //编辑属性规格
var peisong = ['', baseUrl() + 'index.php?r=shipping&token=' + toke]; //配送地址
var payStyle = ['', baseUrl() + 'index.php?r=User_discount_coupon&m=getOrderCoupon&token=' + toke]; //优惠券
var couponsList = ['../assets/data/coupons.json', baseUrl() + 'index.php?r=Discount_coupon&m=getShopCoupon&token=' + toke]; //获取优惠券接口
var couponList = ['../assets/data/coupons.json', baseUrl() + 'index.php?r=User_discount_coupon&m=addUserCoupon&token=' + toke] //领取优惠券接口
//截取字符串
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
var attrList = getQueryString('attr');

//axios请求跨域  公用
var header = {
	'content-type': 'application/x-www-form-urlencoded'
};

//axios处理数据转换格式
function transformRequest(data) {
	var ret = '';
	for(var it in data) {
		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	};
	return ret;
};

/*
 李慧萍 2017-04-01
*/
//渲染收货地址
var addressModel = new Vue({
	el: "#address",
	data: {
		addList: [],
		attrList: attrList,
	},
	mounted: function() {
		//初始化加载数据
		var _this = this;
		_this.showMode();
	},
	methods: {
		showMode: function() {
			var _this = this;
			axios.post(address_info[conf], transformRequest({
				token: toke
			})).then(function(response) {
				var datas = response.data;
				_this.addList = datas;
				if(datas.res == 0) {
					$(".addAddress").show();
					$(".addressList").hide();
				} else {
					$(".addAddress").hide();
					$(".addressList").show();
				}

			});

		}
	}
});

/*
 黄正 2017-04-01 16：03
 */

//确认订单
var flag = false;
var goodid = getQueryString('attr'); //获取商品ID
var shopids = '';
var vm = new Vue({
	el: "#order_list",
	data: {
		orderList: [],
		totalMoney: 0,
		shopid: '',
		currentProduct: '',
		delBtn: true,
		goods: [],
		donation: false,
		type: '',
		loadingFlag: true,
		typeQc: [],
		qicai: [], //店铺优惠
		xianjin: [], //平台优惠
		couponList: [], //优惠券
		payType: 1,
		prefix: "", //优惠金额前缀
		shopCoupon: "", //店铺优惠金额
		adminCoupon: "", //平台优惠金额
		shopCouponId: "", //店铺优惠ID
		adminCouponId: "", //平台优惠ID
		payment: "", //支付方式
		condition_price: ''
	},

	computed: {
		totalSumCny: function() {
			//计算总人民币
			var sum = 0;
			this.orderList.able.forEach(function(item, index) {
				item.cartlist.list.forEach(function(good, index) {
					sum += good.price * good.number;
				});
			})
			return parseInt(sum);
		},
		totalSumQcb: function() {
			//计算总七彩币
			var sum = 0;
			this.orderList.able.forEach(function(item, index) {
				item.cartlist.list.forEach(function(good, index) {
					sum += good.sell_price * good.number;
				});
			})
			return parseInt(sum);
		}
	},
	mounted: function() {
		//钩子函数
		var _this = this;
		this.showView();
		this.getCoupon();
	},

	filters: {
		//过滤器
		formatQcb: function(value, quentity) {
			if(!quentity) {
				quentity = 1;
			}
			return value * quentity;
		},
		formatMoney: function(value, quentity) {
			if(!quentity) {
				quentity = 1;
			}
			return "￥" + (value * quentity).toFixed(2);
		}
	},
	methods: {
		showView: function(obj) {
			//渲染订单商品视图
			var _this = this;
			var goodid = getQueryString('attr');
			//加载订单列表
			axios.post(orderSubmit[conf], transformRequest({
				attr: goodid
			})).then(function(response) {
				var resObj = response.data;
				_this.loadingFlag = false;
				_this.orderList = resObj.data;
				if(resObj.res == "1") {
					_this.orderList.able.forEach(function(item, index) {
						_this.shopid += item.shopid + ',';
					});
					flag = true;

					_this.$nextTick(function() {
						checkedGoods();
					});

				} else {
					$.toast(resObj.msg + ',正在前往首页...');
					setTimeout(function() {
						window.location.href = "./index.html";

					}, 1000);

				}
			});

		},
		getCoupon: function() {
			//加载优惠券
			var _this = this;

			setTimeout(function() {
				var qcSum = $("#count_qcb").text();
				var cnySum = $("#count_price").text();
				_this.condition_price = parseInt(qcSum);
				//获取优惠券
				getCouponPub();
			}, 1500);
			if(_this.payType == 1) {
				$('.pay-qc').show();
				$('.pay-cny').hide();
			}

		},
		selectAdd: function(item, id) {
			//打开配送方式列表
			shippingMethod.showMode(item, id);
		},
		getTitleHref: function(val) {
			return 'goods-detail.html?id=' + val
		},
		shopTotalCNY: function(shop, index) {
			//计算人民币总价
			var _this = this;
			var price = 0;
			shop.cartlist.list.forEach(function(item, index) {
				price += item.price * item.number;
			});
			return parseInt(price);

		},
		shopTotalQCB: function(shop, index) {
			//计算七彩币总价
			var price = 0;
			shop.cartlist.list.forEach(function(item, index) {
				price += item.sell_price * item.number;
			});
			return parseInt(price);
		},
		payMethod: function(stas) {
			//选择支付方式
			var _this = this;
			var qcSum = $("#count_qcb").html();
			var cnySum = $("#count_price").html();
			if(stas == 1) {
				_this.payType = 1;
				vm.condition_price = parseInt(qcSum);
				$('.pay-qc').show();
				$('.pay-cny').hide();
				//获取优惠券
				getCouponPub();
			} else {
				_this.payType = 2;
				vm.condition_price = parseInt(cnySum);
				$('.pay-qc').hide();
				$('.pay-cny').show();
				//获取优惠券
				getCouponPub();
			}
		}

	}
});

//setTimeout(getCoupon, 1500);

//获取优惠券
function getCouponPub() {
	axios.post(payStyle[conf], transformRequest({
		condition_price: vm.condition_price,
		shopid: vm.shopid,
		token: toke
	})).then(function(response) {
		var datas = response.data.data;
		if(datas != null) {
			vm.couponList = datas;
			vm.qicai = datas.qicai;
			vm.xianjin = datas.xianjin;
		}

	});

}

//配送方式
var shippingMethod = new Vue({
	el: '#shipping-method',
	data: {
		expressList: [],
		checked: [],
		shopId: '',
		isCheck: '',
		flag: false,
	},
	mounted: function() {
		//初始化加载数据
		//		this.$nextTick(function() {
		//			this.showMode();
		//		});
	},
	methods: {
		showMode: function(shopid, id) {
			//配送方式
			var _this = this;
			_this.shopId = id;

			axios.post(peisong[conf], transformRequest({
				goods_id: id
			})).then(function(response) {
				var data = response.data.data;
				_this.expressList = data;
				_this.isCheck = 1;

			});
		},
		receiveExpres: function() {
			//关闭

		},
		selectExpress: function(item, index, shopid) {
			//选择配送方式
			var _this = this;

			axios.post(peisong[conf], transformRequest({
				goods_id: shopid,
				number: index
			})).then(function(response) {
				var data = response.data.data;
				_this.isCheck = index;
				shippingMethod.expressList = data;

			});
		},

	}
});

//提交商品订单

var fuqianla;
//加载付钱拉组件
apiready = function() {
	fuqianla = api.require('moduleFuQianLa');
};
//var payType = [baseUrl() + 'index.php?r=pay&m=vxpay', baseUrl() + 'index.php?r=pay&m=moneyPay'];
var qcPay = baseUrl() + 'index.php?r=pay&m=moneyPay'; //七彩币支付
var cnyPay = baseUrl() + 'index.php?r=pay&m=vxpay'; //人民币支付
var openid = Cache.get('openid');
$("#sub_order").on('click', function() {
	var msg = ""; //买家留言
	var addsend = ""; //配送方式
	var coupon = ""; //优惠券
	var addressId = $(".address-send").val(); //送货地址ID
	var payfo = $(".payfor:checked").val(); //支付方式
	$(".order-massage").each(function(item) {
		var valkey = $('.shopid').attr('val');
		var vals = $(this).val();
		var cont = valkey + ':' + vals;
		if(msg == '') {
			msg = cont;
		} else {
			msg += ',' + cont;
		}
	});

	$(".order-pei").each(function(item) {
		var valkey = $('.shopid').attr('val');
		var vals = $(this).val();
		var cont = valkey + ':' + vals;
		if(addsend == '') {
			addsend = cont;
		} else {
			addsend += ',' + cont;
		}
	});
	$(".shopid").each(function(item) {
		var valkey = $(this).attr('val');
		var vals = $('.user-coupon').val();
		var valpt = $('.pt-coupon').val();
		var cont = valkey + ':' + vals + '.' + valpt;
		if(coupon == '') {
			coupon = cont;
		} else {
			coupon += ',' + cont;
		}
	});
	var pram = {
		"addressId": addressId,
		"cartIds": attrList,
		"message": msg,
		"coupon": coupon,
		"shippingId": addsend,
		"exchange_type": payfo,
		"token": toke
	};

	if(addressId == "" || addressId == undefined) {
		$.toast('请选择收货地址！');
		return false;

	} else {
		//提交订单处理
		$.ajax({
			type: "post",
			url: subOrder[conf],
			async: true,
			data: pram,
			success: function(data) {
				var datas = JSON.parse(data)
				//				console.log(datas.res);
				var orderId = datas.data.orderIds; //订单ID
				var trade = datas.data.trade_sn; //流水号
				var payMoney = datas.data.pay_money; //支付金额
				var spfree = datas.data.shipping_fee; //运费
				//type = 1 七彩币   type = 0 人民币
				//				return false;

				var parms = {
					orderIds: orderId,
					trade_sn: trade,
					pay_money: payMoney,
					shipping_fee: spfree,
					token: toke
				};

				if(datas.res == 1) {
					//七彩币支付跳转
					if(datas.data.trade_type == 1) {
						$.ajax({
							type: "post",
							url: qcPay,
							async: true,
							timeout: 1500,
							data: parms,
							success: function(datas) {
								if(datas.res == '1') {
									$.toast(datas.msg);
									setTimeout(function(){
										window.location.href = 'myOrder-table.html';
									},1000);

								} else {
									$.toast(datas.msg);
								}
								
							}
						});

					} else if(datas.data.trade_type == 0) {
						//人民币支付
						$.ajax({
							type: "post",
							url: cnyPay,
							timeout: 1500,
							data: parms,
							success: function(res) {
								var orderId = res.data.orderId;
								var subject = res.data.subject;
								var amount = res.data.amount;
								if(res.res == 1) {
									var payParam = {
										partner: "m1610030006",
										subject: subject,
										amount: 0.01,//amount,
										orderID: orderId,
										notifyUrl: "http://my.shop.7cai.tv/pay.php",
										alipay: true,
										wxpay: false,
										baidupay: false,
										unionpay: false,
										jdpay: false,
									}

									fuqianla.fuqianlaPay(payParam, function(ret, err) {
										//alert(JSON.stringify(ret) + JSON.stringify(err));
												if(ret.payCode == 9000) {
													$.toast("订单支付成功");
													
												} else if(ret.payCode == 6001) {
													$.toast("订单已取消");
												} else {
													$.toast("订单支付失败");
												}

									});
								} else {
									alert("支付失败");
								}
							}
						});

					} else {
						$.toast('提交订单失败！');
						return false;
					}

				} else {
					$.toast(datas.msg);
					return false;
				}

			},
			error: function() {
				$.toast('请求超时');
				return false;
			}
		});

		/*--------------------------------*/

		//		$.post(subOrder[conf], pram, function(data, status) {
		//			var datas = JSON.parse(data)
		//			var orderId = datas.data.orderIds; //订单ID
		//			var trade = datas.data.trade_sn; //流水号
		//			var payMoney = datas.data.pay_money; //支付金额
		//			var spfree = datas.data.shipping_fee; //运费
		//			//type = 1 七彩币   type = 0 人民币
		//			var parms = {
		//				orderIds: orderId,
		//				trade_sn: trade,
		//				pay_money: payMoney,
		//				shipping_fee: spfree,
		//				token: toke
		//			};
		//
		//			if(datas.res == 0) {
		//				$.toast(datas.msg);
		//				return false;
		//			} else {
		//				vm.loadingFlag = false;
		//				if(datas.data.trade_type == 1) {
		//					//七彩币支付跳转
		//					$.post(qcPay, parms, function(datas, status) {
		//						if(datas.res == '1' && datas.data.amount == 0) {
		//							debugger;
		//							console.log(datas.data.orderIds);
		//							$.toast('提交成功，正在跳转。。。');
		//							FUQIANLA.init({
		//								'appId': 'VWT0GaNzbX3Dqesop5zrOg', //应用ID号  VWTOGaNzbX3Dqesop5zrOg
		//								'merchId': 'm1610030006', //商户号   m1610030006
		//								'orderId': datas.data.orderIds, //订单号，此处为模拟订单号。具体以接入为准
		//								'channel': 'wx_pay_pub', //开通的通道简称
		//								'amount': '0.01', //支付金额
		//								'subject': datas.data.subject, //商品标题
		//								'notifyUrl': 'http://my.shop.7cai.tv/pay.php', //异步支付结果通知地址 http://my.shop.7cai.tv/index.php?r=pay&m=tur
		//								'extra': {
		//									'openid': openid,
		//									'cb': function() {
		//
		//										window.location.href = "./myOrder-table.html";
		//									}
		//								}
		//							});
		//
		//						}
		//						//						else if(datas.res == '1' && datas.data.amount == 0) {
		//						//							debugger;
		//						//							window.location.href = "./myOrder-table.html";
		//						//						} 
		//						else {
		//							$.toast(datas.msg);
		//						}
		//						//						location.href = baseUrl() + 'index.php?r=pay&m=vxPay';
		//					});
		//				} else if(datas.data.trade_type == 0) {
		//					//人民币支付跳转
		//					$.post(cnyPay, parms, function(datas, status) {
		//						console.log(datas);
		//						if(datas.res == '1') {
		//
		//							debugger;
		//							$.toast('提交成功，正在跳转。。。');
		//							FUQIANLA.init({
		//								'appId': 'VWT0GaNzbX3Dqesop5zrOg', //应用ID号  VWTOGaNzbX3Dqesop5zrOg
		//								'merchId': 'm1610030006', //商户号   m1610030006
		//								'orderId': datas.data.orderId, //订单号，此处为模拟订单号。具体以接入为准
		//								'channel': 'wx_pay_pub', //开通的通道简称
		//								'amount': '0.01', //支付金额
		//								'subject': datas.data.subject, //商品标题
		//								'notifyUrl': 'http://my.shop.7cai.tv/pay.php', //异步支付结果通知地址 http://my.shop.7cai.tv/index.php?r=pay&m=tur
		//
		//								'extra': {
		//									'openid': openid,
		//									'cb': function() {
		//
		//										window.location.href = "./myOrder-table.html";
		//									}
		//								}
		//							});
		//
		//						} else {
		//							$.toast(datas.msg);
		//						}
		//					});
		//				} else {
		//					$.toast('提交订单失败！');
		//					return false;
		//				}
		//				//				window.location.href = "myOrder-table.html";
		//			}
		//
		//		});
	}

});

function getaddress_info(event) {
	$.ajax({       
		type: "GET",
		       async: false,
		       url: address_info[conf], //实际上访问时产生的地址为: http://www.my.com/index.php?r=lunbo
		       cache: false, //默认值true
		       dataType : 'json',
		       success: function(json) {     
			var dataList = json;
			var app = new Vue({
				el: '#address',
				data: dataList,
			});   
		} 
	});
}

function getorder_info() {
	$.ajax({
		type: "get",
		async: false,
		url: order_info[0], //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
		cache: false, //默认值true
		// dataType :'jsonp',
		data: {
			userId: '1'
		},
		// jsonp: "jsoncallback",
		success: function(json) {
			var dataList = json;
			var app = new Vue({
				el: '#getOrder',
				data: dataList,
			});

		},
		error: function(data) {

		}
	})
}

//计算商品价格
function checkedGoods() {
	var qcbcount = 0; //七彩币
	var rmbPrice = 0; //人民币
	var allGdoos = 0; //所有商品数量
	$('.item-inner .ccart-price').each(function(index, event) {
		allGdoos++;
		var inputNum = parseInt($(this).data("nums"));
		qcbcount += parseInt($(this).data('qcb')) * inputNum;
		rmbPrice += parseFloat($(this).data('price')) * inputNum;
	});
	$("#count_qcb").text(qcbcount); //七彩币总价
	$("#count_price").text(rmbPrice.toFixed(2)); //人民币总价
}
$(function() {
	//getaddress_info();
	//getorder_info();
});

$.init();