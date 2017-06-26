var conf = 1;
var spendList=['',baseUrl()+'index.php?r=Pay_log&m=index']; //支出接口
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
var token = token();
if(token) {
	var client1 = hprose.Client.create("http://test.7cai.tv/index.php/api/api/user?t=" + token, ['getOrderLists', 'getPoints', 'login', 'getCityMoviesLists2', 'getCityWillMoviesLists2', 'getCinemaSchedInfo', 'getTicketCinemaUrl', 'register', 'getTicketCinemaUrl', 'getCityCinemasLists', 'isLogin', 'logout', 'getCityMoviesLists', 'getCinemaInfo', 'getCinemaSchedInfo', 'getCityWillMoviesLists', 'findPwd', 'getMoviesInfo', 'sendCode', 'getUserInfo', 'getMoviesInfo', 'getAddressList', 'getUploadParams', 'getPayOrderInfo', 'getOpenId', 'getCityLists', 'getCityCinemasLists']);
	client1.getPoints(function(result) {
		var result = $.parseJSON(result);
		if(result.data.length == 0) {
			$('.mpinout_content1 .iconfont').show();
			$('.mpinout_content1 .iconfont_des').show();
		} else {
			$('.mpinout_content1 .iconfont').hide();
			$('.mpinout_content1 .iconfont_des').hide();
			var html = "";
			for(var i = 0; i < result.data.length; i++) {
				html += "<li>" +
					"<div class='mpinout_content1_liLeft'>" +
					"<p class='mptop'>" + result.data[i].mark + "</p>" +
					"<p class='mpdown'>" + result.data[i].time + "</p>" +
					"</div>" +
					"<div class='mpinout_content1_liright'>" +
					"<span class='mpinout_content1_liright_points'>+" + result.data[i].num + "</span>" +
					"</div>" +
					"</li>"
			}
			$('.mpinout_content1 ul').append(html);
		}
	});
	$(".mpinout_left").click(function() {
		$(".mpinout_right").css({
			'color': '#666',
			'background': '#fff'
		});
		$(".mpinout_left").css({
			'color': '#fff',
			'background': '#DB9454'
		});
		$(".mpinout_content1").css('display', 'block');
		$(".mpinout_content2").css('display', 'none');
	})
	$(".mpinout_right").click(function() {
		$(".mpinout_left").css({
			'background': '#fff',
			'color': '#666'
		});
		$(".mpinout_right").css({
			'background': '#DB9454',
			'color': '#fff'
		});
		$(".mpinout_content1").css('display', 'none');
		$(".mpinout_content2").css('display', 'block');
	})
	$(".IntegralRule_top_ri").click(function() {
		if($(this).attr('index') == "1") {
			$(this).parent().next().css("display", "none")
			$(this).removeClass("icon-down");
			$(this).addClass("icon-up");
			$(this).attr("index", "2");
		} else {
			$(this).parent().next().css("display", "block")
			$(this).removeClass("icon-up");
			$(this).addClass("icon-down");
			$(this).attr("index", "1");
		}
	})
} else {
	$.toast("您还未登录，请登录！");
	setTimeout(function() {
		window.location.href = "./login.html";
	}, 1000);
}

//兑换记录
var spending = new Vue({
	el: ".convert",
	data: {
		dataSpend: [],
		dataRes: []
	},
	mounted: function() {
		//初始化加载数据
		this.showSpending();
	},
	methods: {
		showSpending:function(){
			//获取商品信息
			var _this = this;
			axios.get(spendList[conf], {
				params: {
					token: token
				}
			}).then(function(response) {
				var res = response.data
				var data = response.data.data;
				if(response.data.res == 1){
					spending.dataSpend = data;
					spending.dataRes = res;
				}
			});
		}
	}
});

//支出
var spends = new Vue({
	el: "#spend",
	data: {
		spending: [],
		spendRes: []
	},
	mounted: function() {
		//初始化加载数据
		this.showSpend();
	},
	methods: {
		showSpend:function(){
			//获取商品信息
			var _this = this;
			axios.get(spendList[conf], {
				params: {
					token: token
				}
			}).then(function(response) {
				var spendResdata = response.data;
				var data = response.data.data;
				if(response.data.res == 1){
					spends.spending = data;
					spends.spendRes = spendResdata;
				}else{
					$.toast(response.data.msg);
				}
			});
		}
	}
});


$.init();