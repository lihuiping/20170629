var Cookie={Get:function(a){var d,b=document.cookie.split("; "),c=[];for(i=0;i<b.length;i++)d=b[i].split("="),c[d[0]]=unescape(d[1]);return a?c[a]:c},Set:function(a,b,c,d,e,f){var g,h;return a&&b?""==a||""==b?!1:(c&&(/^[0-9]+$/.test(c)?(g=new Date,c=new Date(g.getTime()+1e3*c).toGMTString()):/^wed, \d{2} \w{3} \d{4} \d{2}\:\d{2}\:\d{2} GMT$/.test(c)||(c=void 0)),h=a+"="+escape(b)+";"+(c?" expires="+c+";":"")+(d?"path="+d+";":"")+(e?"domain="+e+";":"")+(f&&0!=f?"secure":""),h.length<4096?(document.cookie=h,!0):!1):!1},Del:function(a,b,c){return a?""==a?!1:this.Get(a)?(document.cookie=a+"=;"+(b?"path="+b+";":"")+(c?"domain="+c+";":"")+"expires=Thu, 01-Jan-1970 00:00:01 GMT;",!0):!1:!1}},Cache=function(){var storage,api={},pre="NetCQ_",win=window,doc=win.document,localStorageName="localStorage",globalStorageName="globalStorage",JsonToStr=function(a){var c,b=[];if("string"==typeof a)return'"'+a.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+'"';if("undefined"==typeof a)return"undefined";if("object"==typeof a){if(null===a)return"null";if(a.sort){for(c=0;c<a.length;c++)b.push(JsonToStr(a[c]));b="["+b.join()+"]"}else{for(c in a)b.push('"'+c+'":'+JsonToStr(a[c]));b="{"+b.join()+"}"}return b}return a.toString()};return api.set=function(){},api.get=function(){},api.remove=function(){},api.clear=function(){},localStorageName in win&&win[localStorageName]?(storage=win[localStorageName],api.set=function(a,b){"object"==typeof b?storage.setItem(pre+a,JsonToStr(b)):storage.setItem(pre+a,b)},api.get=function(key){var _v,_cache=storage.getItem(pre+key)||"";try{_v=eval("("+_cache+")")}catch(e){_v=_cache}return _v},api.clear=function(a){a?storage.removeItem(pre+a):storage.clear()}):globalStorageName in win&&win[globalStorageName]?(storage=win[globalStorageName][win.location.hostname],api.set=function(a,b){"object"==typeof b?storage[pre+a]=JsonToStr(b):storage[a]=b},api.get=function(key){var _v,_cache=storage[pre+key].value||"";try{_v=eval("("+_cache+")")}catch(e){_v=_cache}return _v},api.clear=function(a){if(a)delete storage[pre+a];else for(var a in storage)delete storage[a]}):(api.set=function(a,b){Cookie.Set(pre+a,b)},api.get=function(a){return Cookie.Get(pre+a)},api.clear=function(a){var b,c;if(a)Cookie.Del(pre+a);else if(b=document.cookie.match(/[^ =;]+(?=\=)/g))for(c=b.length;c--;)document.cookie=b[c]+"=0;expires="+new Date(0).toUTCString()}),api}();
var isVIP='';
function sclient(){
	var token = Cache.get("flag") || "";
	var uri = "http://test.7cai.tv/index.php/api/api/user?t="+token;
	return new hprose.HttpClient(uri);
}

var client = sclient();

function Is_weixn(){  
	var ua = navigator.userAgent.toLowerCase();  
	return (ua.match(/MicroMessenger/i)=="micromessenger");
}
var isWenxin = Is_weixn();
//  获取推荐码
var uniquemark = Cache.get("uniquemark") || null;
var link = !uniquemark ? "http://v.7cai.tv":"http://v.7cai.tv"+"?unique="+uniquemark;
   //微信分享
   if(isWenxin){
    client.invoke("getWxSdkSignInfo",[{"url":window.location.href}],function(result){
    	var result = $.parseJSON(result);
    	if(result.res == 1){
    		 wx.config({
			    debug: false, 
			    appId: result.data.appid, 
			    timestamp:result.data.timestamp, 
			    nonceStr: result.data.noncestr, 
			    signature: result.data.signature,
			    jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","chooseImage","previewImage"]
			});		 
	      var title = "欢迎访问七彩梦，海量视频等你哟~"; 
	      var imgurl = "http://v.7cai.tv/images/logo.png";
		  
           wx.ready(function(){ 	     
   	       //分享到朋友圈
   	         	       	       
              wx.onMenuShareTimeline({
              title: title, // 分享标题
              link: link, // 分享链接
			  imgUrl:imgurl, // 分享图标
			  success: function () {
			    	history.go(-1);
			        // 用户确认分享后执行的回调函数
			    },
			    cancel: function () {
			    	history.go(-1);
			        // 用户取消分享后执行的回调函数
			     }
               });
            
			  //分享给朋友
			  wx.onMenuShareAppMessage({
			    title: title, // 分享标题
			    desc: '', // 分享描述
			    link: link, // 分享链接
			    imgUrl: imgurl, // 分享图标
			    type: '', // 分享类型,music、video或link，不填默认为link
			    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			    success: function () {
			    	history.go(-1);
			        // 用户确认分享后执行的回调函数
			    },
			    cancel: function () {
			    	history.go(-1);
			        // 用户取消分享后执行的回调函数
			    }
			});			
			//分享到qq		
			  wx.onMenuShareQQ({
			    title: title, // 分享标题
			    desc: '', // 分享描述
			    link: link, // 分享链接
			    imgUrl: imgurl, // 分享图标
			    success: function () {
			    	history.go(-1);
			       // 用户确认分享后执行的回调函数
			    },
			    cancel: function () {
			    	history.go(-1);
			       // 用户取消分享后执行的回调函数
			    }
			    });		  
	})			
    	};
   
    })
   };
   
//判断是否登录
var isLogin = function(){
    	if(Cache.get("flag")){
    		if(!Cache.get("Login")){
    			client.invoke("isLogin",[{"mobile":Cache.get("whole_mobile")}],function(result){
	     		var result = $.parseJSON(result);
		  		if(result.res == 0){
		  			$.toast("您还未登录！");
		  			return false;
		  		 }else{
		  		 	Cache.set("Login",1);
		  		 	return true;
		  		 }
	  	 	})   			
    		}else{
    			return true;
    		}
    		
	    }else{
     		$.toast("您还未登录！");
  			return false;
     	}
}



//提示未登录跳转
var noLogin = function(){
			  			setTimeout(function(){
		  				window.location.href = "login.html";		  				
		  			},1500)
}

//是否VIP
var isVip = function(){
	var isVIP = Cache.get("isVIP") || 0;
				if(!isVIP){
			 		client.invoke("getUserInfo",function(result){
			 			var result = $.parseJSON(result);
			 			if(result.res == 1){			 				
			 				Cache.set("isVIP",result.data.isVip);
			 				isVIP = result.data.isVip;
			 				if(isVIP == 1){
							// 已经是会员。								 
						 			window.location.href = "/templets/gerenzhongxin/personmessage_huiyuan.html";						 			
							}else{
								window.location.href = "/templets/gerenzhongxin/personmessage.html";
							}
			 				
			 			}else{
			 				$.toast(result.msg);
			 			}
			 		})
			 	}else{
			 			window.location.href = "/templets/gerenzhongxin/personmessage_huiyuan.html";			 		
			 	}
}   

//获取分享码
 var getUrlVars = function() {
			 var vars = [],
				 hash;
			 var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			 for (var i = 0; i < hashes.length; i++) {
				 hash = hashes[i].split('=');
				 vars.push(hash[0]);
				 vars[hash[0]] = hash[1];
			 }
			 return vars;
	}


//导航跳转
function myNav(){
	//首页
	$("#nav-shouye").on("click",function(){
		$.showIndicator();
		$("#nav-shouye span:nth-child(1)").addClass("icon-shouye-tianchong");
		$("#nav-shangcheng span:nth-child(1)").addClass("icon-shangcheng1");
		$("#nav-shangcheng span:nth-child(1)").removeClass("icon-shangcheng-tianchong");
		$("#nav-goupiao span:nth-child(1)").addClass("icon-goupiao1");
		$("#nav-goupiao span:nth-child(1)").removeClass("icon-goupiao-tianchong");
		$("#nav-faxian span:nth-child(1)").removeClass("icon-faxian-tianchong");
		$("#nav-wode span:nth-child(1)").addClass("icon-wode1");
		$("#nav-wode span:nth-child(1)").removeClass("icon-wode-tianchong");
		window.location.href="/"
	});
	//商城
	$("#nav-shangcheng").on("click",function(){
		$.showIndicator();
		$("#nav-shangcheng span:nth-child(1)").addClass("icon-shangcheng-tianchong");
		$("#nav-shouye span:nth-child(1)").removeClass("icon-shouye-tianchong");
		$("#nav-goupiao span:nth-child(1)").addClass("icon-goupiao1");
		$("#nav-goupiao span:nth-child(1)").removeClass("icon-goupiao-tianchong");
		$("#nav-faxian span:nth-child(1)").removeClass("icon-faxian-tianchong");
		$("#nav-wode span:nth-child(1)").addClass("icon-wode1");
		$("#nav-wode span:nth-child(1)").removeClass("icon-wode-tianchong");
		window.location.href="http://shop.7cai.tv/wx/index.html?token="+Cache.get("flag")+"&isvip="+Cache.get("isVIP");
	});
	//购票
	$("#nav-goupiao").on("click",function(){
		$.showIndicator();
		$("#nav-goupiao span:nth-child(1)").addClass("icon-goupiao-tianchong");
		$("#nav-shouye span:nth-child(1)").removeClass("icon-shouye-tianchong");
		$("#nav-shangcheng span:nth-child(1)").removeClass("icon-shangcheng-tianchong");	
		$("#nav-faxian span:nth-child(1)").removeClass("icon-faxian-tianchong");
		$("#nav-wode span:nth-child(1)").addClass("icon-wode1");
		$("#nav-wode span:nth-child(1)").removeClass("icon-wode-tianchong");
		window.location.href="/templets/goupiao/goupiao.html"
	});
	//发现
	$("#nav-faxian").on("click",function(){
		$.showIndicator();
		$("#nav-faxian span:nth-child(1)").addClass("icon-faxian-tianchong");
		$("#nav-shouye span:nth-child(1)").removeClass("icon-shouye-tianchong");
		$("#nav-shangcheng span:nth-child(1)").removeClass("icon-shangcheng-tianchong");
		$("#nav-goupiao span:nth-child(1)").addClass("icon-goupiao1");
		$("#nav-goupiao span:nth-child(1)").removeClass("icon-goupiao-tianchong");
		$("#nav-wode span:nth-child(1)").addClass("icon-wode1");
		$("#nav-wode span:nth-child(1)").removeClass("icon-wode-tianchong");
		window.location.href="/templets/faxian/faxian.html";
	});
	//我的
	$("#nav-wode").on("click",function(e){
		$("#nav-wode span:nth-child(1)").removeClass("icon-wode1");
		$("#nav-wode span:nth-child(1)").addClass("icon-wode-tianchong");
		$("#nav-shouye span:nth-child(1)").removeClass("icon-shouye-tianchong");
		$("#nav-shangcheng span:nth-child(1)").removeClass("icon-shangcheng-tianchong");
		$("#nav-goupiao span:nth-child(1)").addClass("icon-goupiao1");
		$("#nav-goupiao span:nth-child(1)").removeClass("icon-goupiao-tianchong");
		$("#nav-faxian span:nth-child(1)").removeClass("icon-faxian-tianchong");
		$.showIndicator();
		window.location.href="/templets/gerenzhongxin/isvip.html";
	});
}

myNav();

//部分交互，跳转
function test(){

	/*
	//编辑信息未保存返回
	$("#meback").on("click",function(){
			$.confirm('您还未保存已修改的信息，确定现在要返回吗？',
			function(){
				history.back();
			},
			function(){
				
			}
			)
			
	})*/
	
	//阻止IOS底部拖动
	function noscroll(){
    	var content = document.querySelector('.content') || null;
		var startY;
		
		if(content){
			content.addEventListener('touchstart', function (e) {
		    startY = e.touches[0].clientY;
		});
		
			content.addEventListener('touchmove', function (e) {
			    // 高位表示向上滚动
			    // 底位表示向下滚动
			    // 1容许 0禁止
			    var status = '11';
			    var ele = this;
			
			    var currentY = e.touches[0].clientY;
			
			    if (ele.scrollTop === 0) {
			        // 如果内容小于容器则同时禁止上下滚动
			        status = ele.offsetHeight >= ele.scrollHeight ? '00' : '01';
			    } else if (ele.scrollTop + ele.offsetHeight >= ele.scrollHeight) {
			        // 已经滚到底部了只能向上滚动
			        status = '10';
			    }
			
			    if (status != '11') {
			        // 判断当前的滚动方向
			        var direction = currentY - startY > 0 ? '10' : '01';
			        // 操作方向和当前允许状态求与运算，运算结果为0，就说明不允许该方向滚动，则禁止默认事件，阻止滚动
			        if (!(parseInt(status, 2) & parseInt(direction, 2))) {
			            e.preventDefault();
			        }
			    }
			});
		}		
    }
noscroll();

}

test();
