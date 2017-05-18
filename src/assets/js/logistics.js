/**
 * ajax 获取配送方式 post请求
 * 请求参数：商品id goods_id 商品数量 goods_number
 * 返回值:物流公司id  物流名称name 价格price
 * PHP--何文武
 */
getLogistics(1,2);
function getLogistics(goods_id,goods_number){
        //请求跨域
        var header = {'content-type': 'application/x-www-form-urlencoded'}
        var params = new URLSearchParams();
        var url = 'http://v.zy7c.com/index.php?r=shipping&m=index';
        params.append('goods_id',goods_id );
        params.append('goods_number',goods_number );
        //post 请求
        axios.post(url,params,{headers:header}).then(function (response) {
                            
                            if(res == 1){
                                $.closeModal('.popup-services');
                            }else{
                                layer.open({
                                    content: '网络错误,请重试',
                                    skin: 'msg',
                                    time: 2 //2秒后自动关闭
                                });
                            }

            });

}




    