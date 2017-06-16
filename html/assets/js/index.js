
var conf = 1;
var bann = ['../assets/data/index.json', 'http://v.zy7c.com/index.php?r=lunbo']; //banner
var goodsdata = ['../assets/data/goods.json', baseUrl()]; //商品列表

// banner图
$.ajax({       
	type: "GET",
	       async: false,
	       url: baseUrl() + 'index.php?r=lunbo', //实际上访问时产生的地址为: http://www.my.com/index.php?r=lunbo
	       cache: false, //默认值true
	       dataType : 'json',

	       success: function(json) {  
		var dataList = json;
		var app = new Vue({
			el: '#banner',
			data: dataList,
		});

		var mySwiper = new Swiper('.swiper-container', {
			autoplay: 1000, //可选选项，自动滑动
			pagination: '.swiper-pagination',
			loop: true,
			autoplayDisableOnInteraction: false
		});     
	} 
});

//商品列表渲染
var goods = new Vue({
	el: "#goods-list",
	data: {
		goodslist: [],
		loadingFlag:true,
	},
	mounted: function() {
		//初始化加载数据
		var _this = this;
		_this.showGoods();
	},
	methods: {
		showGoods: function() {
			var _this = this;
			axios.get(goodsdata[conf]).then(function(ress) {
				var data = ress.data;
				if(data.res == 1) {
					_this.goodslist = data;
					_this.loadingFlag = false;
				} else {
					$.toast("商品数据错误");
				}
			});
		},
		getTitleHref: function(val) {
			return 'goods-detail.html?id=' + val
		},

	}
});
