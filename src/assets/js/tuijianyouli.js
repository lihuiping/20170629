(function() {
  const qr = new QRious({
    element: document.getElementById('qr'),
    value: 'http://v.7cai.com/'
  })
})()
var qq,wx;
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