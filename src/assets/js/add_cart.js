/**
 * 描述 ： 加入购物车
 * 作者 ： 刘峰
 */

var add_cart_url = 'http://v.zy7c.com/';

$(function(){

	/**
	 * 描述 ： 加入购物车的单击事件
	 * 参数 ： goods_id (商品的id) 、 number(购买的数量) 、 attr(商品的属性id，用英文逗号分割) falg(判断是加入购物车还是立即兑换 0为加入购物车)
	 */
	$(".detail-buy").click(function(){
		var goods_id = 5;
		var number = 3;
		var attr = '1,1';
		var flag = 0;
		addCart(goods_id,number,attr,flag);
	});	

	/**
	 * 描述 ： 立即兑换
	 * 参数 ： goods_id (商品的id) 、 number(购买的数量) 、 attr(商品的属性id，用英文逗号分割) flag(判断是加入购物车还是立即兑换 1为立即兑换)
	 */
	$(".detail-change").click(function(){
		var goods_id = 5;
		var number = 3;
		var attr = '1,1';
		var flag = 1;
		addCart(goods_id,number,attr,flag);
	});
	
});

/**
 * 加入购物车  /  立即兑换 
 * @param {int} goods_id 商品的ID
 * @param {int} number   商品的购买数量
 * @param {string} attr  商品的属性
 * @param {int} flag     判断是加入购物车 还是 立即兑换
 * 返回值 ： 购物车ID ( json格式 )
 */
function addCart(goods_id,number,attr,flag) {
	//请求跨域
	var header = {'content-type': 'application/x-www-form-urlencoded'}
	//post 请求
	var params = new URLSearchParams();
	params.append('goods_id',goods_id);
	params.append('number',number);
	params.append('attr',attr);
	params.append('flag',flag);
	axios.post(
			add_cart_url+'?r=cart&m=add',
			params,
			{headers:header,async:false}
		).then(function (response) {
			var res=response.data.res;
			if(res == 1){
				if(flag == 1){
					// 这里是 立即兑换 操作之后的 页面跳转 位置 ( 跳转到订单页面 )
					alert('立即兑换');
				}
			}else{
				layer.open({
					content: '网络错误,请重试',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			}
	});
}
/**
 * 立即兑换
 * @param  {int} goods_id    商品的ID
 * @param  {int} number      商品的购买数量
 * @param  {string} attr     商品的属性
 * @param  {int} shop_coupon 商家优惠卷
 * @param  {int} coupon      平台优惠卷
 * 返回值 ： 成功 提醒 立即兑换成功
 * 			 失败 提示 网络错误，请重试
 */
// function immediateChange(goods_id,number,attr,shop_coupon,coupon) {
// 	//请求跨域
// 	var header = {'content-type': 'application/x-www-form-urlencoded'}
// 	//post 请求
// 	var params = new URLSearchParams();
// 	params.append('goods_id',goods_id);
// 	params.append('number',number);
// 	params.append('attr',attr);
// 	// params.append('shop_coupon',shop_coupon);
// 	// params.append('coupon',coupon);
// 	axios.post(
// 			// add_cart_url+'?r=cart&m=add',
// 			params,
// 			{headers:header,async:false}
// 		).then(function (response) {
// 			var res=response.data.res;
// 			if(res == 1){
// 				layer.open({
// 					content: '立即兑换成功',
// 					skin: 'msg',
// 					time: 2 //2秒后自动关闭
// 				});
// 			}else{
// 				layer.open({
// 					content: '网络错误,请重试',
// 					skin: 'msg',
// 					time: 2 //2秒后自动关闭
// 				});
// 			}
// 	});
// }