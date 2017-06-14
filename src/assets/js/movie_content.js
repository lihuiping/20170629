var conf = 1;
var toke = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiODg4IiwidiI6MSwiaWF0IjoxNDk2OTEzOTU1fQ.47xETg6GOcUcGegHQXn7xX1mf3OECo5NrOLEzXl7M68'; //获取token
var tuijian_list = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Recommend/index&token=' + toke]; //banner
var content_movie = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/videoInfo/index&token=' + toke];
var add_collection = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/change.html'];
var get_collection = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/check.html'];
var add_comment = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Comment/add.html&token=' + toke];
var get_comment = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Comment/index.html'];
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
        keepId: "",
        replyId: "",
        nowPage: 1,
        comCount: "",
        switchShow: false
    },
    mounted: function() {
        //初始化加载数据
        this.showMovie();
        this.init();
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
                var movie = data.url;
             //   var movie="http://my.shop.7cai.tv/tv/f000000";
                var movieTitle = data.name;
                var movieCover = data.cover;
                video(movie, movieTitle, movieCover);
            });
            //获取评价

            // 获取收藏
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
        addComment: function(obj) {
            $(".comment_bar").show();
            $(".comment_bar textarea").focus();
           $(".comment_bar textarea").val("");
            movieDatail.replyId = obj;
        },
        btn_comment: function(replyId) {
            var comment = $("#f_comment").val();
            axios.get(add_comment[conf], {
                params: {
                    program_id: movieID,
                    content: comment,
                    reply_to: movieDatail.replyId
                }
            }).then(function(res) {
                var data = res.data;
                if (data.res == 1) {
                    //   _this.movielist = data;
                    console.log(data);
                    movieDatail.moreFn(this.nowPage,0);
                    $(".comment_bar").hide();
                    // _this.loadingFlag = false;
                    //showMovie();
                } else {
                    $.toast("评论有问题了哦~");
                }
            });
        },
        moreFn: function(itemIndex,fabiao) {
            axios.get(get_comment[conf], {
                params: {
                    program_id: movieID,
                    page: itemIndex
                }
            }).then(function(res) {
                var data = res.data;
                if (data.res == 1) {
                     movieDatail.switchShow = !movieDatail.switchShow;
                    // movieDatail.$set(movieDatail.Comment,movieDatail.Comment.concat(data.data));
                    movieDatail.comCount = data.data[0].comCount;
                    if(fabiao ==0){
                          movieDatail.Comment = data.data;
                          movieDatail.switchShow = !movieDatail.switchShow;
                    }else{
                           movieDatail.Comment = movieDatail.Comment.concat(data.data);
                    }
                    console.log(movieDatail.Comment);   
                    //   scrollComment();
                } else {
                    $.toast("没有更多的评论了~");
                  
                }
            });

        },
        getCommentMore: function() {
            this.switchShow = !this.switchShow;
            this.nowPage++;
            this.moreFn(this.nowPage);
        },
        close_tj: function() {
            $(".content").show();
            $(".vpl_box").hide();
        },
        init: function() {
            this.moreFn(this.nowPage);
        }
    }
});

function video(movie, movieTitle, movieCover) {
    var player = cyberplayer("video").setup({
        width: '100%', // 宽度，也可以支持百分比(不过父元素宽度要有)
        height: '100%', // 高度，也可以支持百分比
        backcolor: "#000",
        title: movieTitle, // 标题
        file: movie, // 播放地址
        image: movieCover, // 预览图
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
/*滑动的效果*/
function scrollComment() {
    var navHeigth = $(window).height() - $(".videobox").height();
    $(".content").scrollTo({
        toT: navHeigth
    });
};

$(function(){

/*点击热评的效果*/
$(".movie-content").on('click', '.vpl_VideoDetail_num_left', function() {
    // alert("反应");
    scrollComment();
});

// $(".vpl_slidemore").on("click", '.vpl_slidemore_go', function() {
//     $(".content").hide();
//     $(".vpl_box_remonforyou").show();
//     $(".vpl_remonForyou_list2").scrollTop(0);
// });

$(".vpl_slidemore_go").click(function(){
     $(".content").hide();
    $(".vpl_box_remonforyou").show();
    $(".vpl_remonForyou_list2").scrollTop(0); 
})

/*点击全部热评*/
  $(".buzz-review").on('click',function(){
     $(".content").hide();
    $(".vpl_tc_comment").show();
    $(".movie-other-review").scrollTop(0); 
  })

/*简介*/
$(".vpl_VideoDetail_des_title").on("click", '.vpl_introduction', function() {
    $(".vpl_VideoDetail_member").toggle();
    $(".vpl_introduction").toggleClass("icon-up3");
});

})
