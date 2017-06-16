function noscroll() {
	var content = document.querySelector('.page');
	var startY;
	content.addEventListener('touchstart', function(e) {
		startY = e.touches[0].clientY;
	});
	content.addEventListener('touchmove', function(e) {
		var status = '11';
		var ele = this;
		var currentY = e.touches[0].clientY;
		if(ele.scrollTop === 0) {
			status = ele.offsetHeight >= ele.scrollHeight ? '00' : '01';
		} else if(ele.scrollTop + ele.offsetHeight >= ele.scrollHeight) {
			status = '10';
		}
		if(status != '11') {
			var direction = currentY - startY > 0 ? '10' : '01';
			if(!(parseInt(status, 2) & parseInt(direction, 2))) {
				e.preventDefault();
			}
		}
	});
}
var client1 = hprose.Client.create("http://test.7cai.tv/index.php/api/api/ticket", ['getOrderLists', 'getCityCinemasLists2', 'login', 'getCinemaSchedInfo', 'getTicketCinemaUrl', 'register', 'getTicketCinemaUrl', 'getCityCinemasLists', 'isLogin', 'logout', 'getCityMoviesLists', 'getCinemaInfo', 'getCinemaSchedInfo', 'getCityWillMoviesLists', 'findPwd', 'getMoviesInfo', 'sendCode', 'getUserInfo', 'getMoviesInfo', 'getAddressList', 'getUploadParams', 'getPayOrderInfo', 'getOpenId', 'getCityLists', 'getCityCinemasLists']);
var city = window.localStorage.getItem('city_selected') || "北京";
var cityidSure = window.localStorage.getItem('city_select1') || 10;
var currentpage = 1;
var totalpage;
var flag2;

function GetDateStr(AddDayCount) {
	var dd = new Date();
	dd.setDate(dd.getDate() + AddDayCount);
	var y = dd.getFullYear();
	var m = dd.getMonth() + 1;
	var d = dd.getDate();
	return m + "-" + d;
};

function GetDateStr2(AddDayCount) {
	var ff = new Date();
	ff.setDate(ff.getDate() + AddDayCount);
	var y = ff.getFullYear();
	var m = ff.getMonth() + 1;
	var d = ff.getDate();
	if(m >= 10 & d < 10) {
		return y + m + "0" + d;
	} else if(m < 10 & d >= 10) {
		return y + "0" + m + d;
	} else if(m > 10 & d > 10) {
		return y + m + d;
	} else {
		return y + "0" + m + "0" + d;
	}
};

function getMyDay(date) {
	var week;
	if(date.getDay() == 0) week = "日"
	if(date.getDay() == 1) week = "一"
	if(date.getDay() == 2) week = "二"
	if(date.getDay() == 3) week = "三"
	if(date.getDay() == 4) week = "四"
	if(date.getDay() == 5) week = "五"
	if(date.getDay() == 6) week = "六"
	return week;
}
var ss = new Date().getFullYear();
var w1 = getMyDay(new Date(ss + "-" + GetDateStr(3)));
$(".yyjs_Time ul li:eq(0)").text("今天" + GetDateStr(0));
$('.yyjs_Time ul li:eq(1)').text("明天" + GetDateStr(1));
$('.yyjs_Time ul li:eq(2)').text("后天" + GetDateStr(2));
$('.yyjs_Time ul li:eq(3)').text("周" + w1 + GetDateStr(3));
$(document).ready(function() {
	$(function() {
		if(!city) {
			$.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=jsonp", function() {
				window.localStorage.setItem('city_selected', remote_ip_info.city);
				$('.city_area_content').find('.city_area_selectd span:eq(0)').text(remote_ip_info.city);
				$('.city_area_content').find(".city_area_hot ul:contains(" + remote_ip_info.city + ")").trigger("click");
			});
		} else {
			$(".gparea_city").text(city);
			listshow(cityidSure);
		};
	});
});

function getCitylists() {
	client1.getCityLists(function(result) {
		var result = $.parseJSON(result);
		if(result.res == 1) {
			var rdhl = result.data.hot.length;
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

function listshow(cityidSure, currentpage) {
	var cityidSure = window.localStorage.getItem('city_select1');
	var html2 = "";
	client1.getCityCinemasLists2({
		"city_id": cityidSure,
		"page": currentpage
	}, function(result) {
		var result = $.parseJSON(result);
		totalpage = result.data.common.totalPage;
		$.hidePreloader();
		var data_length = result.data.info.length;
		for(var i = 0; i < data_length; i++) {
			if(result.data.info[i].discount_des == "") {
				$('.yyjs_sale').hide();
				result.data.info[i].discount_des = "";
			}
			html2 += "<li index='" + result.data.info[i].id + "'><div class='yyjs_yyname'>" + "<p>" + result.data.info[i].name + "</p></div>" + "<div class='yyjs_pjdz gpa_yyjs_pjdz'>" + "<p>￥" + result.data.info[i].cinema_ticket_min_price + "起</p>" + "<p></p></div>" + "<div class='yyjs_address'>" + "<p>" + result.data.info[i].addr + "</p></div>" + "<div class='yyjs_sale'>" + "<div class='yyjs_address'></div></li>";
		};
		$('.yyjs_xx ul').append(html2);
	});
};

function gundongloading(cityidSure) {
	var loading = false;

	function addItems() {
		client1.getCityCinemasLists2({
			"city_id": cityidSure,
			"page": currentpage
		}, function(result) {
			var result = $.parseJSON(result);
			var html = '';
			for(var i = 0; i < result.data.info.length; i++) {
				html += "<li index='" + result.data.info[i].id + "'><div class='yyjs_yyname'>" + "<p>" + result.data.info[i].name + "</p></div>" + "<div class='yyjs_pjdz gpa_yyjs_pjdz'>" + "<p>￥" + result.data.info[i].cinema_ticket_min_price + "起</p>" + "<p></p></div>" + "<div class='yyjs_address'>" + "<p>" + result.data.info[i].addr + "</p></div><div class='yyjs_sale'><div class='yyjs_address'></div></li>";
			};
			$('.list-container').append(html);
		});
	};
	addItems();
	$(document).on('infinite', '.infinite-scroll', function() {
		if(loading) return;
		loading = true;
		setTimeout(function() {
			loading = false;
			if(currentpage >= totalpage) {
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').remove();
				return;
			}
			currentpage++;
			addItems(currentpage);
		}, 500);
	});
};
client1.getCityCinemasLists({
	"city_id": cityidSure
}, function(result) {
	var result = $.parseJSON(result);
	var mJson = result.data.info;
	$("#sousuo-input").bind('input propertychange', function() {
		var name = $("#sousuo-input").val();
		$("#ss-shanchu").show();
		$("#sousuo-input").keydown(function(e) {
			$(".yyjs_xx ul").empty();
			if(e.which === 8 && $('.yyjs_xx ul li').text() == "") {
				$(".preloader").hide();
				$(".yyjs_xx ul").css('margin-top', '0');
				listshow(cityidSure);
			} else {
				$(".yyjs_xx ul").css('margin-top', '6rem');
			}
			if(e.which === 13) {
				e.preventDefault();
				$.each(mJson, function(a, b) {
					if(b.name.indexOf(name) != -1 && name && $(".yyjs_yyname p").text().indexOf(b.name) == -1) {
						$(".yyjs_xx ul img").hide();
						$(".yyjs_xx ul").css('margin-top', '0');
						$(".yyjs_xx ul").append("<li index='" + b.id + "'><div class='yyjs_yyname'>" + "<p>" + b.name + "</p></div>" + "<div class='yyjs_pjdz gpa_yyjs_pjdz'>" + "<p>￥" + b.cinema_ticket_min_price + "起</p>" + "<p></p></div>" + "<div class='yyjs_address'>" + "<p>" + b.addr + "</p></div>" + "<div class='yyjs_sale'>" + "<div class='yyjs_address'>" + "<p class='cinema_zuijin_paiqi'>最近场次</p>" + "</div></li>");
					} else {
						$(".yyjs_xx ul").css('margin-top', '6rem');
					}
				})
			}
		});
		$("#ss-shanchu").click(function() {
			$("#sousuo-input").val("");
			$(".yyjs_xx ul").empty();
			$(".yyjs_xx ul").addClass('list-container');
			$(".preloader").show();
			$(".yyjs_xx ul").css('margin-top', '0');
			listshow(cityidSure);
			gundongloading();
		});
		if($('#sousuo-input').val() == "" && $('.yyjs_xx ul li').text() == "") {
			$(".yyjs_xx ul").addClass('list-container');
			$(".preloader").show();
			$(".yyjs_xx ul").css('margin-top', '0');
			listshow(cityidSure);
			gundongloading();
		};
		$.each(mJson, function(a, b) {
			if(b.name.indexOf(name) != -1 && name && $(".yyjs_yyname p").text().indexOf(b.name) == -1) {
				$(".yyjs_xx ul").css('margin-top', '0');
				$(".preloader").hide();
				$(".yyjs_xx ul").removeClass('list-container');
				$(".yyjs_xx ul").append("<li index='" + b.id + "'><div class='yyjs_yyname'>" + "<p>" + b.name + "</p></div>" + "<div class='yyjs_pjdz gpa_yyjs_pjdz'>" + "<p>￥" + b.cinema_ticket_min_price + "起</p>" + "<p></p></div>" + "<div class='yyjs_address'>" + "<p>" + b.addr + "</p></div>" + "<div class='yyjs_sale'>" + "<div class='yyjs_address'>" + "<p class='cinema_zuijin_paiqi'>最近场次</p>" + "</div></li>");
			}
		});
	});
});
$(".city_area_content").on("click", "li", function() {
	currentpage = 1;
	Areaid = $(this).attr("index");
	Areatext = $(this).text();
	window.localStorage.setItem('city_select1', Areaid);
	window.localStorage.setItem('city_selected', Areatext);
	cityidSure = window.localStorage.getItem('city_select1')
	$('.yyjs_xy ul').empty();
	$('.gp_citypicker').hide();
	$('.tab_box').show();
	$('.yyjs_Time').show();
	$('.gp_box_title').show();
	$(".gparea_city").text(Areatext);
	Areaid = parseInt(Areaid);
	document.location.reload();;
});
//gundongloading(cityidSure);

function GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	};
	return theRequest;
};
var Request = undefined;
Request = GetRequest();
var thismovie_id = Request["id"];
thismovie_id = parseInt(thismovie_id);
$(document).on("click", ".yyjs_xx ul li", function() {
	var thisCinema_id = $(this).attr('index');
	//点击li跳转
	window.location.href = "./theater-tickets.html?id=" + thisCinema_id + "&movie=" + thismovie_id;
});
$(".gp_box_title_left").click(function() {
	$(".gp_box_title_right").css({
		'color': '',
		'border-bottom': 'none'
	});
	$(".yyjs_Time").show();
	$(".tab_box").show();
	$(".gpa_ppsx").hide();
});
$('.gp_box_title_right').click(function() {
	$(".gp_box_title_right").css({
		'color': 'red',
		'border-bottom': '1px solid red'
	});
	$(".gp_box_title_left").css({
		'color': '',
		'border-bottom': 'none'
	});
	$(".gp_box_list2").hide();
	$(".gp_box_list1").show();
	$(".gpa_area").hide();
	$(".gpa_ppsx").show();
	$(".yyjs_Time").hide();
	$(".tab_box").hide();
	$('.gpa_ppsx_txyy_right ul').html("");
});
$('.gpa_ppsx_title_right').click(function() {
	$('.gpa_ppsx').hide();
	$('.yyjs_Time').show();
	$('.tab_box').show();
});
$('.cta_close').click(function() {
	$('.gp_citypicker').hide();
	$('.yyjs_Time').show();
	$('.gp_box_list1').show();
	$('.gp_box_title').show();
	$('.tab_box').show();
});
$('.yyjs_Time ul li').click(function() {
	$('.yyjs_Time ul li').css('color', '');
	$('.yyjs_Time ul li').removeClass('yy_time_on');
	$(this).css('color', 'red');
	$(this).addClass('yy_time_on')
	var index = $(this).index();
	$(".tab_box > div").eq(index).show().siblings().hide();
});
$('.gp_openAddress,.gparea_city').click(function() {
	$('.gpa_ppsx').hide();
	$('.gp_citypicker').show();
	$('.tab_box').hide();
	$('.yyjs_Time').hide();
	$('.gp_box_title').hide();
});
$.init();