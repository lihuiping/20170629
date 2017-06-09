var conf = 1;
var toke = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiODM4IiwidiI6MSwiaWF0IjoxNDkzMDAzMjg3fQ.PpqXb_oSU8EJVLAlwdzUBXsI67a2qAp7h5VuGf5Ly68'; //获取token
var tuijian_list = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Recommend/index&token=' + toke]; //banner
var content_movie = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/videoInfo/index&token=' + toke];
var add_collection = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/change.html'];
var get_collection = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/check.html'];

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
/*获取电影详情页的数据*/
var movieDatail = new Vue({
    el: "#VideoPlay",
    data: {
        movieContent: [],
        movielist: [],
        shop: [],
        Comment: [],
        keep: "icon-weishoucang",
        keepId: ""
    },
    mounted: function() {
        //初始化加载数据
        this.showMovie();
    },
    methods: {
        showMovie: function() {
            //获取电影信息
            var _this = this;
            axios.get(content_movie[conf], {
                params: {
                    id: movieID
                }
            }).then(function(response) {
                var data = response.data.data;
                movieDatail.movieContent = data;
                var movie = "http://1253822065.vod2.myqcloud.com/eb5d41c9vodtransgzp1253822065/827c290f9031868222960789073/f0.f20.mp4";
                video(movie);
            });
            //获取评价
            // axios.get(evaluateList[conf] + orderID).then(function(response) {
            //     var data = response.data.data;
            //     if(response.data.res === 1) {
            //         movieDatail.Comment = data;
            //     }
            // });
            //获取收藏
            axios.get(get_collection[conf], {
                params: {
                    token: tokens,
                    mid: movieID
                }
            }).then(function(response) {
                var data = response.data;
                if (data.res == 1) {
                    $(".vpl_Collection").addClass("icon-yishoucang")
                    movieDatail.keepId = data.res;
                }
            });
            //获取推荐的列表
            axios.get(tuijian_list[conf], {
                params: {
                    id: movieID
                }
            }).then(function(res) {
                var data = res.data;
                if (data.res == 1) {
                    _this.movielist = data;
                    console.log(data);
                    _this.loadingFlag = false;
                } else {
                    $.toast("商品数据错误");
                }
            });
        },
        clickKeep: function(keepId) {
            axios.get(add_collection[conf], {
                params: {
                    token: tokens,
                    mid: movieID
                }
            }).then(function(response) {
                var res = response.data.res,
                    data = response.data.data;
                var msg = response.data.msg;
                if (keepId == "") {
                    if ($(".vpl_Collection").addClass("icon-weishoucang")) {
                        $(".vpl_Collection").addClass("icon-yishoucang");
                        $(".vpl_Collection").removeClass("icon-weishoucang");
                        $(".detail-col p").text("已收藏");
                    }
                    movieDatail.keepId = data.type;
                    layer.open({
                        content: '收藏成功',
                        skin: 'msg',
                        time: 2, //2秒后自动关闭
                    });
                } else {
                    movieDatail.keep = "icon-weishoucang";
                    movieDatail.keepId = "";
                    if ($(".vpl_Collection").addClass("icon-yishoucang")) {
                        $(".vpl_Collection").addClass("icon-weishoucang");
                        $(".vpl_Collection").removeClass("icon-yishoucang");
                        $(".detail-col p").text("收藏");
                    }
                    layer.open({
                        content: '已取消收藏',
                        skin: 'msg',
                        time: 2, //2秒后自动关闭
                    });
                }

            })

        },

    }
});

function video(movie) {
    var player = cyberplayer("video").setup({
        width: '100%', // 宽度，也可以支持百分比(不过父元素宽度要有)
        height: '100%', // 高度，也可以支持百分比
        backcolor:"#000",
        title: "基本功能", // 标题
        file: "http://gcqq450f71eywn6bv7u.exp.bcevod.com/mda-hbqagik5sfq1jsai/mda-hbqagik5sfq1jsai.mp4", // 播放地址
        image: "http://gcqq450f71eywn6bv7u.exp.bcevod.com/mda-hbqagik5sfq1jsai/mda-hbqagik5sfq1jsai.jpg", // 预览图
        autostart: false, // 是否自动播放
        stretching: "uniform", // 拉伸设置
        repeat: false, // 是否重复播放
        volume: 100, // 音量
        controls: true, // controlbar是否显示
        starttime: 0, // 视频开始播放时间，如果不设置，则可以从上次播放时间点续播
        primary: "html5", // 首先使用html5还是flash播放，默认：html5
        controlbar: {
            barLogo: false
        },
        ak: "41707430fa52422f83b8efdc797f90c1" // 公有云平台注册即可获得accessKey
    });
    player.onFullscreen(function(event) {
        if (event.fullscreen) {
            api.setScreenOrientation({
                orientation: 'landscape_left'
            });
        } else {
            api.setScreenOrientation({
                orientation: 'portrait_up'
            });
        }
    });
    player.onTime(function(event) {
        if (event.position > 10) {
            player.pause();
            $(".bg_video").addClass('bg_video_show')  

        }
    });
}

/*简介*/
$(".vpl_VideoDetail_des_title").on("click", '.vpl_introduction', function() {
    $(".vpl_VideoDetail_member").toggle();
    $(".vpl_introduction").toggleClass("icon-up");
});
