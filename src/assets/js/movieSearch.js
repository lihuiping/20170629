function baseUrl() {
				return 'http://my.shop.7cai.tv/';
			}
			//进入页面刷新
			var Cookie = {
				setCookie: function(name, value, option) {
					var str = name + "=" + escape(value);
					if(option) {
						if(option.expireDays) {
							var date = new Date();
							var ms = option.expireDays * 24 * 3600 * 1000;
							date.setTime(date.getTime() + ms);
							str += "; expires=" + date.toGMTString();
						}
						if(option.path) str += ";path=" + option.path;
						if(option.domain) str += ";domain=" + option.domain;
						if(option.secure) str += ";true";
					}
					document.cookie = str;
				},
				getCookie: function(name) {
					var cookies = document.cookie.split(";");
					for(var i = 0; i < cookies.length; i++) {
						var arr = cookies[i].split("=");
						if(arr[0] == name) {
							return unescape(arr[1]);
						}
					}
					return "";
				},
				delCookie: function(name) {
					this.setCookie(name, "", {
						expireDays: -1
					});
				}
			}
			window.onload = function() {
				if("1" == Cookie.getCookie("diffmaker")) {
					$("#sousuo-input").val("");
					//alert("找到Cookie，我将不再刷新页面，并删除Cookie");  
					Cookie.delCookie("diffmaker");
				} else {
					$("#sousuo-input").val("");
					//alert("没有找到Cookie，我将刷新页面!");  
					Cookie.setCookie("diffmaker", "1", null);
					window.location.reload(true);
				}
			}
			
			$(".not-found-video").show();
			$("#sousuo-quxiao").on("click", function() {
				window.history.go(-1);
			});
			var u = navigator.userAgent;
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
			
			//搜索框输入时状态 
			$("#sousuo-input").on('input', function() {
				//接受后台数据  
				var inVal = $("#sousuo-input").val();
				if(inVal != ''){
					$("#ss-shanchu").show();
					$("#ss-shanchu").click(function() {
						$("#sousuo-input").val("");
						$(".sousuo-list ul").empty();
						$(".not-found-video").hide();
						$(".clear-record").hide();
					})
					$.ajax({
						type: "GET",
//						async: false,
						url: baseUrl() + 'tv/?s=/Api/movie/search/name/<![CDATA[all]>/size/10000', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
//						cache: false, //默认值true
						dataType: 'json',
						data: {name:$('input[name=search]').val()},
						success: function(db) {
							if(db.res ==1){
	                            $('.sousuo-list ul').html('');
	                            console.log(db.data.id);
	                            $.each( db.data, function(i, n){
	                                $('.sousuo-list ul').append('<li><a href="movie-content.html?id='+n['id']+'">'+ n['videoname']+'--'+n['id']+'</a></li>');
	                            });
	                            
	                            $(".clear-record").show();
								$(".not-found-video").hide();
	                            $("#qingkongjilu").on("click", function() {
									$(".sousuo-list ul li").remove();
								});
								
                        	}
						},
	
						error: function(status) {
							layer.open({
								content: '数据错误',
								skin: 'msg',
								time: 1 //1秒后自动关闭
							});
						}
	
					})
				}else{
					$(".not-found-video").show();
					$(".sousuo-list ul").html('');
				}
			});