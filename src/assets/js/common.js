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
//获取token
var token = function() {
	//	return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiMTI5NCIsInYiOjEsImlhdCI6MTQ5NTc5MDA1OH0.T8cESgLZa9eX5TcErXNgMHb93xuHs9IGVsqubfpoJK4';
	var key = "";
	user = $api.getStorage('user');
	//alert(user.flag);
	if(user == undefined || user == "") {

	} else {
		return user.flag;
	}
	//return Cache.get('token')

};

function Is_weixn() {
	var ua = navigator.userAgent.toLowerCase();
	return(ua.match(/MicroMessenger/i) == "micromessenger");
}

var getUrlVars = function() {
	var vars = [],
		hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
var isWenxin = Is_weixn();
var tokens = token();
if(isWenxin && tokens != '') {
	var openid = Cache.get("openid") || null;
	if(!openid) {
		var code = getUrlVars()["code"] || null;
		if(code) {
			$.ajax({
				type: "post",
				url: "http://my.shop.7cai.tv/pay.php?r=index&m=getWxId",
				data: "code=" + code + '&token=' + tokens,
				dataType: "json",
				success: function(result) {
					if(result.res == 1) {
						openid = result.data.openid;
						Cache.set("openid", result.data.openid);
					} else {
						$.toast(result.msg);
					}
				},
				error: function() {
					$.toast('授权失败！');
				}
			});
		} else {
			window.location.href = "http://v.7cai.tv/getcode.html?backurl=" + encodeURIComponent("http://shop.7cai.tv/wx/index.html") + "&snsapi=snsapi_userinfo";
		}

	}
}
$(function() {
	var tokEn = getUrlVars()["token"];
	//	var tokEn = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiODM4IiwidiI6MSwiaWF0IjoxNDkzMDAzMjg3fQ.PpqXb_oSU8EJVLAlwdzUBXsI67a2qAp7h5VuGf5Ly68';
	if(tokEn != undefined) {
		Cache.set('token', tokEn);
	};

	//	$(".bar-tab").on('click', ".tab-item", function(event) {
	//		var th = $(this);
	//		var ss = $(this).siblings('.tab-item');
	//		var dtClass = th.data('class');
	//		$(this).find(".icon").prop('className', 'icon ' + dtClass + '-active');
	//		$.each(ss, function(index, val) {
	//			var pard = $(this).data('class');
	//			$(this).find('.icon').removeClass().addClass('icon ' + pard);
	//
	//		});
	//	});

});
//$(".bar-tab").on('click', ".tab-item", function(event) {
//	var th = $(this);
//	var ss = $(this).siblings('.tab-item');
//	var dtClass = th.data('class');
//	$(this).find(".icon").prop('className', 'icon ' + dtClass + '-active');
//	$.each(ss, function(index, val) {
//		var pard = $(this).data('class');
//		$(this).find('.icon').removeClass().addClass('icon ' + pard);
//
//	});
//});

var apiready = function() {
	$api.fixStatusBar($api.dom('.shouye-head'));
	$api.fixStatusBar($api.dom('.movie-souye-head'));
	$api.fixStatusBar($api.dom('.bar-nav'));
	$api.fixStatusBar($api.dom('.ad-bar'));
	var offset = $api.offset('.ad-bar');
};
apiready();

function openNewPage(name, uri) {
	api.openWin({
		name: name,
		url: uri,
		animation: {
			type: "none"
		}
	});
}

function exitApp() {
	api.addEventListener({
		name: 'keyback'
	}, function(ret, err) {
		api.toast({
			msg: '再按一次返回键退出' + api.appName,
			duration: 2000,
			location: 'bottom'
		});

		api.addEventListener({
			name: 'keyback'
		}, function(ret, err) {
			api.closeWidget({
				id: 'A6940555676996', //这里改成自己的应用ID
				retData: {
					name: 'closeWidget'
				},
				silent: true
			});
		});

		setTimeout(function() {
			exitApp();
		}, 3000)
	});
}
