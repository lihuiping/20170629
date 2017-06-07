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
//获取token
function sclient() {
	var token = Cache.get("flag") || "";
	return hprose.Client.create("http://test.7cai.tv/index.php/api/api/user?t=" + token, ["login", "register", "isLogin", "logout", "findPwd", "sendCode", "getUserInfo", "isSafe", "modifyInfo", "isRegister", "modifyMobile", "modifyHeadImg", "certif ication", "modifyPwd", "modifySafePwd", "getAddressList", "getAddress", "addOrEditAddress", "setDefaultAddress", "delAddress", "getPayOrderInfo", "getOpenId ", "getUploadParams", "getFriends", "getPoints", "getTicketUrl", "getFkTypeLists", "addFkMsg", "getWxSdkSignInfo"]);
	//http://test.7cai.tv/index.php
}

var client = sclient();
//  获取推荐码
var uniquemark = Cache.get("uniquemark") || null;
var link = !uniquemark ? "http://v.7cai.tv" : "http://v.7cai.tv" + "?unique=" + uniquemark;
//购票页面
//	$(document).on("pageInit", "#goupiao", function(e, id, page) {
var client1 = hprose.Client.create("http://test.7cai.tv/index.php/api/api/ticket", ['getOrderLists', 'login', 'getCityMoviesLists2', 'getCityWillMoviesLists2', 'getCinemaSchedInfo', 'getTicketCinemaUrl', 'register', 'getTicketCinemaUrl', 'getCityCinemasLists', 'isLogin', 'logout', 'getCityMoviesLists', 'getCinemaInfo', 'getCinemaSchedInfo', 'getCityWillMoviesLists', 'findPwd', 'getMoviesInfo', 'sendCode', 'getUserInfo', 'getMoviesInfo', 'getAddressList', 'getUploadParams', 'getPayOrderInfo', 'getOpenId', 'getCityLists', 'getCityCinemasLists']);
var Areaid;
var Areatext;
var hotAreatext;
var totalheight;
var thismoves_id;
var totalpage;
var totalpage2;
var currentpage = 1;
var currentpage2 = 1;
var cityidSure = window.localStorage.getItem('city_select1');
if(cityidSure == null) {
	$.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=jsonp",
		function() {
			window.localStorage.setItem('city_selected', remote_ip_info.city);
			$('.gp_changeaddress').text(remote_ip_info.city);
			$('.city_area_content').find('.city_area_selectd span:eq(0)').text(remote_ip_info.city);
			$('.city_area_content').find(".city_area_hot ul:contains(" + remote_ip_info.city + ")").trigger("click");
		});
	window.localStorage.setItem('city_select1', '10');
};
$('.gp_changeaddress,.city_area_selectd span:eq(0)').text(localStorage.getItem('city_selected'));

var cityidSure = window.localStorage.getItem('city_select1'); //首次刷新需要重新写入localstorage，要在这拿一下
function getmovieList2() {
	client1.getCityMoviesLists2({
			"city_id": cityidSure,
			"page": currentpage
		}, function(result) //正在上映
		{
			$.hidePreloader();
			var result = $.parseJSON(result);
			totalpage = result.data.common.totalPage;
			var rdil = result.data.info.length;
			var html2 = "";
			for(var i = 0; i < rdil; i++) {
				html2 += "<li><div class='OrderDetail gp_OrderDetail'>" + "<div class='OrderDetailLeft gp_OrderDetailLeft' index='" + result.data.info[i].id + "'>" + "<img src='" + result.data.info[i].poster_url + "'>" + "<div class='OrderDetailLeft_des OrderDetailLeft_des_fix gp_OrderDetailLeft'>" + "<p>" + result.data.info[i].name.substring(0, 10) + "<b style='bakground:#fff;color:#fff;'>测</b><span>" + result.data.info[i].version.substring(0, 2) + "</span></p>" + "<p style='font-size:0.65rem;'>" + result.data.info[i].remark.substring(0, 12) + "...</p>" + "<p style='color:#909090;font-size:0.6rem;'><span>导演:</span><span>" + result.data.info[i].director + "</span></p>" + "<p style='color:#909090; font-size:0.6rem;'><span>主演:</span><span>" + result.data.info[i].actor.substring(0, 16) + "</span></p>" + "</div>" + "</div>" + "<div class='OrderDetailRight gp_OrderDetailRight2'>" + "<p>" + result.data.info[i].score + "</p>" + "<p class='gphref_button' index='" + result.data.info[i].id + "'>购票</p></div>"
			};
			$('.gp_box_list2 .list-container').append(html2);
			if($(window).height() == 568 && $(document).width() == 320) {
				$('html').css('font-size', '17px');
				$(".OrderDetailLeft_des_fix").css('width', '55%');
			};
		});
}

function getmovieList1() {
	client1.getCityWillMoviesLists2({
			"city_id": cityidSure,
			"page": currentpage2
		}, function(result) //即将上映
		{
			$.hidePreloader();
			var result = $.parseJSON(result);
			totalpage2 = result.data.common.totalPage;
			var rdil = result.data.info.length;
			var html1 = "";
			for(var i = 0; i < rdil; i++) {
				html1 += "<li><div class='OrderDetail gp_OrderDetail'>" + "<div class='OrderDetailLeft gp_OrderDetailLeft' index='" + result.data.info[i].id + "'>" + "<img src='" + result.data.info[i].poster_url + "'>" + "<div class='OrderDetailLeft_des OrderDetailLeft_des_fix gp_OrderDetailLeft'>" + "<p>" + result.data.info[i].name.substring(0, 10) + "<b style='bakground:#fff;color:#fff;'>测</b><span>" + result.data.info[i].version.substring(0, 2) + "</span></p>" + "<p style='font-size:0.65rem;'>" + result.data.info[i].remark.substring(0, 12) + "...</p>" + "<p style='color:#909090;font-size:0.6rem;'><span>导演:</span><span>" + result.data.info[i].director + "</span></p>" + "<p style='color:#909090; font-size:0.6rem;'><span>主演:</span><span>" + result.data.info[i].actor.substring(0, 16) + "</span></p>" + "</div>" + "</div>" + "<div class='OrderDetailRight gp_OrderDetailRight'>" + "<p style='font-size:0.7rem;'><span>1023</span>想看</p>" + "<p index='" + result.data.info[i].id + "'>预售</p></div></li>"
			};
			$('.gp_box_list1 .list-container').append(html1);
			if($(window).height() == 568 && $(document).width() == 320) {
				$('html').css('font-size', '17px');
				$(".OrderDetailLeft_des_fix").css('width', '55%');
			};
		});
};
getmovieList2();
getmovieList1();
//城市列表函数
function getCitylists() {
	client1.getCityLists(function(result) {
		var result = $.parseJSON(result);
		if(result.res == 1) {
			var rdhl = result.data.hot.length;
			console.log(result.data.hot);
			for(i = 0; i < rdhl; i++) {
				$('.city_area_hot_list ul').append('<li index=' + result.data.hot[i].id + '>' + result.data.hot[i].name + '</li>');
			}
			var character = new Array("A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "X", "Y", "Z");
			var lists = result.data.list;
			for(var i = 0; i < 20; i++) {
				$('.city_area_content').append('<div class="city_area_hot"><p class="city_area_hot_title">' + character[i] + '</p><div class="city_area_hot_listA"><ul></ul></div></div>');
				for(var j in lists[character[i]]) {
					$('.city_area_hot_listA ul').eq(i).append(('<li index=' + lists[character[i]][j].id + '>' + lists[character[i]][j].name + '</li>'));
				}
			};
		};
		sessionStorage.setItem('getCityLists', JSON.stringify(result.data));
	});
};
//城市session存储判断
if(sessionStorage.getItem('getCityLists') == null) {
	getCitylists();
} else {
	var CityListSession = $.parseJSON(sessionStorage.getItem('getCityLists'));
	var rdhl = CityListSession.hot.length;
	for(i = 0; i < rdhl; i++) {
		$('.city_area_hot_list ul').append('<li index=' + CityListSession.hot[i].id + '>' + CityListSession.hot[i].name + '</li>');
	}
	var character = new Array("A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "X", "Y", "Z");
	var lists = CityListSession.list;
	for(var i = 0; i < 20; i++) {
		$('.city_area_content').append('<div class="city_area_hot"><p class="city_area_hot_title">' + character[i] + '</p><div class="city_area_hot_listA"><ul></ul></div></div>');
		for(var j in lists[character[i]]) {
			$('.city_area_hot_listA ul').eq(i).append(('<li index=' + lists[character[i]][j].id + '>' + lists[character[i]][j].name + '</li>'));
		}
	};
};

//购票
setTimeout(function() {
	//热门
	$(".city_area_hot_list ul li").on("click",
		function() {
			currentpage = 1;
			currentpage2 = 1;
			$('.gp_box_title').show();
			Areaid = $(this).attr("index");
			Areatext = $(this).text();
			$('.city_area_selectd span:eq(0)').text(Areatext);
			window.localStorage.setItem('city_select1', Areaid);
			window.localStorage.setItem('city_selected', Areatext);
			cityidSure = window.localStorage.getItem('city_select1');
			$('.list-container').empty();
			$('.gp_citypicker').hide();
			$('.gp_box_list2').show();
			$('.gp_changeaddress').text(Areatext);
			Areaid = parseInt(Areaid);
			window.location.href = window.location.href + '?timestamp=' + Date.parse(new Date());
		});
	//选择城市
	$(".city_area_hot_listA ul li").on("click",
		function() {
			currentpage = 1;
			currentpage2 = 1;
			$('.gp_box_title').show();
			Areaid = $(this).attr("index");
			Areatext = $(this).text();
			$('.city_area_selectd span:eq(0)').text(Areatext);
			window.localStorage.setItem('city_select1', Areaid);
			window.localStorage.setItem('city_selected', Areatext);
			cityidSure = window.localStorage.getItem('city_select1');
			$('.list-container').empty();
			$('.gp_citypicker').hide();
			$('.gp_box_list2').show();
			$('.gp_changeaddress').text(Areatext);
			Areaid = parseInt(Areaid);

			window.location.href = window.location.href + '?timestamp=' + Date.parse(new Date());
		});
	//点击影票ul
	$(".gp_OrderDetailLeft").on("click",
		function() {
			var thismoves_id = $(this).attr('index');
			window.location.href = "./dyxiangqing.html?id=" + thismoves_id;
		});

	$(".gphref_button").on("click",
		function() {
			var thismoves_id = $(this).attr('index');
			window.location.href = "./gparea.html?id=" + thismoves_id;
		});

	//搜索
	$("#goupiao-input").on('click',
		function() {
			window.location.href = "./sousuoliebiao.html";
		});
	//预售 
	$(".gp_OrderDetailRight").on("click",
		function() {
			var thismoves_id = $(this).attr('index');
			window.location.href = "./gparea.html?id=" + thismoves_id;
		});
	//更换城市
	$('.cta_close').on('click', function() {
		if($('.gp_box_title_right').hasClass('gp_box_title_right_on')) {
			$('.gp_citypicker').hide();
			$('.gp_box_title').show();
			$('.gp_box_list1').show();
		} else if($('.gp_box_title_left').hasClass('gp_box_title_right_on')) {
			$('.gp_citypicker').hide();
			$('.gp_box_title').show();
			$('.gp_box_list2').show();
		}
	});
	//正在上映
	$(".gp_box_title_left").on('click', function() {
		$('.infinite-scroll_1').show();
		$('.infinite-scroll_2').hide();
		$(".gp_box_title_left").removeClass('gp_box_title_right_on');
		$(".gp_box_title_right").removeClass('gp_box_title_right_on');
		$(".gp_box_title_left").addClass('gp_box_title_right_on');
		$(".gp_box_list1").hide();
		$(".gp_box_list2").show();
	});
	//即将上映
	$(".gp_box_title_right").on('click', function() {
		$('.infinite-scroll_2').show();
		$('.infinite-scroll_1').hide();
		$(".gp_box_title_left").removeClass('gp_box_title_right_on');
		$(".gp_box_title_right").removeClass('gp_box_title_right_on');
		$(".gp_box_title_right").addClass('gp_box_title_right_on');
		$(".gp_box_list2").hide();
		$(".gp_box_list1").show();
	});
	//改变城市
	$('.gp_openAddress,.gp_changeaddress').on('click', function() {
		$('.gp_citypicker').show();
		$('.gp_box_title').hide();
		$('.gp_box_list').hide();
	});
}, 500);

//	});

//滚动加载
function gundongloading() {
	var loading = false;
//	$(document).on('infinite', '.infinite-scroll', function() {
		// 如果正在加载，则退出
		if(loading) return;
		// 设置flag
		loading = true;
		setTimeout(function() {
			loading = false;
			if(currentpage2 >= totalpage2) {
				$.detachInfiniteScroll($('.infinite-scroll_2'));
				$('.gp_box_list1 .infinite-scroll-preloader').remove();
				return;
			}
			if(currentpage >= totalpage) {
				$.detachInfiniteScroll($('.infinite-scroll_1'));
				$('.gp_box_list2 .infinite-scroll-preloader').remove();
				return;
			}
			if($('.gp_box_list2').css("display") === 'block') {
				currentpage++;
				if(currentpage > totalpage) {
					return;
				}
				getmovieList2(currentpage);
			} else if($('.gp_box_list1').css("display") === 'block') {
				currentpage2++;
				if(currentpage2 > totalpage2) {
					return;
				};
				getmovieList1(currentpage2);
			}
		}, 500);
//	});
};
gundongloading();

//阻止IOS底部拖动
function noscroll() {
	var content = document.querySelector('.content') || null;
	var startY;

	if(content) {
		content.addEventListener('touchstart', function(e) {
			startY = e.touches[0].clientY;
		});

		content.addEventListener('touchmove', function(e) {
			// 底位表示向下滚动
			// 1容许 0禁止
			var status = '11';
			var ele = this;

			var currentY = e.touches[0].clientY;

			if(ele.scrollTop === 0) {
				// 如果内容小于容器则同时禁止上下滚动
				status = ele.offsetHeight >= ele.scrollHeight ? '00' : '01';
			} else if(ele.scrollTop + ele.offsetHeight >= ele.scrollHeight) {
				// 已经滚到底部了只能向上滚动
				status = '10';
			}

			if(status != '11') {
				// 判断当前的滚动方向
				var direction = currentY - startY > 0 ? '10' : '01';
				// 操作方向和当前允许状态求与运算，运算结果为0，就说明不允许该方向滚动，则禁止默认事件，阻止滚动
				if(!(parseInt(status, 2) & parseInt(direction, 2))) {
					e.preventDefault();
				}
			}
		});
	}
}
noscroll();
$.init();