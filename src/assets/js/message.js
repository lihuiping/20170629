var conf = 1;
var toke = token();	
//var toke = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiODM4IiwidiI6MSwiaWF0IjoxNDkzMDAzMjg3fQ.PpqXb_oSU8EJVLAlwdzUBXsI67a2qAp7h5VuGf5Ly68'; //获取token
var get_sysmessage = ['', baseUrl() + 'member.php?r=Notice_log&m=readAndNoReadNum&token=' + toke];
var show_sysmessage = ['',baseUrl() + 'member.php?r=Notice_log&m=myMessage&token=' + toke]
var get_commessage = ['',baseUrl() + 'tv/index.php?s=/api/message/index.html&token=' + toke];
var unread_commessage = ['',baseUrl() + 'tv/index.php?s=/api/message/count.html&token=' + toke];
var haveread_commessage = ['',baseUrl() + 'tv/index.php?s=/api/message/del.html&token=' + toke];
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

//系统消息页面数据
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
//				console.log(data);
			});
		},
	}
});
//系统消息显示有无
var xiaoxi = new Vue({
	el:"#xitxx-page",
	data: {
		sysmessages: []
	},
	mounted: function() {
		var _this = this;
		_this.showXiaoxi();
		//初始化加载数据
		setInterval(function(){
			_this.showXiaoxi();
		},3000);
	},
	methods: {
		showXiaoxi: function(){
			var _this = this;
			axios.get(get_sysmessage[conf]).then(function(response) {
				var dataMessages = response.data.data;
				xiaoxi.sysmessages = dataMessages;
//				console.log(dataMessages.noRead);
			});
			
		},
	}
});
/*window.onbeforeunload=function (){
	alert("123");
	if(event.clientX>document.body.clientWidth && event.clientY < 0 || event.altKey){
	     alert("你关闭了浏览器");
	}else{
	     alert("你正在刷新页面");
	}
}*/

//评论点赞页面数据
var comMessage = new Vue({
	el:"#comMessage",
	data: {
		commessage: [],
		commessages:[],
		hasreadmessage : []
	},
	mounted: function() {
		//初始化加载数据
		this.getcomMessage();
		this.hasreadMessage();
	},
	methods : {
		getcomMessage : function(){
			var _this = this;
			axios.get(get_commessage[conf]).then(function(response) {
//				console.log(response.data);
				var datacomMessage = response.data.data;
				comMessage.commessage = datacomMessage;
				comMessage.commessages = response.data;
//				console.log(datacomMessage);
			});
		},
		hasreadMessage : function(){
			var _this = this;
			axios.get(haveread_commessage[conf]).then(function(response){
				var datareadMessage = response.data;
				comMessage.hasreadmessage = datareadMessage;
				console.log(datareadMessage);
			});
		},
	}
});

//评论/赞消息显示有无
var pinglunxiaoxi = new Vue({
	el:"#pinglz-page",
	data: {
		pmessages: []
	},
	mounted: function() {
		var _this = this;
		_this.showXiaoxi();
		//初始化加载数据
		setInterval(function(){
			_this.showXiaoxi();
		},3000);
	},
	methods: {
		showXiaoxi: function(){
			var _this = this;
			axios.get(unread_commessage[conf]).then(function(response) {
				var dataMessages = response.data;
				pinglunxiaoxi.pmessages = dataMessages;
			});
			
		},
	}
});
$.init();
