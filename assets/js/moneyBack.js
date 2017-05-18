//虚拟键盘遮挡底部按钮
var oHeight = $(document).height(); //浏览器当前的高度
$(window).resize(function() {
	if($(document).height() < oHeight) {
		$("#backMoney-btn").css("position", "static");
	} else {
		$("#backMoney-btn").css("position", "fixed");
	}
});

//截取字符串
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
var orderId = getQueryString('order_id'); //订单中要退款订单ID
var order_gods = getQueryString('order_goods')//获取订单中退款商品的id
var status = getQueryString('status'); //订单状态
var url = location.search; //获取url中"?"符后的字串
//订单列表url
var urls = '';
function order_urls(){
	if (url.indexOf("?") != -1) {   
		var str = url.substr(1); 
		var theRequest = new Object();   
		strs = str.split("=");
		urls = strs[0];
	}
	if(urls == 'order_goods'){
		return '&order_goods_id='+order_gods;
	}else if(urls == 'order_id'){
		return '&order_id='+orderId;
	}
}

//退款
new Vue({
	el: '#moneyBack',
	data: {
		imgSrc: [],
		status: status,
		imgNum: '最多三张'
	},
	methods: {
		changeImg: function(e) { //获取上传img路径
			var files = e.target.files || e.dataTransfer.files;
			if(!files.length)
				return;
			this.createImage(files[0]);
		},
		createImage: function(file) { //创建新的img路径保存在数组里
			var reader = new FileReader();
			var $t = this;

			reader.onload = function(e) {
				$t.imgSrc.push(e.target.result);
			};
			reader.readAsDataURL(file);
			this.imgNum = (this.imgSrc.length + 1) + '/3'
		},
		remove: function(index) { //删除图片
			this.imgSrc.splice(index, 1);
			$('#upload').val('');
			if(this.imgSrc.length == 0) {
				this.imgNum = '最多三张'
			} else {
				this.imgNum = (this.imgSrc.length) + '/3'
			}
		},
		sub: function() { //提交申请退款表单
			var $t = this;
			var myReason = $('input:radio[name="refund_reason"]:checked').val(); //退款原因
			var myType = $('input:radio[name="refund_type"]:checked').val(); //退款类型
			var bMoney = $('input[name="refund_amount"]').val(); //退款金额
			if(myReason == undefined) {
				layer.open({
					content: '请选择退款原因',
					skin: 'msg',
					time: 2, //2秒后自动关闭
				});
			} else if(myType == undefined && $t.status == 30) {
				layer.open({
					content: '请选择退款类型',
					skin: 'msg',
					time: 2, //2秒后自动关闭
				});
			} else if(bMoney == '') {
				layer.open({
					content: '请填写退款金额',
					skin: 'msg',
					time: 2, //2秒后自动关闭
				});
			} else {
				layer.open({
					content: '确认退款将不会返还您已消费的七彩币，您是否继续退款？',
					btn: ['确定', '取消'],
					yes: function(index) {
						layer.close(index);
						var form = $("form[name=fileForm]");
						var options = {
							url: baseUrl()+'member.php?r=order&m=refund&token='+token() + order_urls(),
							type: 'post',
							success: function(data) {
								var resfs = JSON.parse(data); //json字符串转换成json数据 不然点不出来
								if(resfs.res == 1) {
									layer.open({
										content: '提交申请成功',
										skin: 'msg',
										time: 2 //2秒后自动关闭
									});
									window.location.href = "./myOrder-table.html";
								}else{
									layer.open({
										content: '网络错误，请重试',
										skin: 'msg',
										time: 2 //2秒后自动关闭
									});
								}
							}
						};
						form.ajaxSubmit(options);
					}
				});
				//动态加载弹框样式
				$('.layui-m-anim-scale').addClass("popupTitleBox");
				$('.layui-m-layerbtn').addClass("popupBottom");
				$('.layui-m-layercont').addClass("popupTitle");
				$('.layui-m-layerbtn span[no]').addClass("cancel");
				$('.layui-m-layerbtn span[yes]').addClass("sure");

			}
		}
	}
})