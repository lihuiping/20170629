var conf = 1;
var toke = token();	
var get_sysmessage = ['', baseUrl() + 'member.php?r=Notice_log&m=readAndNoReadNum&token=' + toke];
var Cookie = {
		Get: function(a) {
			var d, b = document.cookie.split("; "),
				c = [];
			for(i = 0; i < b.length; i++) d = b[i].split("="), c[d[0]] = unescape(d[1]);
			return a ? c[a] : c
		},
		Set: function(a, b, c, d, e, f) {
			var g, h;
			return a && b ? "" == a || "" == b ? !1 : (c && (/^[0-9]+$/.test(c) ? (g = new Date, c = new Date(g.getTime() + 1e3 * c).toGMTString()) : /^wed, \d{2} \w{3} \d{4} \d{2}\:\d{2}\:\d{2} GMT$/.test(c) || (c = void 0)), h = a + "=" + escape(b) + ";" + (c ? " expires=" + c + ";" : "") + (d ? "path=" + d + ";" : "") + (e ? "domain=" + e + ";" : "") + (f && 0 != f ? "secure" : ""), h.length < 4096 ? (document.cookie = h, !0) : !1) : !1
		},
		Del: function(a, b, c) {
			return a ? "" == a ? !1 : this.Get(a) ? (document.cookie = a + "=;" + (b ? "path=" + b + ";" : "") + (c ? "domain=" + c + ";" : "") + "expires=Thu, 01-Jan-1970 00:00:01 GMT;", !0) : !1 : !1
		}
	},
	Cache = function() {
		var storage, api = {},
			pre = "NetCQ_",
			win = window,
			doc = win.document,
			localStorageName = "localStorage",
			globalStorageName = "globalStorage",
			JsonToStr = function(a) {
				var c, b = [];
				if("string" == typeof a) return '"' + a.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + '"';
				if("undefined" == typeof a) return "undefined";
				if("object" == typeof a) {
					if(null === a) return "null";
					if(a.sort) {
						for(c = 0; c < a.length; c++) b.push(JsonToStr(a[c]));
						b = "[" + b.join() + "]"
					} else {
						for(c in a) b.push('"' + c + '":' + JsonToStr(a[c]));
						b = "{" + b.join() + "}"
					}
					return b
				}
				return a.toString()
			};
		return api.set = function() {}, api.get = function() {}, api.remove = function() {}, api.clear = function() {}, localStorageName in win && win[localStorageName] ? (storage = win[localStorageName], api.set = function(a, b) {
			"object" == typeof b ? storage.setItem(pre + a, JsonToStr(b)) : storage.setItem(pre + a, b)
		}, api.get = function(key) {
			var _v, _cache = storage.getItem(pre + key) || "";
			try {
				_v = eval("(" + _cache + ")")
			} catch(e) {
				_v = _cache
			}
			return _v
		}, api.clear = function(a) {
			a ? storage.removeItem(pre + a) : storage.clear()
		}) : globalStorageName in win && win[globalStorageName] ? (storage = win[globalStorageName][win.location.hostname], api.set = function(a, b) {
			"object" == typeof b ? storage[pre + a] = JsonToStr(b) : storage[a] = b
		}, api.get = function(key) {
			var _v, _cache = storage[pre + key].value || "";
			try {
				_v = eval("(" + _cache + ")")
			} catch(e) {
				_v = _cache
			}
			return _v
		}, api.clear = function(a) {
			if(a) delete storage[pre + a];
			else
				for(var a in storage) delete storage[a]
		}) : (api.set = function(a, b) {
			Cookie.Set(pre + a, b)
		}, api.get = function(a) {
			return Cookie.Get(pre + a)
		}, api.clear = function(a) {
			var b, c;
			if(a) Cookie.Del(pre + a);
			else if(b = document.cookie.match(/[^ =;]+(?=\=)/g))
				for(c = b.length; c--;) document.cookie = b[c] + "=0;expires=" + new Date(0).toUTCString()
		}), api
	}();
var isVIP = '';
var token = token();
//获取token
function sclient() {
	//var token = Cache.get("flag") || "";
//	token = token();
	return hprose.Client.create("http://test.7cai.tv/index.php/api/api/user?t=" + token, ["login", "register", "isLogin", "logout", "findPwd", "sendCode", "getUserInfo", "isSafe", "modifyInfo", "isRegister", "modifyMobile", "modifyHeadImg", "certif ication", "modifyPwd", "modifySafePwd", "getAddressList", "getAddress", "addOrEditAddress", "setDefaultAddress", "delAddress", "getPayOrderInfo", "getOpenId ", "getUploadParams", "getFriends", "getPoints", "getTicketUrl", "getFkTypeLists", "addFkMsg", "getWxSdkSignInfo"]);
	//http://test.7cai.tv/index.php
}

var client = sclient();
//获取推荐码
var uniquemark = Cache.get("uniquemark") || null;

//是否VIP
function isVip() {
//	var token = Cache.get("flag") || "";
	$.ajax({
		type:"get",
		url:"http://my.shop.7cai.tv/tv/index.php?s=/Api/Center/is_vip&token="+token,
		async:true,
		success: function(result){
			if(result.res == 1) {
				Cache.set("isVIP", result.data.isvip);
				isVIP = result.data.isvip;
				if(isVIP == 1) {
					$("#p-message").css("display","none");
					$("#huiyuan-page").css("display","none");
					$("#hy-edit").css("display","block");
					$("#hytq").css("display","block");					
					//vip会员个人中心渲染
					$.showIndicator();
					var txwidth = $(".hybg-touxiang").width();
					$(".hybg-touxiang").css("height", txwidth);
					client.invoke("getUserInfo", function(result) {
						$.hideIndicator();
						var result = $.parseJSON(result);
						if(result.data.imgurl) {
							$(".hybg-touxiang").append("<img src='"+result.data.imgurl+"'>");
						} else {
							$(".hybg-touxiang").append("<img src='assets/images/tx-160.png'>")
						}
						if(result.data.username) {
							$("#hui-mobile").html(result.data.username);
						} else {
							$("#hui-mobile").html(result.data.mobile);
						}
						if(result.data.score) {
							$("#vip-jifen").html("七彩币" + result.data.score);
						} else {
							$("#vip-jifen").html("七彩币 : 0");
						}
						Cache.set("uniquemark", result.data.unique);
					});
				} else {
					$("#p-message").css("display","block");
					$("#huiyuan-page").css("display","block");
					$("#hy-edit").css("display","none");
					$("#hytq").css("display","none");
					
					
					//普通会员个人中心渲染
					$.showIndicator();
					client.invoke("getUserInfo",function(result){
					 	$.hideIndicator();
						var result = $.parseJSON(result);
						if(result.data.imgurl){
							$("#p-touxiang").append("<img id='touxiang2' src='"+result.data.imgurl+"'>")
						}else{
							$("#p-touxiang").append("<img id='touxiang2'" + " src='assets/images/tx-120.png'>")
						}
						if(result.data.username){
							$("#p-message  .username").html(result.data.username);
						}else{
							$("#p-message  .username").html(result.data.mobile);
						}
						if(result.data.score){
							$("#p-message  .score").html("七彩币 : "+result.data.score);
						}else{
							$("#p-message  .score").html("七彩币 : 0");
						}
						Cache.set("uniquemark",result.data.unique);
					});
				}
			} else {
				$.toast(result.msg);
				if(!token){
					setTimeout(function(){
						window.location.href = "./login.html";
					},1000);
				}
			}
		}
	});
};

$(function(){
	isVip();
	if(!token){
		window.location.href = "./login.html";
	}
});
//系统消息显示有无
var xiaoxinum = new Vue({
	el:"#xxzx-page",
	data: {
		sysmessages: []
	},
	mounted: function() {
		var _this = this;
		_this.showXiaoxinum();
		//初始化加载数据
		/*setInterval(function(){
			_this.showXiaoxinum();
		},6000);*/
	},
	methods: {
		showXiaoxinum: function(){
			var _this = this;
			axios.get(get_sysmessage[conf]).then(function(response) {
				var dataMessages = response.data.data;
				xiaoxinum.sysmessages = dataMessages;
//				console.log(dataMessages.noRead);
			});
			
		},
	}
});

