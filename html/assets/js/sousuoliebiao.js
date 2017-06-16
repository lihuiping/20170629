function noscroll() {
	var content = document.querySelector('.content');
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
noscroll();
var cityidSure = window.localStorage.getItem('city_select1') || 10;
var client = hprose.Client.create("http://test.7cai.tv/index.php/api/api/ticket", ['getOrderLists', 'login', 'getCityMoviesLists2', 'getCityWillMoviesLists2', 'getCinemaSchedInfo', 'getTicketCinemaUrl', 'register', 'getTicketCinemaUrl', 'getCityCinemasLists', 'isLogin', 'logout', 'getCityMoviesLists', 'getCinemaInfo', 'getCinemaSchedInfo', 'getCityWillMoviesLists', 'findPwd', 'getMoviesInfo', 'sendCode', 'getUserInfo', 'getMoviesInfo', 'getAddressList', 'getUploadParams', 'getPayOrderInfo', 'getOpenId', 'getCityLists', 'getCityCinemasLists']);
client.getCityMoviesLists({
	"city_id": cityidSure
}, function(result) {
	$.hidePreloader();
	var result = $.parseJSON(result);
	var rdil = result.data.info.length;
	var mJson = result.data.info;
	var u = navigator.userAgent;
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	if(isiOS) {}
	$("#sousuo-input").bind('input propertychange', function() {
		var name = $("#sousuo-input").val();
		var find = 0;
		$(".not-found-video").hide();
		$("#ss-shanchu").show();
		$("#sousuo-input").keydown(function(e) {
			if(e.which === 13) {
				e.preventDefault();
				$.each(mJson, function(a, b) {
					if(b.name.indexOf(name) != -1 && name && $(".movie-sousuo").text().indexOf(b.name) == -1) {
						$(".sousuo-list ul").append("<li><a class='external movie-sousuo' href='dyxiangqing.html?id=" + b.id + "'>" + b.name + "</a></li>");
						find = 1;
						$("#qingkongjilu").show();
					}
				})
			}
		})
		$("#ss-shanchu").click(function() {
			$("#sousuo-input").val("");
		})
		$.each(mJson, function(a, b) {
			if(b.name.indexOf(name) != -1 && name && $(".movie-sousuo").text().indexOf(b.name) == -1) {
				$(".sousuo-list ul").append("<li><a class='external movie-sousuo' href='dyxiangqing.html?id=" + b.id + "'>" + b.name + "</a></li>");
				find = 1;
				$("#qingkongjilu").show();
			}
		})
		if(find == 0) {}
	});
});
client.getCityWillMoviesLists({
	"city_id": cityidSure
}, function(result) {
	$.hidePreloader();
	var result = $.parseJSON(result);
	var rdil = result.data.info.length;
	var mJson = result.data.info;
	var u = navigator.userAgent;
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	if(isiOS) {}
	$("#sousuo-input").bind('input propertychange', function() {
		var name = $("#sousuo-input").val();
		var find = 0;
		$("#ss-shanchu").show();
		$("#sousuo-input").keydown(function(e) {
			if(e.which === 13) {
				e.preventDefault();
				$.each(mJson, function(a, b) {
					if(b.name.indexOf(name) != -1 && name && $(".movie-sousuo").text().indexOf(b.name) == -1) {
						$(".sousuo-list ul").append("<li><a class='external movie-sousuo' href='dyxiangqing.html?id=" + b.id + "'>" + b.name + "</a></li>");
						find = 1;
						$("#qingkongjilu").show();
					} else {}
				})
			}
		})
		$("#ss-shanchu").click(function() {
			$("#sousuo-input").val("");
		})
		$.each(mJson, function(a, b) {
			if(b.name.indexOf(name) != -1 && name && $(".movie-sousuo").text().indexOf(b.name) == -1) {
				$(".sousuo-list ul").append("<li><a class='external movie-sousuo' href='dyxiangqing.html?id=" + b.id + "'>" + b.name + "</a></li>");
				find = 1;
				$("#qingkongjilu").show();
			}
		})
		if(find == 0) {}
	});
});
$("#sousuo-quxiao").click(function() {
	history.go(-1);
})
$("#qingkongjilu").click(function() {
	$(".sousuo-list ul li").remove();
})