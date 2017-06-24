var conf = 1;
var banner = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Carousel/index']; //banner
var hotdata = ['./assets/data/list.json', baseUrl() + 'tv/?s=/Api/movie/lists/type/1']; //热映大片
var yuxian_ry = ['./assets/data/list.json', baseUrl() + 'tv/?s=/Api/movie/lists/type/2']; //院线热映
var wl_movie = ['./assets/data/list.json', baseUrl() + 'tv/?s=/Api/movie/lists/type/3']; //网络电影
var jd_movie = ['./assets/data/list.json', baseUrl() + 'tv/?s=/Api/movie/lists/type/4']; //经典影院
var zzdx_movie = ['./assets/data/zzdx.json', baseUrl() + 'tv/index.php?s=/Api/zhizun/get_one']; //至尊独享
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



var movieDatail = new Vue({
	el: "#sy-movie-list",
    data: {
        hotList: [],
        yxList:[],
        wlList:[],
        jdList:[],
        loadingFlag: true,
    },
    mounted: function() {
    	 this.showList();
     },
    methods: {
         showList:function(){
         	/*热映大片*/
         	var _this = this;
			axios.get(hotdata[conf]).then(function(res) {
				var data = res.data;
				if(data.res == 1) {
					_this.hotList = data.data;
					_this.loadingFlag = false;
				} else {
					$.toast("电影数据错误");
					
				}
			});
			/*院线热映*/
			axios.get(yuxian_ry[conf]).then(function(res) {
				var data = res.data;
				if(data.res == 1) {
					_this.yxList = data.data;
					_this.loadingFlag = false;
				} else {
					$.toast("电影数据错误");
				}
			});
           /*网络电影*/
           axios.get(wl_movie[conf]).then(function(res) {
				var data = res.data;
				if(data.res == 1) {
					_this.wlList = data.data;
					_this.loadingFlag = false;
				} else {
					$.toast("电影数据错误");
				}
			});
           /*经典影院*/
           axios.get(jd_movie[conf]).then(function(res) {
				var data = res.data;
				if(data.res == 1) {
					_this.jdList = data.data;
					_this.loadingFlag = false;
				} else {
					$.toast("电影数据错误");
				}
			});
         },
         getTitleHref:function(val){
         	return 'movie-content.html?id=' + val
         }
     },
})


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
/*至尊独享*/
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