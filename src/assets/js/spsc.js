var conf = 1;
var toke = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiODM4IiwidiI6MSwiaWF0IjoxNDkzMDAzMjg3fQ.PpqXb_oSU8EJVLAlwdzUBXsI67a2qAp7h5VuGf5Ly68'; //获取token
var getmovie = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/index.html&token=' + toke];
var del_movie = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/change.html'];

//获取地址参数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
var movieID = GetQueryString('id');
//axios请求跨域  公用
var header = {
	'content-type': 'application/x-www-form-urlencoded'
};
//axios处理数据转换格式  公用
function transformRequest(data) {
	var ret = '';
	for(var it in data) {
		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	};
	return ret;
};

// --子项复选框被单击---
function ChkSonClick(sonName, cbAllId) {
	var arrSon = $(sonName)
	//console.log(arrSon.length);
	var cbAll = document.getElementById(cbAllId);
	for(var i = 0; i < arrSon.length; i++) {
		if(!arrSon[i].checked) {
			cbAll.checked = false;
			return;
		}
	}
	cbAll.checked = true;
}

function clIput(id) {
	$(id).each(function(event, index) {
		ChkSonClick($(this), 'chkAll');
	});
}

function getmovielist() {
	$.ajax({       
		type: "GET",
		       async: false,
		       url: getmovie[conf], //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
		       cache: false, //默认值true
		       dataType :   'json',
		data: {
			token: token()
		},
		        // jsonp: "jsoncallback",
		              //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
		            //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
		       success: function(json) {           
			dataList = json;
			console.log(dataList);
			var len_movie = $(".pr_content li").length;
			if(len_movie > "1" || dataList.res == "1") {
				$("#bfjl-qs").hide();
				//               window.location.href = "./scbj.html";
			} else if(dataList.res == "0" || len_movie == "0") {
				$('.pr_edit').hide();
				$("#bfjl-qs").show();
			}
			var app = new Vue({
				el: '#getpwd',
				data: dataList,
				methods: {
					getTitleHref: function(val) {
						return 'movie-content.html?id=' + val
					}
				}
			});       
		},
		       error: function() { }   
	});
}


$(function() {
	/*绑定数据*/
	//商品
	getmovielist();
	//单选
	$("#getpwd input[name='my-radio']").on("click", function(event) {
		clIput(".active input[name='my-radio']");
		var del_num = $("#getpwd .active input[name='my-radio']:checked").length;
		$(".del_num").text(del_num);
	});
	//全选
	var isCheckAll = false;
	$("#chkAll").on("click", function() {
		if(isCheckAll) {
			$("input[type='checkbox']").each(function() {
				this.checked = false;
			});
			isCheckAll = false;
			$(".del_num").text("0");
		} else {
			$("input[type='checkbox']").each(function() {
				this.checked = true;
			});
			isCheckAll = true;
			$(".del_num").text($(".active input[name='my-radio']:checked").length);
		}
	});

	//多选删除
	$(".moviedel").on("click", function() {
		var checkList = '';
		$("#getpwd .active input[name='my-radio']:checked").each(function(i, v) {
			//          debugger;
			if(checkList == '') {
				checkList = $(v).attr('id');
			} else {
				checkList += ',' + $(v).attr('id');
			}
		});

		$.ajax({
			type: "GET",
			url: del_movie[conf],
			traditional: true,
			data: {
				id: checkList,
				token: token()
			},
			cache: false, //默认值true
			        //dataType :   'jsonp',
			          // jsonp: "jsoncallback",
			success: function(data) {

				var p_checked = $(".lqMovies input[name='my-radio']:checked");
				if(p_checked.length > 0) {
					layer.open({
						content: '取消收藏成功',
						skin: 'msg',
						time: 2
					});
					p_checked.parent().parent().remove();
					getmovielist();

				} else {
					layer.open({
						content: '请选择取消的收藏',
						skin: 'msg',
						time: 2
					});
					$("del_num").text("0");
				}

			},
			error: function(data) {
				layer.open({
					content: '取消收藏失败',
					skin: 'msg',
					time: 2
				});
			}
		})

	});

	/*$(".tabs").on("click", ".cancelCollect", function(event) {
		del_obj = $(event.currentTarget).parent().parent().parent();
		var cancel_goodli = $(del_obj.parent()).find("li").length;
		var cancel_shopli = $(del_obj.parent().parent().parent()).find("li").length;
			cancel_good(del_obj);
			if(cancel_goodli > "1") {
				$("#good").show();
				//$(".no-shop").hide();
			} else if(cancel_goodli == "1") {
				$("#good").hide();
				$(".no-good").removeClass("hidden");
			}
	})*/

	//初始化时加载收藏视频

	//加载时显示有无收藏视频
	if($(".pr_content li").length == 0) {
		$("#bfjl-qs").show();
		$(".pr_edit").hide();
		$(".no-shop").hide();
		$(".foot-all").hide();
		$(".complete").hide();
	}

	//编辑
	$(".pr_edit").on("click", function() {
		$(".pr_edit").hide();
		$(".complete").show();
		$(".foot-all").show();
		$(".media").show();
		$(".del_num").text("0");
		$("input[type='checkbox']").prop("checked", false);
		//添加效果
		$(".lqMovies .item-inner").addClass("item-inner-p");
		$(".foot-all .foot-btn").addClass("slideInUp");
		$(".foot-all .foot-btn").removeClass("slideOutDown");
		$(".foot-all .foot-btn").addClass("animated");
		$(".lqMovies").show();
	});
	//点击标签页切换

	//完成
	$(".complete").on("click", function() {
		$(".pr_edit").show();
		$(".complete").hide();
		$(".foot-all").hide();
			//移除效果
			$("#tab1 .item-inner").removeClass("item-inner-p");
			$(".foot-all .foot-btn").addClass("slideOutDown");
			$(".foot-all .foot-btn").removeClass("slideInUp");
			$(".foot-all .foot-btn").addClass("animated");
			$("#tab1 .cancelCollect").show();
	});
})