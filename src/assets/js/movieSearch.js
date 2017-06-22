function baseUrl() {
	return 'http://my.shop.7cai.tv/';
}
//进入页面刷新
var Cookie = {
	setCookie: function(name, value, option) {
		var str = name + "=" + escape(value);
		if(option) {
			if(option.expireDays) {
				var date = new Date();
				var ms = option.expireDays * 24 * 3600 * 1000;
				date.setTime(date.getTime() + ms);
				str += "; expires=" + date.toGMTString();
			}
			if(option.path) str += ";path=" + option.path;
			if(option.domain) str += ";domain=" + option.domain;
			if(option.secure) str += ";true";
		}
		document.cookie = str;
	},
	getCookie: function(name) {
		var cookies = document.cookie.split(";");
		for(var i = 0; i < cookies.length; i++) {
			var arr = cookies[i].split("=");
			if(arr[0] == name) {
				return unescape(arr[1]);
			}
		}
		return "";
	},
	delCookie: function(name) {
		this.setCookie(name, "", {
			expireDays: -1
		});
	}
}
window.onload = function() {
	if("1" == Cookie.getCookie("diffmaker")) {
		$("#sousuo-input").val("");
		//alert("找到Cookie，我将不再刷新页面，并删除Cookie");  
		Cookie.delCookie("diffmaker");
	} else {
		$("#sousuo-input").val("");
		//alert("没有找到Cookie，我将刷新页面!");  
		Cookie.setCookie("diffmaker", "1", null);
		window.location.reload(true);
	}
}

$(".not-found-video").hide();
$("#sousuo-quxiao").on("click", function() {
	window.history.go(-1);
});
var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

//搜索框输入时状态 
$("#sousuo-input").on('input', function() {
	//接受后台数据  
	var inVal = $("#sousuo-input").val();
	if(inVal != '') {
		$("#ss-shanchu").show();
		$("#ss-shanchu").click(function() {
			$("#sousuo-input").val("");
			$(".search-list a").remove();
			$(".not-found-video").hide();
			$(".search-record").show();
		})
		$.ajax({
			type: "GET",
			//						async: false,
			url: baseUrl() + 'tv/?s=/Api/movie/search/name/<![CDATA[all]>/size/10000', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
			//						cache: false, //默认值true
			dataType: 'json',
			data: {
				name: $('input[name=search]').val()
			},
			success: function(db) {
				/*if(db.res == 1) {
					$('.sousuo-list ul').html('');
					console.log(db.data.id);
					$.each(db.data, function(i, n) {
						$('.sousuo-list ul').append('<li><a href="movie-content.html?id=' + n['id'] + '">' + n['videoname'] + '--' + n['id'] + '</a></li>');
					});

					$(".clear-record").show();
					$(".not-found-video").hide();
					$("#qingkongjilu").on("click", function() {
						$(".sousuo-list ul li").remove();
					});

				}*/
				var json = db;
				var leg = db.data.length;
				var dataMsg = db.msg;
//				console.log(dataMsg);
				var inVal = $("#sousuo-input").val();
	
				if(leg !== 0 && inVal !== "") {
//					console.log(db.data);
					$(".search-list").html('<a v-for="qs in data" :data-id="qs.id" :href="getTitleHref(qs.id)"  v-cloak>{{qs.videoname}}</a>');
					var apps = new Vue({
						el: ".search-list",
						data: json,
						methods: {
							getTitleHref: function(val) {
								return 'movie-content.html?id=' + val;
							}
						}
					});
					$(".not-found-video").hide();
					$(".search-anys").hide();
				}else{
					$(".not-found-video").show();
				}
	
				if(dataMsg == '失败') {
					$(".not-found-video").show();
					$(".search-list a").hide();
				}
				if(inVal == "") { //输入框为空时重新获取数据
					hisRecord();
					$(".search-record").show();
					$(".not-found-video").hide();
					$(".search-list").empty();
					if($("#listRecord a").html() == ""){
						$("#listRecord a").css('border-top','none');
					}
				} else {
					//$(".search-list a").remove();
					$(".search-record").hide();
					//$(".search-none").show();
					$(".search-anys").hide();
				}   
			},

			error: function(status) {
				layer.open({
					content: '数据错误',
					skin: 'msg',
					time: 1 //1秒后自动关闭
				});
			}

		})
	} else {
		$(".not-found-video").hide();
		$(".search-record").show();
		$(".search-list").empty();
	}
});
//!*封装添加搜索记录功能  (newRecord:str,当参数为空时为获取历史记录; num:记录数，默认为10条;)
function addHisRecord(newRecord, num) {
	var id = window.localStorage.getItem('id');
	num = num || 10;
	//获取本地存储的记录
	var hisRecord_str = window.localStorage.getItem('hisRecord_str');

	//当获取到的值为null时，创建一个空数组存储进去
	if(typeof hisRecord_str == 'object') {
		var hisRecord = [];
		hisRecord_str = hisRecord.join('|');
		window.localStorage.setItem('hisRecord_str', hisRecord_str);
	}

	//转换为数组
	hisRecord = hisRecord_str.split('|');

	//当hisRecord_str为空字符串时，清空数组
	if(!hisRecord_str) {
		hisRecord.pop();
	}
	//当实参不为空时，判断：
	if(newRecord) {
		//1.当该数组中不存在传进来的值时，则添加新记录到首位;
		if(hisRecord.indexOf(newRecord + '&' + id) == -1) {
			hisRecord.unshift(newRecord + '&' + id);
			//当记录小于 num 条时，添加到首位，当大于等于 num 条时，添加到首位并删掉末位
			if(hisRecord.length > num) {
				hisRecord.pop();
			}
		} else {
			//2.当该数组中存在传进来的值时，则删掉对应位置的记录并添加新记录到首位;
			var indexRecord = hisRecord.indexOf(newRecord + '&' + id);
			hisRecord.splice(indexRecord, 1);
			hisRecord.unshift(newRecord + '&' + id);
		}

		//重新转换成string存储到本地
		hisRecord_str = hisRecord.join('|');
		window.localStorage.setItem('hisRecord_str', hisRecord_str);

	} else { //当实参为空时，返回获取到的历史记录，type: Array;
		return hisRecord;
	}
}

//!*封装删除搜索记录功能  (index: 0,1,2,...,'all';)
function removeHisRecord(index) {
	//获取本地存储的记录
	var hisRecord_str = window.localStorage.getItem('hisRecord_str');
	//转换为数组
	var hisRecord = hisRecord_str.split('|');
	//当hisRecord_str为空字符串时，清空数组
	if(!hisRecord_str) {
		hisRecord.pop();
	} else if(index == 'all') {
		hisRecord.splice(0, hisRecord.length);
	} else {
		hisRecord.splice(index, 1);
	}
	//将处理过的数据存储并渲染到页面
	hisRecord_str = hisRecord.join('|');
	window.localStorage.setItem('hisRecord_str', hisRecord_str);
	renderData(hisRecord, '#listRecord')
}

//!*封装字符串 id vue渲染数据
function renderData(datas, id) {
	var str = "";
	var id_data = [];
	for(i in datas) {
		var string = datas[i].split('&');
		str = str + string[0] + '|';
		id_data.push(string[1]);
	}
	var hisRecord = str.substr(0, str.length - 1);
	datas = hisRecord.split('|');

	$(id).html('<li v-for="ms in movielist" v-cloak><a @click="hrefNext(ms.id)">{{ms.videoname}}</a></li>');
	var arr = [];
	var arrs = [];
	for(i in datas) {
		var arr = {
			'videoname': datas[i],
			'id': id_data[i]
		}
		arrs.push(arr);
	}
	var _arr = [];
	for(var i in arrs) {
		_arr.push({
			"videoname": arrs[i].videoname,
			"id": arrs[i].id
		});
	}
	console.log(_arr);
	var app = new Vue({
		el: id,
		data: {
			movielist: _arr
		},
		methods: {
			hrefNext: function(obj) {
				window.location.href = 'movie-content.html?id=' + obj;
			}
		}
	})

}

//!*封装进入页面时查询并渲染搜索记录功能
function hisRecord() {
	var hisRecord = addHisRecord(); //结果为数组字符串["第一个","第二个","第三个"]

	var hisRecord_str = hisRecord.join(); //把结果转化为普通字符串 "第一个","第二个","第三个"
	//记录存在时渲染
	if(hisRecord_str) {
		renderData(hisRecord, '#listRecord');
	}
}

//封装判断搜索匹配是否点击添加数据页面显示状态
function listShow() {
	if($("#listRecord a").length > 0) {
		$(".search-anys").hide();
		$('.not-found-video').hide();
		$(".search-record").show();
	} else {
		$(".search-anys").show();
		$(".search-record").hide();
	}

}

hisRecord(); //获取点击数据
listShow();
//点击搜索结果
$('.search-list a').live('click', function() {
	var setVal = $(this).html();
	var id = $(this).attr('data-id');
	window.localStorage.setItem('id', id);
	addHisRecord(setVal);
	$("#sousuo-input").val("");
});

//点击清除
$('.clear-records').on('click', function() {
	layer.open({
		content: '确定删除全部历史纪录？',
		btn: ['确定', '取消'],
		yes: function(index) {
			removeHisRecord('all');
			listShow();
			$('.search-record').hide();
			$(".search-anys").show();
			layer.close(index);
		}
	});
	//动态加载弹框样式
	$('.layui-m-anim-scale').addClass("searchAera");
	$('.layui-m-layerbtn').addClass("searchTop");
	$('.layui-m-layercont').addClass("searchConfirm");
	$('.layui-m-layerbtn span[no]').addClass("searchCancel");
	$('.layui-m-layerbtn span[yes]').addClass("ok");

});