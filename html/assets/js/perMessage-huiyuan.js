//vip会员个人中心渲染
$.showIndicator();
client = sclient();
var txwidth = $(".hybg-touxiang").width();
$(".hybg-touxiang").css("height", txwidth);
var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
if(isiOS) {
	$(".hybg-touxiang").css("top", "17%");
	$(".hybg-down-num").css("bottom", "0.6rem");
}

client.invoke("getUserInfo", function(result) {
	$.hideIndicator();
	var result = $.parseJSON(result);
	console.log(result.data);
	if(result.data.imgurl) {
		$(".hybg-touxiang").append("<img src=" + result.data.imgurl + ">")
	} else {
		$(".hybg-touxiang").append("<img src='assets/images/tx-160.png'>")
	}
	if(result.data.username) {
		$("#hui-mobile").html(result.data.username);
	} else {
		$("#hui-mobile").html(result.data.mobile);
	}
	if(result.data.score) {
		$("#vip-jifen").html("积分" + result.data.score);
	} else {
		$("#vip-jifen").html("积分 : 0");
	}
	Cache.set("uniquemark", result.data.unique);
});

$.init();