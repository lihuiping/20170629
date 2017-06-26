
apiready = function(){
	exitApp();
}
function exitApp(){
        api.addEventListener({
            name: 'keyback'
        }, function(ret, err){
            api.toast({
                    msg: '再按一次返回键退出'+api.appName,
                    duration:2000,
                    location: 'bottom'
                });
                
                api.addEventListener({
                    name: 'keyback'
                }, function(ret, err){
                    api.closeWidget({
                            id: 'A6960480793365',     //这里改成自己的应用ID
                            retData: {name:'closeWidget'},
                            silent:true
                        });
                });
                
                setTimeout(function(){
                        exitApp();
                },3000)
        });
}