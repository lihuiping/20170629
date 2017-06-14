var conf = 1;
var toke = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiMTI5NCIsInYiOjEsImlhdCI6MTQ5NTc5MDA1OH0.T8cESgLZa9eX5TcErXNgMHb93xuHs9IGVsqubfpoJK4'; //获取token
var movie_record = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Movie/playRecordList&token=' + toke];
var del_movierecord = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Movie/playRecorddestroy&token=' + toke];
var change_movierecord =  ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Movie/playRecord&token=' + toke];
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

function getrecordList(){
	$.ajax({       
		type: "GET",
		       async: false,
		       url: movie_record[conf], //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
		       cache: false, //默认值true
		       dataType :   'json',
//		data: {
//								token: token()
//		},
		success: function(json) {           
			dataList = json;
			console.log(dataList);
			var len_movierecord = $(".lqMovierecord li").length;
//			if(dataList.res == '1'){
//				
//			}
			if(len_movierecord > "1" || dataList.res == "1") {
				$("#bfjl-qs").hide();
				//               window.location.href = "./scbj.html";
			} else if(dataList.res == "0" || len_movierecord == "0") {
				$('.pr_edit').hide();
				$("#bfjl-qs").show();
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
	
	/*$(document).on('click', '#pr_selectAll', function() {
		nb = $('.pr_wj_content1 ul li').length;
		if($(".lqSelcet h6").text() == "全选") {
			$(".my-select").each(function(dom) {
				idarr.push($(".my-select")[dom].getAttribute("videoid"));
			});
			$("#pr_selectAll").html('取消全选');
			$("#pr_delete").addClass('prde_bgchange');
			$(".my-select").addClass("bg-myse");
			$(".my-select").attr("checked", !$(this).attr("checked"));
			$("#pr_selectAll").removeClass("prse_bgchange");
			$("#pr_selectAll").removeClass("prde_bgchange");
			$('.del_num').text(nb);
			na = nb;
		} else {
			idarr = [];
			$("#pr_selectAll").html('全选');
			$("#pr_delete").removeClass('prde_bgchange');
			$(".my-select").removeClass("bg-myse");
			$(".my-select").attr("checked", false);
			$("#pr_selectAll").addClass("prse_bgchange");
			$('.del_num').text(0);
			na = 0;
		}
		$("#pr_selectAll").toggleClass("prse_bgchange");
	});*/

	//加载时显示有无视频记录
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
	var p_checked = $(".lqMovierecord input[name='my-radio']:checked");
	if(p_checked.length > 0) {
		layer.open({
			content: '此操作将删除所有播放记录,该操作不可恢复是否继续？',
			btn: ['确定', '取消'],
			no: function() {
				return false;
			},
			yes: function(index) {

				//console.log(p_checked.length);

				p_checked.parent().parent().remove();
				var del_num = $(".lqMovierecord input[name='my-radio']:checked").length;
				$(".del_num").text(del_num);
				layer.close(index);
				$.ajax({
					type: "GET",
					url: del_movierecord[conf],
					traditional: true,
					data: {
						ids: checkList,
						token: token()
					},
					cache: false, //默认值true
					        //dataType :   'jsonp',
					          // jsonp: "jsoncallback",
					success: function(data) {
						window.location.reload(); 
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
		//					$('.layui-m-layerbtn span[no]').addClass("cancel");
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