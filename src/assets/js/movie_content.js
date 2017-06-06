var conf = 1;
var toke = token(); //获取token
var tuijian_list = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Recommend/index&token='+toke]; //banner
var content_movie = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/videoInfo/index&token='+toke];
//获取地址参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var movieID = GetQueryString('id');

//axios请求跨域  公用
var header = {
    'content-type': 'application/x-www-form-urlencoded'
};
//axios处理数据转换格式  公用
function transformRequest(data) {
    var ret = '';
    for (var it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    };
    return ret;
};

/*推荐视频列表*/
var tuijian_movie = new Vue({
    el: "#tuijian_movie",
    data: {
        movielist: [],
        loadingFlag: true,
    },
    mounted: function() {
        //初始化加载数据
        var _this = this;
        _this.showMovie();
    },
    methods: {
        showMovie: function() {
            var _this = this;
            axios.get(tuijian_list[conf], {
                params: {
                    id: movieID
                }
            }).then(function(res) {
                var data = res.data;
                if (data.res == 1) {
                    _this.movielist = data;
                    _this.loadingFlag = false;
                } else {
                    $.toast("商品数据错误");
                }
            });
        },
        getTitleHref: function(val) {
            //  		return 'goods-detail.html?id=' + val
            return 'movie-content.html?id=' + val
        },
    }
});
/*视频详情接口*/
var content_movie = new Vue({
    el: "#content_movie",
    data: {
        movieContent: [],
        loadingFlag: true,
    },
    mounted: function() {
        //初始化加载数据
        var _this = this;
        _this.showMovie();
    },
    methods: {
        showMovie: function() {
            var _this = this;
            axios.get(content_movie[conf], {
                params: {
                    id: movieID
                }
            }).then(function(res) {
                var data = res.data;
                if (data.res == 1) {
                    _this.movieContent = data.data;
                    _this.loadingFlag = false;
                    var movie = "http://1253822065.vod2.myqcloud.com/eb5d41c9vodtransgzp1253822065/827c290f9031868222960789073/f0.f20.mp4";
                    video(movie);
                } else {
                    $.toast("商品数据错误");
                }
            });
        },
        getTitleHref: function(val) {
            //  		return 'goods-detail.html?id=' + val
            return 'movie-content.html?id=' + val
        },
    }
});


function video(movie) {
    var player = cyberplayer("video").setup({
        width: '100%',
        height: "100%",
        backcolor: "#000",
        stretching: "uniform",
        file: movie,
        ak: "a6b710207cf845ffb40df4bc0544639f",
        autoStart: true,
        repeat: false,
        volume: 100,
        controls: "over",
    });
    player.onTime(function(event) {
    	console.log(event);
    	 $(".bg_video").hide();
        if (event.position > 10) {
           //  $(".bg_video").show();
            this.pause();
        }
    });
}

/*简介*/
$(".vpl_VideoDetail_des_title").on("click", '.vpl_introduction', function() {
    $(".vpl_VideoDetail_member").toggle();
    $(".vpl_introduction").toggleClass("icon-up");
});

/*收藏*/
$(".vpl_Collection").on("click", function() {
    if ($(this).attr("index") == 2) {
        client1.addCollect({ "videoid": videoid, "videoname": videoname, "videoimg": videoimg }, function(result) {
            var result = $.parseJSON(result);
            if (result.res == 1) { $.toast("收藏成功"); } else { $.toast(result.msg); }
        })
    } else {
        var delarr = [];
        delarr.push(videoid);
        console.log(delarr);
        client1.delCollect({ "id": delarr }, function(result) {
            var result = $.parseJSON(result);
            if (result.res == 1) { $.toast("取消收藏"); } else { $.toast(result.msg); }
        })
    }
})
