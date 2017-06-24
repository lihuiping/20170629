var conf = 1;
var tokens = token();
//var url = "http://v.zy7c.com/";
var orderList_url = ['../assets/data/orderList.json', baseUrl() + 'member.php?r=order&m=index&token=' + token()];
var deleteOrder = ['../assets/data/orderList.json', baseUrl() + 'member.php?r=order&m=deleteOrder'] //订单删除接口
var cancelOrder = ['../assets/data/orderList.json', baseUrl() + 'member.php?r=order&m=cancel'] //订单取消接口
var cuidanOrder = ['../assets/data/orderList.json', baseUrl() + 'member.php?r=order&m=reminder']
var shOrder = ['../assets/data/orderList.json', baseUrl() + 'member.php?r=order&m=confirmReceipt']
var tuikuan = ['../assets/data/orderList.json', baseUrl() + 'member.php?r=order&m=refund']
var orderpay = ['../assets/data/orderList.json', baseUrl() + 'index.php?r=pay&m=orderPay']
var cnyPay = baseUrl() + 'index.php?r=pay&m=orderPay'; //人民币支付
var openid = Cache.get('openid');
var mm = "";
var isFrist = false;
window.onload = function() {
	var mySwiper = new Swiper('#orderTable', {
		speed: 10 ,
		onSlideChangeStart: function(swiper) {
			$(".myOrder-tab .active").removeClass('active');
			$(".myOrder-tab a").eq(swiper.activeIndex).addClass('active');
			var order_status = swiper.activeIndex;
			switch(order_status) {
				case 0:
					mm = "";
					break;
				case 1:
					mm = "&state=10";
					break;
				case 2:
					mm = "&state=20";
					break;
				case 3:
					mm = "&state=30";
					break;
				case 4:
					mm = "&state=40";
					break;
			}
			orderList.showView();
		}
	});
	$(".myOrder-tab a").on('touchstart mousedown', function(e) {
		e.preventDefault()
		$(".myOrder-tab .active").removeClass('active')
		$(this).addClass('active')
		mySwiper.slideTo($(this).index());

	});
	$(".myOrder-tab a").click(function(e) {
		e.preventDefault()
	})
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

var fuqianla;
//加载付钱拉组件
apiready = function() {
	fuqianla = api.require('moduleFuQianLa');
};

var orderList = new Vue({
	el: "#orderTable",
	data: {
		orderList: [],
		orderId: "",
		flag: true,
		loadingFlag: true
	},
	mounted: function() {
		//初始化加载数据
		this.showView();
	},
	methods: {
		showView: function(event) {
			//渲染订单商品视图
			var _this = this;
			axios.get(orderList_url[conf] + mm).then(function(response) {
				var datas = response.data;
				orderList.orderList = datas;
				if(datas.res == '1') {
					_this.loadingFlag = false;
				}else{
					_this.loadingFlag = false;
				}

			});
		},

		cancelOrder: function(orderId, obj) {
			axios.get(cancelOrder[conf], {
				params: {
					token: tokens,
					id: orderId
				}
			}).then(function(response) {
				var datas = response.data;
				if(datas.res == 1) {
					$.toast("取消订单成功");
					$(obj).addClass("btn-cancelhui");
					$(obj).closest('.ccart-list').remove();
				} else {
					$.toast("取消订单失败");
				}
			});
		},
		tuikuanOrder: function(orderId, obj) {
			//评价商品
			axios.get(tuikuan[conf], {
				params: {
					token: tokens,
					id: orderId
				}
			}).then(function(response) {
				var datas = response.data;
				if(datas.res == 1) {
					setTimeout(function() {
						window.location.href = './moneyBack.html?order_goods=' + orderId;
					}, 1000);
				} else {
					$.toast(msg);
				}
			});
		},
		deleteOrder: function(orderId, obj) {
			axios.get(deleteOrder[conf], {
				params: {
					token: tokens,
					id: orderId
				}
			}).then(function(response) {
				var datas = response.data;
				if(datas.res == 1) {
					$.toast("删除订单成功");
					$(obj).closest('.ccart-list').remove();

				} else {
					$.toast("删除订单失败");
				}
			});
		},
		shOrder: function(orderId) {
			axios.get(shOrder[conf], {
				params: {
					token: tokens,
					id: orderId
				}
			}).then(function(response) {
				var datas = response.data;
				$.toast(datas.msg);
				if(datas.res == 1) {
					setTimeout(function() {
						window.location.href = './addComment.html?order_id=' + orderId;
					}, 1000);
				}
			});

		},
		cuidanOrder: function(orderId) {
			axios.get(cuidanOrder[conf], {
				params: {
					token: tokens,
					id: orderId
				}
			}).then(function(response) {
				var datas = response.data;
				$.toast(datas.msg);
				// if (datas.res == 1) {
				//     $.toast("已提醒商家发货");
				// } else {
				//      $.toast("确认收货失败");
				// }
			});
		},
		coventOrder: function(orderId) {
			//人民币支付
						$.ajax({
							type: "post",
							url: cnyPay,
							timeout: 1500,
							data: {
								token: token(),
								orderIds: orderId
							},
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
			//var totalPrice = $(".od-totalPrice").text();//获取的总价钱
			//          var orderTitle = $(".od-payTit").text();
			//          var order_id = $(".od-ban").attr("odOId");
//			if(openid && isWenxin) {
//				axios.post(cnyPay, transformRequest({
//					token: token(),
//					orderIds: orderId
//				}), {
//					headers: header
//				}).then(function(response) {
//					var res = response.data.res;
//					var orderId = response.data.data.orderId; //获取订单号
//					var amount = response.data.data.amount; //获取的总价钱
//					var sub_ject = response.data.data.subject; //获取商品标题
//
//					if(res == 1) {
//						//支付宝
//						FUQIANLA.init({
//							'appId': 'VWT0GaNzbX3Dqesop5zrOg', //应用ID号  VWTOGaNzbX3Dqesop5zrOg
//							'merchId': 'm1610030006', //商户号   m1610030006
//							'orderId': orderId, //订单号，此处为模拟订单号。具体以接入为准
//							'channel': 'wx_pay_pub', //开通的通道简称
//							'amount': '0.01', //支付金额
//							'subject': sub_ject, //商品标题
//							'notifyUrl': 'http://my.shop.7cai.tv/pay.php', //异步支付结果通知地址 http://my.shop.7cai.tv/index.php?r=pay&m=tur
//							'extra': {
//								'openid': openid,
//								'cb': function() {
//									window.location.href = "./myOrder-table.html";
//								}
//							}
//						});
//					} else {
//						$.toast("暂无法支付!");
//					}
//				});
//			} else if(isWenxin && !openid) {
//				$.toast('没有获取到用户ID!');
//
//			} else {
//				$.toast('请在微信中支付！');
//			}

		}
	}
})
//点击取消订单
$(".order-sub-box").on('click', ".btn-cancelOrder", function() {
	var _this = this;
	layer.open({
		content: '确定取消订单吗？',
		btn: ['确定', '取消'],
		yes: function(index) {
			var orderId = $(_this).parent().attr('id');
			orderList.cancelOrder(orderId, _this);
			layer.close(index);
		}
	});
	//动态加载弹框样式
	$('.layui-m-anim-scale').addClass("searchAera");
	$('.layui-m-layerbtn').addClass("searchTop");
	$('.layui-m-layercont').addClass("searchConfirm");
	$('.layui-m-layerbtn span[no]').addClass("searchCancel");
	$('.layui-m-layerbtn span[yes]').addClass("ok");
});
//催单
$(".order-sub-box").on('click', ".btn-cuiOrder", function() {
	var _this = this;
	var orderId = $(_this).parent().attr('id');
	orderList.cuidanOrder(orderId, _this);
	// if(isFrist){
	//    $.toast("您已提醒过商家啦")
	// }else{
	//   $.toast("已提醒商家发货")
	//   isFrist=true;
	// }
});
//点击删除订单
$(".order-sub-box").on('click', ".btn-delOrder", function(e) {
	var _this = this;
	layer.open({
		content: '确定删除订单吗？',
		btn: ['确定', '取消'],
		yes: function(index) {
			var orderId = $(_this).parent().attr('id');
			orderList.deleteOrder(orderId, _this);
			layer.close(index);
		}
	});
	//动态加载弹框样式
	$('.layui-m-anim-scale').addClass("searchAera");
	$('.layui-m-layerbtn').addClass("searchTop");
	$('.layui-m-layercont').addClass("searchConfirm");
	$('.layui-m-layerbtn span[no]').addClass("searchCancel");
	$('.layui-m-layerbtn span[yes]').addClass("ok");
});
/*确认收货*/
$(".order-sub-box").on('click', ".btn-shouhuo", function() {
	var orderId = $(this).parent().attr('id');
	// orderList.shOrder(orderId);
	var sh_status = $(this).parent().parent().find(".tuikaun").text().trim().indexOf("退款中");
	if(sh_status == -1) {
		$.toast("确认收货成功");
		orderList.shOrder(orderId);
	} else {
		layer.open({
			content: '该订单正在申请退款中，确认收货将关闭退款。',
			btn: ['确定', '取消'],
			yes: function(index) {
				orderList.shOrder(orderId);
				layer.close(index);
			}
		});
		//动态加载弹框样式
		$('.layui-m-anim-scale').addClass("popupTitleBox");
		$('.layui-m-layerbtn').addClass("popupBottom");
		$('.layui-m-layercont').addClass("popupTitle");
		$('.layui-m-layerbtn span[no]').addClass("cancel");
		$('.layui-m-layerbtn span[yes]').addClass("sure");
	}
});
//else if(mtrefund1 == 1 && mtrefund2 == 1){
//	godId = $(commentOrder).attr("ordergod");
//	goodId.push(godId);
//}else if(mtrefund1 == 1 && mtrefund2 == 2){
//	godId = $(commentOrder).attr("ordergod");
//	goodId.push(godId);
//}
/*申请退款*/
$(".order-sub-box").on('click', ".btn-tuikuan", function() {
	var commentOrder = $(this).parents(".ccart-status").siblings('.item-content').find(".item-inner");
	var orderId = "";
	var goodId = [];
	$(commentOrder).each(function(i,v){
		if($(v).attr("mtRefund") == 0){
			godId = $(v).attr("ordergod");
			goodId.push(godId);
		}
	});
	//获取商品ID
	orderId = goodId.join(',');
	console.log(orderId);
	var _this = this;
//	orderList.tuikuanOrder(orderId, _this);
});
/*评价*/
$(".order-sub-box").on('click', ".btn-commentOrder", function() {
	// var commentOrder = $(this).parents(".ccart-status").siblings('.item-content').find(".item-inner");
	// var godId = "";
	// var ordergoodId = "";
	// var goodId = [];
	// var ordergoodId = [];
	// $(commentOrder).each(function(i, v) {
	//     godId = $(v).attr("godId");
	//     ordergodId = $(v).attr("ordergod");
	//     goodId.push(godId);
	//     ordergoodId.push(ordergodId);
	// });
	// var goId = goodId.join(',');
	// var ordergoodId = ordergoodId.join(',');
	//var orderId = $(this).parent().parent().attr('id');
	// setTimeout(function() {
	//     // window.location.href = './addComment.html?goods_id=' + goId + '&order_goods=' + ordergoodId + '&token=' + tokens;
	//     window.location.href = './order-details.html?id=' + orderId + '&token=' + tokens;
	// }, 500);

});
/*立即支付*/
$(".order-sub-box").on('click', ".btn-duihuan", function() {
	var orderId = $(this).parent().attr("id");
	orderList.coventOrder(orderId);
})