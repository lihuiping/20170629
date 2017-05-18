//请求跨域
var header = { 'content-type': 'application/x-www-form-urlencoded' }

//1、用户收货地址  参考address.js文件

//2、商品信息
function getgoods() {
	var params = new URLSearchParams();
	params.append('attr', 24); //购物车id
	axios.post('http://v.zy7c.com/index.php?r=cart&m=index', params, { headers: header }).then(function(response) {
		var res = response.data;
		if(res.res == 1) {
		} else {
			data = res.data
			if(data == -1) {
				console.log('未获得购物车id');
			} else {
				console.log('未查询到该商品的信息');
			}
		}

	});
}
/*
 返回值说明：
res:1		查询成功
res:0		data：0	未查到商品信息
res:0		data：-1	未选商品
 
 */

/*
goods_id   商品id
uid        用户id
number     数量
price      商品的价格
shipping   物流
attr	   商品属性
attrstr    商品属性文字     
add_time   添加时间
update_time修改时间
status		状态
shopid		商品所属店铺id
 */

//3、配送方式(待定)

//4、优惠券   

var url = "http://v.zy7c.com/index.php?";
/**
 *店铺优惠券列表 
 *
 *参数 				user_id(商家ID) shop_id(店铺ID) userId(用户ID)
 *
 *返回值 	
 *	res				状态值	1代表成功0代失败
	msg				提示语句	

	data 			返回数据

 *	id				优惠券自增ID	领券时用到
	title			优惠券标题	
	price			抵消金额	
	start_time		开始时间	
	end_time		结束时间	
	condition_price	优惠券限制金额	
	type			优惠券类型	1为平台优惠券 2为店铺优惠券
	is_get          判断当前用户有没有领取过优惠券 领过is_get存在 否则不存在
	is_past         判断优惠券有没有过期 过期is_get存在 否则不存在
	status          区分是七彩币还是现金  1为七彩币 2为现金
*/
function getShopCoupon() {
	var user_id = 1;
	var shop_id = 1;
	var userId = 1;
	axios.get(
		url + 'r=Discount_coupon&m=getShopCoupon', { params: { user_id: user_id, shop_id: shop_id, userId: userId } }, { headers: header }
	).then(function(response) {
		//返回数据
		console.log(response);
	});
}
/**
 *平台优惠券列表 
 *
 *参数 				userId(用户ID)
 *
 *返回值 	
 *	res				状态值	1代表成功0代失败
	msg				提示语句	

	data 			返回数据

 *	id				优惠券自增ID	领券时用到
	title			优惠券标题	
	price			抵消金额	
	start_time		开始时间	
	end_time		结束时间	
	condition_price	优惠券限制金额	
	type			优惠券类型	1为平台优惠券 2为店铺优惠券
	is_get          判断当前用户有没有领取过优惠券 领过is_get存在 否则不存在
	is_past         判断优惠券有没有过期 过期is_get存在 否则不存在
	status          区分是七彩币还是现金  1为七彩币 2为现金
*/
function getAdminCoupon() {
	var userId = 1;
	axios.get(
		url + 'r=Discount_coupon&m=getAdminCoupon', { params: { userId: userId } }, { headers: header }
	).then(function(response) {
		//返回数据
		console.log(response);
	});
}
/**
 *用户领取优惠券
 *
 *参数 				user_id(用户id) discount_coupon_id(优惠券id)
 *
 *返回值 	
 *	res				状态值	1代表成功0代失败
	msg				提示语句	

	data 			空值
*/
function addUserCoupon() {
	var user_id = 1;
	var discount_coupon_id = 1;
	var params = new URLSearchParams();
	params.append('user_id', user_id);
	params.append('discount_coupon_id', discount_coupon_id);
	axios.post(
		url + 'r=User_discount_coupon&m=addUserCoupon',
		params, { headers: header }
	).then(function(response) {
		if(response.data.res == 1) {
			layer.open({
				content: '成功领取优惠券',
				skin: 'msg',
				time: 2
			});
		} else {
			layer.open({
				content: response.data.data,
				skin: 'msg',
				time: 2
			});
		}
	})
}