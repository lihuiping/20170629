var conf = 1;
var toke = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbiI6ZmFsc2UsImNsYWltcyI6bnVsbCwidWlkIjoiODM4IiwidiI6MSwiaWF0IjoxNDkzMDAzMjg3fQ.PpqXb_oSU8EJVLAlwdzUBXsI67a2qAp7h5VuGf5Ly68'; //获取token
var tuijian_list = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Recommend/index&token=' + toke]; //banner
var content_movie = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/videoInfo/index&token=' + toke];
var add_collection = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/change.html'];
var get_collection = ['./assets/data/banner.json', baseUrl() + 'tv/index.php?s=/Api/Favor/check.html'];

//获取地址参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
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
    for (var it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    };
    return ret;
};

alert(11);

