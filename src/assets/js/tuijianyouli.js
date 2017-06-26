$(function(){
	var unique = Cache.get("uniquemark");
    $('#qrcode').qrcode({
	    width: 109,
	    height: 109,
	    text: "http://v.7cai.tv/templets/gerenzhongxin/login/mregist.html?unique="+unique
    });
    var qq;
    var wx;
  var apiready = function() {
        qq = api.require('qq');
        wx = api.require('wx');
       }
})

function qqshareNews_QZone() { //分享新闻到QQ空间
            qq.shareNews({
                url: 'http://v.7cai.tv/templets/gerenzhongxin/login/mregist.html?unique='+unique, 
                title: '七彩梦',
                description: '好友邀请您来注册七彩梦，快来注册吧！',
                imgUrl: 'http://v.7cai.tv/images/l-logo.png',
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

function shareWebpage(Vscene) { //分享微信好友,朋友圈 . 参数: session（会话） timeline（朋友圈）favorite（收藏）
    
            wx.shareWebpage({
                apiKey: 'wx64c1ec0115c22f7f',
                scene: Vscene,
                title: '七彩梦',
                description: '好友邀请您来注册七彩梦，快来注册吧！',
                thumb: 'widget://assets/images/l-logo.png',
                contentUrl: 'http://v.7cai.tv/templets/gerenzhongxin/login/mregist.html?unique='+unique //'movie-content.html?'+ movieId
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
