var conf = 0; //控制服务    0：调用前端假数据   1：调用后台真实数据
var srvMap = (function(){
	
	var srcPref = ["./","../../../"];
	//var srcPref = ["",""];//生产
	//var srcPref = ["",""];//准生产
	//var srcPref = ["",""];//测试
	
    var dataArray = [
         {
            "query":srcPref[conf]+"query.json"
         },
         {
            "query":srcPref[conf]+"front/pc/pcprnca!query"
         }
    ];
    return {
        add: function(uid, mockSrc, srvSrc) {
            dataArray[0][uid] = srcPref[conf] + mockSrc;
            dataArray[1][uid] = srcPref[conf] + srvSrc;         
        },
        get: function(uid) {
            return dataArray[conf][uid];
        },
		getName: function(url){
			var map = dataArray[conf];
			var name = null;
			for(var uid in map){
				if(map[uid] == url){
					name = uid;
					break;
				}
			}
			return name;
		},
        getAppPath:function(){
        	return srcPref[conf];
        },
        dataArrays:function(){
            return dataArray[conf];
        }
    };
})(jQuery);
window.dataArray = srvMap.dataArrays();