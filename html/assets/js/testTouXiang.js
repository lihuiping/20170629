	apiready()
	//头像
	$("#changetx").on("click", function() {		
		sendImg = function(type) {
			if(type == 1) { // 拍照
				//获取一张图片
				api.getPicture({
					sourceType: 'camera',
					encodingType: 'jpg',
					mediaValue: 'pic',
					allowEdit: false,
					quality: 90,
					saveToPhotoAlbum: true,
					destinationType: 'url' //base64   字符流
				}, function(ret, err) {
					// 获取拍照数据并处理
					var imgSrc = ret.data;
					if(imgSrc != "") {
						var ele = $api.dom('#avatar');
						$api.attr(ele, 'src', imgSrc);
					}
				});
			} else {
				api.getPicture({
					sourceType: 'album',
					encodingType: 'jpg',
					mediaValue: 'pic',
					destinationType: 'url',
					allowEdit: true,
					quality: 50,
					targetWidth: 100,
					targetHeight: 100,
					saveToPhotoAlbum: false
				}, function(ret, err) {
					if(ret) {
						var imgSrc = ret.data;
						if(imgSrc != "") {
							var ele = $api.dom('#avatar');
							var ss = $api.append(ele, '<img style="width: 100%;"></img>');
							$api.attr(ss, 'src', imgSrc);
						}
					} else {
						alert(JSON.stringify(err));
					}
				});
			}

		};
		var buttons1 = [{
				text: "修改头像",
				label: true,
				color: "gray"
			},
			{
				text: '拍照',
				bold: true,
				color: 'danger',
				onClick: function() {
					sendImg(1);
				}
			},
			{
				text: '相册',
				//bold:true,
				color: 'warning',
				onClick: function() {
					sendImg(0);
				}
			}
		];
		var buttons2 = [{
			text: '取消'
		}];
		var groups = [buttons1, buttons2];
		$.actions(groups);
	});