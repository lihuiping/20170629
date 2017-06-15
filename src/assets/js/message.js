var conf = 1;
var toke = token();	
//var toke = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiODM4IiwidiI6MSwiaWF0IjoxNDkzMDAzMjg3fQ.PpqXb_oSU8EJVLAlwdzUBXsI67a2qAp7h5VuGf5Ly68'; //获取token
var get_sysmessage = ['./assets/data/banner.json', baseUrl() + 'member.php?r=Notice_log&m=readAndNoReadNum&token=' + toke];
var show_sysmessage = ['',baseUrl() + 'member.php?r=Notice_log&m=myMessage&token=' + toke]
//var del_movie = ['./assets/data/banner.json', baseUrl() + 'member.php?r=Notice_log&m=myMessage'];

//获取地址参数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
var messageID = GetQueryString('id');

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
 
 //获取系统消息
//function getsysmessage(){
//	$.ajax({       
//		type: "GET",
//		       async: false,
//		       url: get_sysmessage[conf], //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
//		       cache: false, //默认值true
//		       dataType :   'json',
//		success: function(json) {           
//			dataList = json;
//		},
//        error: function() { }   
//	});
//}
//getsysmessage();


var sysMessage = new Vue({
	el:"#sysMessage",
	data: {
		sysmessage: [],
		allsysmessage: []
	},
	filters:{
		moment: function(value){
			return new Date(parseInt(value) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
		}
	},

	mounted: function() {
		//初始化加载数据
		this.showMessage();
	},
	methods: {
		showMessage: function(){
			var _this = this;
			axios.get(show_sysmessage[conf]).then(function(response) {
				var dataMessage = response.data;
				var data = response.data.data;
				sysMessage.sysmessage = data;
				sysMessage.allsysmessage = dataMessage;
//				var dateMessage = new Date(parseInt(data.add_time) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
			});
		}
	}
});
//Vue.filter('moment', function (value) {
//	return new Date(parseInt(value) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
//})

$.init();
