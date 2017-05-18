//虚拟键盘遮挡底部按钮
var tokens = token();
var oHeight = $(document).height(); //浏览器当前的高度
$(window).resize(function() {
	if($(document).height() < oHeight) {
		$("#commentBtn").css("position", "static");
	} else {
		$("#commentBtn").css("position", "fixed");
	}
});

//截取字符串
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

var orderGoods = getQueryString('order_goods'); //订单商品id
$('#token').val(token()); //token


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


//点击确定返回
$('.btn-cancelOrder').on('click', function() {
	layer.open({
		content: '确定取消发布评论吗？',
		btn: ['确定', '取消'],
		yes: function(index) {
			window.history.go(-1);
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
//发表评论
new Vue({
	el: '#comment',
	data: {
		imgSrc:[],
		imgNum: '最多三张',
		goods:[]
	},
	mounted: function() {
		//初始化加载数据
		this.showView();
	},
	methods: {
		showView:function(){
			var $t = this;
			axios.get( baseUrl() + 'member.php?r=order_goods&m=getOrderGoods&ids='+orderGoods+'&token='+token()).then(function(response) {
				var datas = response.data;
				$t.goods = datas.data
			});
		},
		changeImg: function(e) { //input上传图片获取路径
			//!goods.imgSrc&&(goods.imgSrc=[]);//就是goods里没有imgSrc属性时赋值
			var files = e.target.files || e.dataTransfer.files;
			if(!files.length)
				return;
			this.createImage(files[0]);
		},
		createImage: function(file) { //创建一个img路径添加到数组里面
			var $t = this;
			//if($t.arr.length >= 3){$t.arr=[];}
			//var imgs = {};
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				//imgs.imgurl = e.target.result;
				$t.imgSrc.push(e.target.result);
			}
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
		sub: function() {
			var commen = $(".comment").val();
			if(commen == '') {
				layer.open({
					content: '请填写商品评价',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			} else {
				var form = $("form[name=fileForm]");
				var options = {
					url: baseUrl() + 'index.php?r=comment&m=add&',
					type: 'post',
					success: function(data) {
						var resfs = data;
						//var resfs = JSON.parse(data); //json字符串转换成json数据 不然点不出来
						if(resfs.res == 1) {
							layer.open({
								content: '发表成功',
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
							window.history.go(-1);
						} else {
							layer.open({
								content: '发表失败',
								skin: 'msg',
								time: 2 //2秒后自动关闭
							});
						}
					}
				};
				form.ajaxSubmit(options);
			}
		}
	}
})