var conf = 1;
var orderDetailsList = ['../assets/data/order-details.json', baseUrl() + 'member.php?r=order&m=orderDetails']; //订单详情接口
var delOrderDetail = ['../assets/data/delOrder.json', baseUrl() + 'member.php?r=order&m=cancel']; //取消订单接口
//获取地址参数
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
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
var orderDetails = new Vue({
	el: "#deliverDetail",
	data: {
		orderDetailsList: [],
		orderDetailsAddr: [],
		orderDetailsStaA: [],
		flag: true
	},
	filters: {
		//人民币和七彩币切换
		orderDetailMoney: function(value, sta) {
			if(sta == 0) {
				return value;
			} else if(sta == 1) {
				return value;
			}
		},
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
		//初始化加载数据
		this.showOrderDetails();
	},
	methods: {
		showOrderDetails: function() {
			//获取订单详情信息
			axios.get(orderDetailsList[conf], { params: { token: token(),id:orderID}}).then(function(response) {
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
				} else {
					$.toast('操作失败');
				}
			});
		}
	}
});

$.init();