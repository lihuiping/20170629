//普通会员个人中心渲染
client.invoke("getUserInfo",function(result){
 	$.hideIndicator();
	var result = $.parseJSON(result);
	if(result.data.imgurl){
		$("#p-touxiang").append("<img id='touxiang2' src="+result.data.imgurl+">")
	}else{
		$("#p-touxiang").append("<img id='touxiang2'" + " src='assets/images/tx-120.png'>")
	}
	if(result.data.username){
		$("#p-message  .username").html(result.data.username);
	}else{
		$("#p-message  .username").html(result.data.mobile);
	}
	if(result.data.score){
		$("#p-message  .score").html("积分 : "+result.data.score);
	}else{
		$("#p-message  .score").html("积分 : 0");
	}
	Cache.set("uniquemark",result.data.unique);
});	
