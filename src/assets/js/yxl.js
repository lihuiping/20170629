
//请求跨域
var header = {'content-type': 'application/x-www-form-urlencoded'}

//1,商品详情(YXl)
function getgoods(){

	axios.get('http://v.zy7c.com/index.php?r=Goods&m=goods',{params:{id:1}},{headers:header}).then(function (response) {
	var res=response.data;
	if(res.res ==1){
		console.log(res);
	}else{
		data=res.data
		if(data == -1){
			console.log('未获得商品id');
		}else{
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
id   商品的id值
goods_name  商品的名称
content    商品的详解简介
imglist	   商品的轮播图
sell_price	商品的售价
goods_para		商品参数
market_price	商品的标牌价
money			电子券价格
goods_number	商品的数量
is_pass			是否审核通过  0未审核  1通过 2未通过
status			是否上架     0正常   1下架
is_hot			是否是热销  0正常   1热卖
is_top			推荐	0正常   1推荐
is_new			新品  0正常   1新品
goods_para		产品参数
 */


//2,商店详情（YXl）

function getbusiness(){
	axios.get('http://v.zy7c.com/index.php?r=Goods&m=business',{params:{id:1}},{headers:header}).then(function (response) {
		var res=response.data;
		if(res.res == 1){
			console.log(res.data);
		}else{
			data=res.data
			if(data == 1){
				console.log('未查询到商铺信息');
			}else{
				console.log('没有传入商品id');
			}
		}
		
		});
	}

/*
 res：1		查询成功
res：0		data： -1	没有传参商品id
res：0		data： 1	未查询到商铺信息
 */


/*
 id		商店的id值
 business_name		店铺名称
 business_tel		店铺电话
 business_address	店铺地址
 business_picture	店铺照片
 business_scope		配送范围
 business_notes		购买须知
 business_others	其他说明
 customer_tel		客服电话
 
 
 */


//3,商品评价(YXL)

function getcomment(){
	axios.get('http://v.zy7c.com/index.php?r=Comment&m=index',{params:{goods_id:1}},{headers:header}).then(function (response) {
		var res=response.data;
		console.log(res);
		});
	}

/*
   
 */


/*
user_name		用户名称
user_photo		用户头像
content			评论内容
picture			评论嗮图
add_time		评论时间
 
 */

//4,获取商品价格，库存(在选择规格的时候动态显示)
function getattrprice(){
	var params = new URLSearchParams();
	params.append('gid',2);//传入商品id
	params.append('attr',4);//传入选择的规格id
	axios.post('http://v.zy7c.com/index.php?r=Cart&m=getattrprice',params,{headers:header}).then(function (response) {
		var res=response.data;
		console.log(res);
		});
	}
/*
 price		此规格对应的商品价格
 kucun		此规格对应的库存量
 */

//5,获取商品所有的属性值
function get_goods_attr(){
	axios.get('http://v.zy7c.com/index.php?r=Cart&m=get_goods_attr',{params:{goods_id:1}},{headers:header}).then(function (response) {
		var res=response.data;
		console.log(res);
		});
	}

//6,商品添加收藏
function addfav(){
	var params = new URLSearchParams();
	params.append('goods_id',2);//传入商品id
	params.append('userId',1);
	params.append('userName','admin');
	axios.post('http://v.zy7c.com/member.php?r=Fav_goods&m=addfav',params,{headers:header}).then(function (response) {
		var res=response;
		console.log(res);
		});
	}

/*
res: 1	data:添加成功后生成的id号	收藏成功
res:	0	data:tip:no-data}		收藏失败
res: 0	data：0				商品已在收藏夹中
res：0	data：-1			未获得商品信息
res：0	data：1				用户未登陆
 */

//7,删除收藏

function delfav(){
	var params = new URLSearchParams();
	params.append('id',365);//传入id
	params.append('userId',1);//传入用户id
	axios.post('http://v.zy7c.com/member.php?r=Fav_goods&m=delfav',params,{headers:header}).then(function (response) {
		var res=response;
		console.log(res);
		});
	}
/*
 res：1	data：1		删除成功
res：0	data:{tip:no-data} 		删除失败
res:0	data：0		用户未登陆
res：0	data：-1	未获得要删除的商品id
 */

//8,判断商品是否已在收藏夹中
function  selectfav(){
	axios.get('http://v.zy7c.com/member.php?r=Fav_goods&m=selectfav',{params:{goods_id:1,userId:1}},{headers:header}).then(function (response) {
		var res=response;
		console.log(res);
		});
	}

/*
res:1		data:收藏夹id	已添加收藏
res:0		data:-1		未获得商品信息
res:0		data:1		商品未收藏

 */


/*

function  select1(){
	var params = new URLSearchParams();
	params.append('goods_id',1);//传入商品id
	params.append('userId',1);
	axios.post('http://v.zy7c.com/member.php?r=Fav_goods&m=selectfav',params).then(function (response) {
		var res=response;
		console.log(res);
		});
	}
 */






