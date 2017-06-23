var conf = 1;
var toke = token();
//var toke = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiODM4IiwidiI6MSwiaWF0IjoxNDkzMDAzMjg3fQ.PpqXb_oSU8EJVLAlwdzUBXsI67a2qAp7h5VuGf5Ly68'; //获取token
var getmovie = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/index.html&token=' + toke];
var del_movie = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/delete.html'];

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
			//					token: token()
		},
		        // jsonp: "jsoncallback",
		              //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
		            //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
				       
		success: function(json) {           
			dataList = json;
//			console.log(dataList.data);
			var len_movie = $(".lqMovies li").length;
			if(len_movie > "1" || dataList.res == "1") {
				$("#bfjl-qs").hide();
				$('#getpwd').show();
				//               window.location.href = "./scbj.html";
			} else if(dataList.res == "0" || len_movie == "0") {
				$('.pr_edit').hide();
				$('#getpwd').show();
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
	$("input[name='my-radio']").on("click", function(event) {
		clIput("input[name='my-radio']");
		var del_num = $("input[name='my-radio']:checked").length;
		$(".del_num").text(del_num);
	});
	//全选
	var isCheckAll = false;
	$("#chkAll").on("click", function() {
		if(isCheckAll) {
			$("input[type='checkbox']").each(function() {
				this.checked = false;
			});
			$('.lqSelcet h6').text('全选').css('color','#ff8c24');
			$('.moviedel a').css('color','#383838');
			isCheckAll = false;
			$(".del_num").text("0");
		} else {
			$("input[type='checkbox']").each(function() {
				this.checked = true;
			});
			$('.lqSelcet h6').text('取消全选').css('color','#383838');
			$('.moviedel a').css('color','#ff8c24');
			isCheckAll = true;
			$(".del_num").text($("input[name='my-radio']:checked").length);
		}
	});
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
});

function moviedel() {
	var checkList = '';
	$(".lqMovies input[name='my-radio']:checked").each(function(i, v) {
		if(checkList == '') {
			checkList = $(v).attr('id');
		} else {
			checkList += ',' + $(v).attr('id');
		}
		
	});
//	console.log(checkList);
	var p_checked = $(".lqMovies input[name='my-radio']:checked");
	if(p_checked.length > 0) {
		layer.open({
			content: '此操作将删除收藏,该操作不可恢复是否继续？',
			btn: ['确定', '取消'],
			no: function() {
				return false;
			},
			yes: function(index) {

				//console.log(p_checked.length);

				p_checked.parent().parent().remove();
				var del_num = $(".lqMovies input[name='my-radio']:checked").length;
				$(".del_num").text(del_num);
				layer.close(index);
				$.ajax({
					type: "GET",
					url: del_movie[conf],
					traditional: true,
					data: {
						mid: checkList,
						token: token()
					},
					cache: false, //默认值true
					        //dataType :   'jsonp',
					          // jsonp: "jsoncallback",
					success: function(data) {
//						console.log(data)
						if(data.res == "1" || data.msg == "取消收藏成功") {
							$('#getpwd').hide();
//							$('#getpwd').show();
							$("#bfjl-qs").show();
						}
//						window.location.reload(); 
					},
					error: function(data) {
						layer.open({
							content: '取消收藏失败',
							skin: 'msg',
							time: 2
						});
					}
				})

			}

		});
		//动态加载弹框样式
		$('.layui-m-anim-scale').addClass("popupTitleBox");
		$('.layui-m-layerbtn').addClass("popupBottom");
		$('.layui-m-layercont').addClass("popupTitle");
		//					$('.layui-m-layerbtn span[no]').addClass("cancel");
		$('.layui-m-layerbtn span[yes]').addClass("sure");
	} else {
		layer.open({
			content: '请选择取消的收藏',
			skin: 'msg',
			time: 2
		});
		$("del_num").text("0");
	}

}