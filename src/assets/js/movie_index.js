var conf = 0;
var banner = ['./assets/data/banner.json', baseUrl() + 'index.php/Api/Carousel/index']; //banner
var hotdata = ['./assets/data/list.json', baseUrl() + 'index.php/Api/Movie/lists?type=1']; //热映大片
var yuxian_ry = ['./assets/data/list.json', baseUrl() + 'index.php/Api/Movie/lists?type=2']; //院线热映
var wl_movie = ['./assets/data/list.json', baseUrl() + 'index.php/Api/Movie/lists?type=3']; //网络电影
var jd_movie = ['./assets/data/list.json', baseUrl() + 'index.php/Api/Movie/lists?type=4']; //经典影院
var zzdx_movie = ['./assets/data/zzdx.json', baseUrl() + 'index.php/Api/Zhizun/get_one']; //至尊独享
/*懒加载*/
function imgload() {
	$("img.lazy").scrollLoading({
		attr: "data-src",
		callback: function() {
			var $this = $(this);
			$this.removeClass("lazy").removeAttr("data-src");
			var src = $this.attr("src");
			if(src.toLowerCase().indexOf("uploadfile") >= 0 || src.toLowerCase().indexOf("myupload") >= 0 || src.toLowerCase().indexOf("http") == -1) {}
		}
	});
}
window.setTimeout(function() { imgload(); }, 0);
var timer = null;
$(".content").on("scroll", function() {
	if(timer) { clearTimeout(timer); }
	timer = setTimeout(function() { imgload(); }, 0);
});
$(".content").trigger("scroll");

// banner图
$.ajax({       
	type: "GET",
	       async: false,
	       url: banner[conf], //实际上访问时产生的地址为: http://www.my.com/index.php?r=lunbo
	       //cache: false, //默认值true
	       dataType : 'json',
	       success: function(json) {  
		var dataList = json;
		var app = new Vue({
			el: '#index-banner',
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
/*热线大片*/
var goods = new Vue({
	el: "#hot-list",
	data: {
		goodslist: [],
		loadingFlag: true,
	},
	mounted: function() {
		//初始化加载数据
		var _this = this;
		_this.showGoods();
	},
	methods: {
		showGoods: function() {
			var _this = this;
			axios.get(hotdata[conf]).then(function(res) {
				var data = res.data;
				if(data.res == 1) {
					_this.goodslist = data.data;
					_this.loadingFlag = false;
				} else {
					$.toast("商品数据错误");
				}
			});
		},
		getTitleHref: function(val) {
//  		return 'goods-detail.html?id=' + val
			return 'movie-content.html'
		},
	}
});
/*院线热映*/
var yx_ry = new Vue({
	el: "#yx-list",
	data: {
		goodslist: [],
		loadingFlag: true,
	},
	mounted: function() {
		//初始化加载数据
		var _this = this;
		_this.showGoods();
	},
	methods: {
		showGoods: function() {
			var _this = this;
			axios.get(yuxian_ry[conf]).then(function(res) {
				var data = res.data;
				if(data.res == 1) {
					_this.goodslist = data.data;
					_this.loadingFlag = false;
				} else {
					$.toast("商品数据错误");
				}
			});
		},
		getTitleHref: function(val) {
			//return 'goods-detail.html?id=' + val
			return 'movie-content.html'
		},
	}
});
/*网络电影*/
var wl_movie = new Vue({
	el: "#wl_movie",
	data: {
		goodslist: [],
		loadingFlag: true,
	},
	mounted: function() {
		//初始化加载数据
		var _this = this;
		_this.showGoods();
	},
	methods: {
		showGoods: function() {
			var _this = this;
			axios.get(yuxian_ry[conf]).then(function(res) {
				var data = res.data;
				if(data.res == 1) {
					_this.goodslist = data.data;
					_this.loadingFlag = false;
				} else {
					$.toast("商品数据错误");
				}
			});
		},
		getTitleHref: function(val) {
			//return 'goods-detail.html?id=' + val
			return 'movie-content.html'
		},
	}
});
/*经典影院*/
var jd_movie = new Vue({
	el: "#jd_movie",
	data: {
		goodslist: [],
		loadingFlag: true,
	},
	mounted: function() {
		//初始化加载数据
		var _this = this;
		_this.showGoods();
	},
	methods: {
		showGoods: function() {
			var _this = this;
			axios.get(jd_movie[conf]).then(function(res) {
				var data = res.data;
				if(data.res == 1) {
					_this.goodslist = data.data;
					_this.loadingFlag = false;
				} else {
					$.toast("商品数据错误");
				}
			});
		},
		getTitleHref: function(val) {
		//	return 'goods-detail.html?id=' + val
		return 'movie-content.html'
		},
	}
}); /*至尊独享*/
/*首页至尊独享*/
var zzdx_movie = new Vue({
	el: "#zzdx_movie",
	data: {
		goodslist: [],
		loadingFlag: true,
	},
	mounted: function() {
		//初始化加载数据
		var _this = this;
		_this.showGoods();
	},
	methods: {
		showGoods: function() {
			var _this = this;
			axios.get(zzdx_movie[conf]).then(function(res) {
				var data = res.data;
				if(data.res == 1) {
					_this.goodslist = data.data;
					_this.loadingFlag = false;
				} else {
					$.toast("商品数据错误");
				}
			});
		}
	}
});