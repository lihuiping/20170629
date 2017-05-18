/*
*	功能说明：用户收货地址
*   开 发 人: 刘洪滨
*	开发时间: 2017-03-29
*/



/*
* 方法名：sendAddressAjax 统一发送AJAX 方法
* 参数：sendData(发送数据，json格式)，func(服务端方法名)
* 返回：服务端数据，格式参考各方法
*/

var tokens = token();//获取token

function sendAddressAjax(sendData,func){
	var obj;
	var header = {'content-type': 'application/x-www-form-urlencoded'};	
	var url = baseUrl()+'member.php?r=address&m='+func;
	var sendpara = '';
	for (var prop in sendData){
		sendpara = sendpara+prop+'='+sendData[prop]+'&';
	}
	sendpara = sendpara.substr(0,sendpara.length-1);
	
	axios.post(url,sendpara,{headers:header,async:false,})
		.then(function (response) {
			if(response.data.res==1){				
				//需数据处理的调用
				if(func == 'index'){
					setAddressList(response.data);
				}else if(func == 'getAddress'){
					setAddress(response.data);
				}else{
					//弹出提示
					$.toast(response.data.msg);
				}
				
			}	
		})
		.catch(function (error) {
		});
	
    return obj;
}


/*
*	方法名：getAddressList  获取用户收货地址列表
*	参数：无
*/

function getAddressList(){
	sendData = {};
	resData = sendAddressAjax(sendData,'index');	
}

/*
*	方法名：setAddressList  格式化地址列表
*	获取参数：adds = JSON
*		res (1成功 0失败)
*		msg (文字提示信息)
*		data(id:用户地址id,name:收货人姓名,phone:收货人手机号,detail:收货地址详情,isdef:是否默认地址 0=否 1=是)
*/
function setAddressList(adds){
	document.getElementById("content").innerHTML = JSON.stringify(adds);
}

/*
*	方法名：getAddress 获取用户某一收货地址信息
*	发送数据：id (用户地址id)
*	接收数据：	res (1成功 0失败)
*				msg (文字提示信息)
*				data(id:用户地址id,name:收货人姓名,phone:收货人手机号,detail:收货地址详情,isdef:是否默认地址 0=否 1=是)
*/

function getAddress(id){
	sendData = {id:id};
	resData = sendAddressAjax(sendData,'getAddress');	
}
function setAddress(adds){
	document.getElementById("content").innerHTML = JSON.stringify(adds);
}

/*
*	方法名：setDefaultAddress  设置默认收货地址
*	发送数据：id (用户地址id)
*	接收数据：	res (1成功 0失败)
*				msg (文字提示信息)
*				data()
*/

function setDefaultAddress(id){	
	sendData = {id:id,token:tokens};
	resData = sendAddressAjax(sendData,'ajax_setdefault');
	
}


/*
*	方法名：delAddress 删除收货地址
*	发送数据：id (用户地址id)
*	接收数据：	res (1成功 0失败)
*				msg (文字提示信息)
*				data()
*/

function delAddress(id){
	sendData = {id:id,token:tokens};
	resData = sendAddressAjax(sendData,'del');		
}

/*
*	方法名：addOrEditAddress 增加或编辑收货地址
*	发送数据：name:收货人姓名
*			phone:收货人手机号
*			area:地区 以空格分隔
*			detail:收货地址详情
*			isdef:是否默认地址 0=否 1=是
*			type:判断类型 0=添加 1=编辑
*			id:	如果是编辑类型，则id必须传递
*	接收数据：	res (1成功 0失败)
*				msg (文字提示信息)
*				data()
*/
function addOrEditAddress(name,phone,area,detail,isdef,type,id){	
	if(type == 1){
		sendData = {
			uname:name,
			mobile:phone,
			area:area,
			isdefault:isdef,
			id:id
		};
		resData = sendAddressAjax(sendData,'edit');
	}else{
		sendData = {
			uname:name,
			mobile:phone,
			area:area,
			isdefault:isdef,
		};
		resData = sendAddressAjax(sendData,'add');
	}
		
}
