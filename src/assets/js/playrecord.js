var conf = 1;
var toke = token();
//var toke = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiMTI5NCIsInYiOjEsImlhdCI6MTQ5NTc5MDA1OH0.T8cESgLZa9eX5TcErXNgMHb93xuHs9IGVsqubfpoJK4'; //获取token
var movie_record = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Movie/playRecordList&token=' + toke];
var del_movierecord = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Movie/playRecorddestroy&token=' + toke];
var change_movierecord = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Movie/playRecord&token=' + toke];
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

function getrecordList() {
	$.ajax({       
		type: "GET",
		       async: false,
		       url: movie_record[conf], //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
		       cache: false, //默认值true
		       dataType :   'json',
		success: function(json) {           
			dataList = json;
//			console.log(dataList);
			//			console.log(dataList.data.length);
			var len_movierecord = $(".lqMovierecord li").length;

			if(dataList.res == "1") {
				if(dataList.data.length == "0") {
					$('.pr_edit').hide();
					$('#lqShowList').hide();
					$("#bfjl-qs").show();
				} else {
					$('#lqShowList').show();
					$('#lqShowList').css('display', 'block');
					$('.pr_edit').show();
					$("#bfjl-qs").hide();
				}
			} else {
				$("#bfjl-qs").show();
				$('#lqShowList').hide();
			}

			var app = new Vue({
				el: '#lqShowList',
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
	//加载时显示有无视频记录
	if($(".pr_content li").length == 0) {
		$("#bfjl-qs").show();
		$(".pr_edit").hide();
		$(".no-shop").hide();
		$(".foot-all").hide();
		$(".complete").hide();
	}
	//播放记录
	getrecordList();
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
			$('.lqSelcet h6').text('全选').css('color', '#ff8c24');
			$('.moviedel a').css('color', '#383838');
			isCheckAll = false;
			$(".del_num").text("0");
		} else {
			$("input[type='checkbox']").each(function() {
				this.checked = true;
			});
			$('.lqSelcet h6').text('取消全选').css('color', '#383838');
			$('.moviedel a').css('color', '#ff8c24');
			isCheckAll = true;
			$(".del_num").text($("input[name='my-radio']:checked").length);
		}
	});
	//编辑
	$(".pr_edit").on("click", function() {
		$(".pr_edit").hide();
		$('.pr_li_play').hide();
		$(".foot-all").show();
		$(".media").show();
		$(".del_num").text("0");
		$("input[type='checkbox']").prop("checked", false);
		//添加效果
		$(".lqMovierecord .item-inner").addClass("item-inner-p");
		$(".foot-all .foot-btn").addClass("slideInUp");
		$(".foot-all .foot-btn").removeClass("slideOutDown");
		$(".foot-all .foot-btn").addClass("animated");
		$(".lqMovierecord").show();
	});
});

function recorddel() {
	var checkList = '';
	$(".lqMovierecord input[name='my-radio']:checked").each(function(i, v) {
		if(checkList == '') {
			checkList = $(v).attr('id');
		} else {
			checkList += ',' + $(v).attr('id');
		}
	});
	//	console.log(checkList);
	var p_checked = $(".lqMovierecord input[name='my-radio']:checked");
	var len_movierecord = $(".lqMovierecord li").length;
	if(p_checked.length > 0) {
		layer.open({
			content: '此操作将删除播放记录,该操作不可恢复是否继续？',
			btn: ['确定', '取消'],
			yes: function(index) {
				/*p_checked.parent().parent().remove();
				var del_num = $(".lqMovierecord input[name='my-radio']:checked").length;
				$(".del_num").text(del_num);
				layer.close(index);*/
				$.ajax({
					type: "GET",
					async: false,
					url: del_movierecord[conf],
					traditional: true,
					cache: false, //默认值true
					data: {
						ids: checkList,
					},
					cache: false, //默认值true
					        //dataType :   'jsonp',
					          // jsonp: "jsoncallback",
					success: function(data) {
						p_checked.parent().parent().remove();
						var del_num = $(".lqMovierecord input[name='my-radio']:checked").length;
						$(".del_num").text(del_num);
						layer.close(index);

						var len = $(".lqMovierecord li").length;
//						console.log(len);
						if(len == 0) {
							$('.pr_edit').hide();
							$('#lqShowList').hide();
							$("#bfjl-qs").show();
						}
					},

					error: function(data) {
						layer.open({
							content: '删除失败',
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
		$('.layui-m-layerbtn span[no]').addClass("cancel");
		$('.layui-m-layerbtn span[yes]').addClass("sure");
	} else {
		layer.open({
			content: '请选择删除的记录',
			skin: 'msg',
			time: 2
		});
		$("del_num").text("0");
	}

}

$.init();