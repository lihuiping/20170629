var conf = 1;
var orderDetailsList = ['../assets/data/order-details.json', baseUrl() + 'member.php?r=order&m=orderDetails']; //订单详情接口
var delOrderDetail = ['../assets/data/delOrder.json', baseUrl() + 'member.php?r=order&m=cancel']; //取消订单接口
var orderPay = ['', baseUrl() + 'index.php?r=pay&m=orderPay']; //立即支付接口

//function token(){
//	return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiMTI5OCIsInYiOjEsImlhdCI6MTQ5MzAxNjU1MH0.f22i4KyzNwJxHFk_PhHq4YkbJTuV0iC1HQgm_HUW7qo';
//}

//获取地址参数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

var orderID = GetQueryString('id');

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

//获取订单详情页面数据
//openid
var openid = Cache.get('openid');
var orderDetails = new Vue({
	el: "#order-details",
	data: {
		orderDetailsList: [],
		orderDetailsAddr: [],
		orderDetailsStaA: [],
		flag: true,
		loadingFlag: true
	},
	filters: {
		//人民币字体和七彩币字体切换
		odMoneyTit: function(sta) {
			if(sta == 0) {
				return "消费￥"
			} else if(sta == 1) {
				return "消费七彩币"
			}
		},
		//人民币字体和七彩币字体切换
		odMoneyTit1: function(sta) {
			if(sta == 0) {
				return "花费￥"
			} else if(sta == 1) {
				return "花费七彩币"
			}
		}
	},
	mounted: function() {
		var _this = this;
		//初始化加载数据
		this.showOrderDetails();
		setTimeout(function() {
			_this.showBdBtm();
		}, 100);

	},
	methods: {
		showOrderDetails: function(event) {
			var _this = this;
			//获取订单详情信息
			axios.get(orderDetailsList[conf], {
				params: {
					token: token(),
					id: orderID
				}
			}).then(function(response) {
				var res = response.data.res;
				var dataOrder = response.data.data;
				var dataAddress = response.data.data.address;
				var dataOrderStatusAction = response.data.data.statusAction;
				if(res == 1) {
					//订单的总数据
					orderDetails.orderDetailsList = dataOrder;
					//订单中地址的数据
					orderDetails.orderDetailsAddr = dataAddress;
					//订单中ban图片上显示名字的数据
					orderDetails.orderDetailsStaA = dataOrderStatusAction;

					_this.loadingFlag = false;
				} else {
					$.toast('操作失败');
				}
			});
		},
		//显示border-bottom边框
		showBdBtm: function() {
			var odSta = $(".od-content").attr("data_status");
			if(odSta == "10") {
				$(".od-content").css("border-bottom", "none");
				$(".od-status").addClass("od-addSty");
				$(".od-status").css("height", "2.5rem");
			}
		},
		//取消订单
		delOrder: function() {
			var orderId = $(".od-ban").attr("odOId");
			if(orderDetails.flag) {
				layer.open({
					content: '确定取消订单吗？',
					btn: ['确定', '取消'],
					yes: function(index) {
						axios.get(delOrderDetail[conf], {
							params: {
								token: token(),
								id: orderId
							}
						}).then(function(response) {
							var msg = response.data.msg;
							var res = response.data.res;
							if(res == 1) {
								$(".btn-cancelOrder").eq(0).addClass("btn-cancelhui");
								$.toast('订单取消成功');
								$(".od-box").remove();
							} else {
								$.toast('订单取消失败');
							}
						});
						layer.close(index);
						orderDetails.flag = false;
					},
					no: function() {
						orderDetails.flag = true;
					}
				});
			}
			//动态加载弹框样式
			$('.layui-m-anim-scale').addClass("searchAera");
			$('.layui-m-layerbtn').addClass("searchTop");
			$('.layui-m-layercont').addClass("searchConfirm");
			$('.layui-m-layerbtn span[no]').addClass("searchCancel");
			$('.layui-m-layerbtn span[yes]').addClass("ok");
		},
		//退款
		refundOder: function() {
			/*var godId = "";
			var goodId = [];
			$(".od-cont li").each(function(i,v){
				godId = $(v).attr("godId");
				goodId.push(godId);
				
			});
			//获取商品ID
			var odGodId = goodId.join(',');*/
			//获取商品单个ID
			var odGodId = $(".od-right a:active").parents("li").attr("godid");
			//获取订单状态
			var odSta = $(".od-ban").attr("odStatus");
			window.location.href = 'moneyBack.html?order_goods=' + odGodId + '&status=' + odSta;
		},
		//评价
		appraiseOrder: function() {
			//获取商品单个ID
			var odGodId = $(".od-right a:active").parents("li").attr("godid");
			window.location.href = 'addComment.html?order_goods=' + odGodId;
		},
		//立即兑换
		coventOrder: function() {
			var odid = [];
			$(".od-ban").each(function(i, v) {
				var odId = $(v).attr("odOId");
				odid.push(odId);
			});
			var order_id = odid.join(",");
			if(openid && isWenxin) {
				axios.post(orderPay[conf], transformRequest({
					token: token(),
					orderIds: order_id
				}), {
					headers: header
				}).then(function(response) {
					var res = response.data.res;
					var orderId = response.data.data.orderId; //获取订单号
					var amount = response.data.data.amount; //获取的总价钱
					var sub_ject = response.data.data.subject; //获取商品标题
					var msg = response.data.msg;
					if(res == 1) {
						//微信
						FUQIANLA.init({
							'appId': 'VWT0GaNzbX3Dqesop5zrOg', //应用ID号
							'merchId': 'm1610030006', //商户号
							'orderId': orderId, //订单号，此处为模拟订单号。具体以接入为准
							'channel': 'wx_pay_pub', //开通的通道简称
							'amount': '0.01', //支付金额
							'subject': sub_ject, //商品标题
							'notifyUrl': 'http://my.shop.7cai.tv/pay.php', //异步支付结果通知地址
							'extra': {
								'openid': openid,
								'cb': function() {
									window.location.href = "./myOrder-table.html"
								}
							}
						});
						
					} else {
						layer.open({
							content: msg,
							skin: 'msg',
							time: 2, //2秒后自动关闭
						});
					}
				});
			} else if(isWenxin && !openid) {
				$.toast('没有获取到用户ID!');

			} else {
				$.toast('请在微信中支付！');
			}

		}
	}
});

$.init();