/*优惠券模块 --张连昌*/

var url = "http://v.zy7c.com/index.php?";
var header = {'content-type':'application/x-www-form-urlencoded'};//解决跨域问题

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
	is_get          判断当前用户有没有领取过优惠券 领过is_get存在 否则不存在
	is_past         判断优惠券有没有过期 过期is_get存在 否则不存在
	status          区分是七彩币还是现金  1为七彩币 2为现金
	time            有效期至
*/
function getShopCoupon(){
	var user_id = 1;
	var shop_id = 1;
	var userId =1;
	axios.get(
		url+'r=Discount_coupon&m=getShopCoupon',
		{params:{user_id:user_id,shop_id:shop_id,userId:userId}},
		{headers:header}
	).then(function(response){
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
	is_get          判断当前用户有没有领取过优惠券 领过is_get存在 否则不存在
	is_past         判断优惠券有没有过期 过期is_get存在 否则不存在
	status          区分是七彩币还是现金  1为七彩币 2为现金
	time            有效期至
*/
function getAdminCoupon(){
	var userId =1;
	axios.get(
		url+'r=Discount_coupon&m=getAdminCoupon',
		{params:{userId:userId}},
		{headers:header}
	).then(function(response){
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
function addUserCoupon(){
	var user_id =1;
	var discount_coupon_id = 1;
	var params = new URLSearchParams();
	params.append('user_id',user_id );
	params.append('discount_coupon_id',discount_coupon_id);
	axios.post(
		url+'r=User_discount_coupon&m=addUserCoupon',
		params,
		{headers:header}
	).then(function (response) {
		if(response.data.res == 1){
			layer.open({
		         content: '成功领取优惠券',
		         skin: 'msg',
		         time: 2
            });
		}else{
			layer.open({
	             content: response.data.data,
	             skin: 'msg',
	             time: 2
            });
		}
	})
}
/*
	user_id 用户ID shop_id 店铺ID condition_price 总金额 status状态值 1.七彩币2.现金
	返回值
	data 
		shopCoupon 店铺优惠券（没有时为空数组）
			discount_coupon_id 优惠券ID
			price 抵消金额（七彩币）
		adminCoupon 平台优惠券（没有时为空数组）
			discount_coupon_id 优惠券ID
			price 抵消金额（七彩币）
 */
function getOrderCoupon(){
	var user_id =1;
	var shop_id =1;
	var condition_price =300;
	var status =1;
	axios.get(
		url+'r=User_discount_coupon&m=getOrderCoupon',
		{params:{user_id:user_id,shop_id:shop_id,condition_price:condition_price,status:status}},
		{headers:header}
	).then(function(response){
		//返回数据
		console.log(response); 
  	});
}
