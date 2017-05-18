
//判断用户是否已经登陆，如果已经登陆进入点击页面，否则跳转登陆页面
$(function(){
	$(".ifLogin").each(function() {	
	$(this).click(function(){
		if(Cache.get('token') == undefined || Cache.get('token') == null) {
			$(this).attr('href', 'http://v.7cai.tv/templets/gerenzhongxin/login/login.html');
			
		}
	})	
});
})

