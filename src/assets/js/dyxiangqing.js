var client = hprose.Client.create("http://test.7cai.tv/index.php/api/api/ticket", ['getOrderLists', 'login', 'getCinemaSchedInfo', 'getTicketCinemaUrl', 'register', 'getTicketCinemaUrl', 'getCityCinemasLists', 'isLogin', 'logout', 'getCityMoviesLists', 'getCinemaInfo', 'getCinemaSchedInfo', 'getCityWillMoviesLists', 'findPwd', 'getMoviesInfo', 'sendCode', 'getUserInfo', 'getMoviesInfo', 'getAddressList', 'getUploadParams', 'getPayOrderInfo', 'getOpenId', 'getCityLists', 'getCityCinemasLists']);

function GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}
var Request = undefined;
Request = GetRequest();
var thisurl_id = Request["id"];
thisurl_id = parseInt(thisurl_id);
client.getMoviesInfo({
	"movies_id": thisurl_id
}, function(result) {
	var result = $.parseJSON(result);
	document.title = result.data.info.name;
	var dyxq_jiaohu_xinxi = "<div class='OrderDetailLeft gp_OrderDetailLeft'>" +
		"<img src='" + result.data.info.poster_url + "'>" +
		"<div class='OrderDetailLeft_des gp_OrderDetailLeft'>" +
		"<p style='margin-right:0.2rem;'>" + result.data.info.name + "<span>" + result.data.info.version.substring(0, 2) + "</span></p>" +
		"<p style='font-size:0.65rem;color:red;'>" + result.data.info.score / 10 + "分</p>" +
		"<p style='color:#909090;font-size:0.7rem;'>" + result.data.info.tags + "</p>" +
		"<p style='color:#909090; font-size:0.7rem;'>" + result.data.info.date_des + "&nbsp;&nbsp;&nbsp;&nbsp;" + result.data.info.longs + "</p>" +
		"</div></div></div>" +
		"<div class='dyxq_detail_jieshao1' style='display:none'>" +
		"&nbsp;&nbsp;" + result.data.info.detail +
		"</div>" +
		"</div>" +
		"<p class='icon icon-down dyxq_introduction' index='1' style='font-size:0.75rem;color:#ccc;'></p>"
	$('.dyxq_jiaohu').append(dyxq_jiaohu_xinxi);
	for(var i = 0; i < 4; i++) {
		$('.dyxq_juzhao ul').append('<li class="pb-standalone"><img src="' + result.data.info.still_list[i].original_url + '"/></li>');
	};
	var myPhotoBrowserStandalone = $.photoBrowser({
		photos: [result.data.info.still_list[0].display_url, result.data.info.still_list[1].display_url, result.data.info.still_list[2].display_url, result.data.info.still_list[3].display_url, ]
	});
	$(document).on('click', '.pb-standalone', function() {
		myPhotoBrowserStandalone.open();
	});
});
$(document).on("click", ".mybutton-foot", function() {
	window.location.href = "gparea.html?id=" + thisurl_id;
});
$(document).on("click", ".mybutton-foot", function() {
	window.location.href = "gparea.html?id=" + thisurl_id;
});
$(document).on("click", ".dyxq_introduction", function() {
	if($(".dyxq_introduction").attr('index') == "1") {
		$(".dyxq_detail_jieshao1").show();
		$(".dyxq_detail_jieshao2").hide();
		$(".dyxq_introduction").removeClass("icon-down");
		$(".dyxq_introduction").addClass("icon-up2");
		$(".dyxq_introduction").attr("index", "2");
	} else {
		$(".dyxq_detail_jieshao1").hide();
		$(".dyxq_introduction").removeClass("icon-up2");
		$(".dyxq_introduction").addClass("icon-down");
		$(".dyxq_introduction").css("color", "#ccc");
		$(".dyxq_introduction").attr("index", "1");
	}
});