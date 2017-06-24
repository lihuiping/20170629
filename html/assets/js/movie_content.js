var conf = 1;
var tokens = token();
var tuijian_list = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Recommend/index&token=' + token()]; //banner
var content_movie = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/videoInfo/index&token=' + token()];
var add_collection = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/change.html'];
var get_collection = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/check.html'];
var add_comment = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Comment/add.html&token=' + token()];
var get_comment = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Comment/index.html'];
var playRecord = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Movie/playRecord&token=' + token()];
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
        is_read: "",
        loadingFlag: true,
        switchShow: false
    },
    mounted: function() {
        //初始化加载数据
        if (tokens == "" || tokens == undefined) {
            $.toast("您还未登录，请登录");
            setTimeout(function() {
                window.location.href = "login.html";
            }, 500)


        } else {
            this.showMovie();
            this.init();

        }

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
                // var movie="http://or9d4l0f7.bkt.clouddn.com/360-跑酷大神炫逆天特技.mp4";
                var movieTitle = data.name;
                var movieCover = data.cover;
                var istrytime = data.is_try_time;
                var start_time = data.start_time;
                _this.loadingFlag = false;
                video(movie, movieTitle, movieCover, istrytime, start_time);
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
                    // _this.loadingFlag = false;
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
        addComment: function(isread, obj) {
            $(".comment_bar").show();
            $(".comment_bar textarea").focus();
            $(".comment_bar textarea").val("");
            $(".bg_zhezhao").show();
            movieDatail.replyId = obj;
            movieDatail.is_read = isread
        },
        btn_comment: function(replyId, is_read) {
            var comment = $("#f_comment").val();
            if (comment != "" || comment == null) {
                axios.get(add_comment[conf], {
                    params: {
                        program_id: movieID,
                        content: comment,
                        reply_to: movieDatail.replyId,
                        is_read: movieDatail.is_read
                    }
                }).then(function(res) {
                    var data = res.data;
                    if (data.res == 1) {
                        //   _this.movielist = data;
                        movieDatail.moreFn(movieDatail.nowPage, 0);
                        $(".comment_bar").hide();
                        // movieDatail.loadingFlag = false;
                        //showMovie();
                    } else {
                        $.toast("评论有问题了哦~");
                    }
                });
            } else {
                $.toast("请输入评论信息~");
            }
        },
        moreFn: function(itemIndex, fabiao) {
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
                    if (fabiao == 0) {
                        movieDatail.Comment = data.data;
                        movieDatail.switchShow = !movieDatail.switchShow;
                    } else {
                        movieDatail.Comment = movieDatail.Comment.concat(data.data);
                    }
                    console.log(movieDatail.Comment);
                    //   scrollComment();
                } else {
                    // $.toast("没有更多的评论了~");

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
        close_fabiao: function() {
            $(".bg_zhezhao").hide();
            $(".comment_bar").hide();
        },
        getTitleHref: function(start_time) {
            if (tokens == "" || tokens == undefined) {
                window.location.href = 'login.html';
            } else {
                console.log(movieDatail.start_time);
                window.location.href = 'payForView.html?id=' + movieID;
            }
        },
        init: function() {
            this.moreFn(this.nowPage);
        }
    }
});

function video(movieurl, movieTitle, movieCover, istrytime, start_time) {
    // console.log(movieurl, movieTitle, movieCover,istrytime,start_time)
    //var play_status=0;
    var player = cyberplayer("video").setup({
        width: '100%', // 宽度，也可以支持百分比(不过父元素宽度要有)
        height: '100%', // 高度，也可以支持百分比
        backcolor: "#000",
        title: movieTitle, // 标题
        file: movieurl, // 播放地址
        image: movieCover, // 预览图
        autostart: false, // 是否自动播放
        stretching: "uniform", // 拉伸设置
        repeat: false, // 是否重复播放
        volume: 100, // 音量
        controls: true, // controlbar是否显示
        starttime: start_time,
        playRate: false,
        primary: "html5", // 首先使用html5还是flash播放，默认：html5
        controlbar: {
            barLogo: false
        },
        ak: "41707430fa52422f83b8efdc797f90c1",
        // 公有云平台注册即可获得accessKey
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
        $(".jw-preview").hide();
        if (istrytime != 0 && event.position > 10) {
            player.pause();
            $(".bg_video").addClass('bg_video_show');
        }
    });
    player.onPause(function(event) {
        var playTime = player.getPosition();
        axios.get(playRecord[conf], {
            params: {
                movieId: movieID,
                startTime: playTime
            }
        }).then(function(res) {
            var data = res.data;
        });

    });
    player.onBuffer(function(event) {
        $(".jw-preview").hide();
    });
    player.onComplete(function(event) {
        //alert("onComplete");
    });
}
/*滑动的效果*/
function scrollComment() {
    var navHeigth = $(window).height() - $(".videobox").height();
    $(".content").scrollTo({
        toT: navHeigth
    });
};

$(".vpl_slidemore_go").click(function() {
    $(".content").hide();
    $(".vpl_box_remonforyou").show();
    $(".vpl_remonForyou_list2").scrollTop(0);
})
$(function() {
        /*点击热评的效果*/
        $(".movie-content").on('click', '.vpl_VideoDetail_num_left', function() {
            scrollComment();
        });

        // $(".vpl_slidemore").on("click", '.vpl_slidemore_go', function() {
        //     $(".content").hide();
        //     $(".vpl_box_remonforyou").show();
        //     $(".vpl_remonForyou_list2").scrollTop(0);
        // });


        /*点击全部热评*/
        $(".buzz-review").on('click', function() {
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
    //分享
    var qq;
    var wx;
    apiready = function() {
        qq = api.require('qq');
        wx = api.require('wx');

};

function qqshareNews_QFriend() { //分享新闻qq给好友
    qq.shareNews({
        url: 'http://www.apicloud.com',
        title: '新闻分享',
        description: '新闻描述',
        imgUrl: 'widget://res/news.png',
        type: "QFriend"
    }, function(ret, err) {
        if (ret.status) {
            alert(JSON.stringify(ret))
        } else {
            alert(JSON.stringify(err));
        }
    });
}

function qqshareNews_QZone() { //分享新闻到QQ空间
    //  var movieId = 
    $.ajax({
        type: "get",
        url: baseUrl() + "tv/index.php?s=api/videoInfo/share",
        data: {
            "id": movieID,
            "token": tokens
        },
        async: true,
        success: function(res) {
            //          console.log(res.data);
            //          return false;
            qq.shareNews({
                url: 'https://www.baidu.com', //baseUrl()+'/html/movie-content.html?id='+ movieID
                title: res.data.name,
                description: res.data.content,
                imgUrl: res.data.url_cover,
                type: "QZone"
            }, function(ret, err) {
                if (ret.status) {
                    $.toast("分享成功");
                } else {
                   if(err.code == -4){
						$.toast("取消分享");
					}else if(err.code == 10009){
						$.toast("当前设备未安装qq客户端 ");
					}else{
						$.toast("分享失败");
					}
                }
            });
        }
    });

}

function shareWebpage(Vscene) { //分享微信好友,朋友圈 . 参数: session（会话） timeline（朋友圈）favorite（收藏）
    $.ajax({
        type: "get",
        url: baseUrl() + "tv/index.php?s=api/videoInfo/share",
        data: {
            "id": movieID,
            "token": tokens
        },
        async: true,
        success: function(res) {
            wx.shareWebpage({
                apiKey: 'wx64c1ec0115c22f7f',
                scene: Vscene,
                title: res.data.name,
                description: res.data.content,
                thumb: res.data.cover,
                contentUrl: 'http://www.apicloud.com' //'movie-content.html?'+ movieId
            }, function(ret, err) {
                if (ret.status) {
                    $.toast("分享成功");
                } else {
                    if(err.code == 2){
						$.toast("取消分享");
					}else if(err.code == 3){
						$.toast("发送失败");
					}else{
						$.toast("分享失败");
					}
                }
            });
        }
    });
}
