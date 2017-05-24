//  反馈信息
$("#tjfk").on("click", function() {
	if(!$("#fk-fklx").val()) {
		$.toast("请选择反馈类型！");
	} else if(!$(".yijian-text").val()) {
		$.toast("请输入反馈内容！");
	} else {
		client.invoke("getFKTypeLists", function(result) {
			var result = $.parseJSON(result);
		});
		var fklx = {
			"内容问题": 1,
			"播放问题": 2,
			"卡顿问题": 3,
			"会员问题": 4,
			"账号问题": 5,
			"闪退、页面加载问题": 6,
			"产品意见": 7
		}
		client.invoke("addFkMsg", [{
			"type": fklx[$("#fk-fklx").val()],
			"content": $(".yijian-text").val(),
			"contact": $(".liuyan-input").val()
		}], function(result) {
			var result = $.parseJSON(result);
			if(result.res == 1) {
				$.toast("已收到您的反馈！");
				setTimeout(function() {
					window.location.href = "";
				}, 1500);
			}
		});
	}

});

//反馈问题选择
$("#fk-fklx").picker({
	toolbarTemplate: '<header class="bar bar-nav border-no">\
		  <button class="button button-link pull-left no-border close-picker"><span class="color-gray">取消</span></button>\
		  <button class="button button-link pull-right close-picker color-f60"><span class="color-f60">确定</span></button>\
		  </header>',
	cols: [{
		textAlign: 'center',
		values: ['内容问题', '播放问题', '卡顿问题', '会员问题', '账号问题', '闪退、页面加载问题', '产品意见']
	}]
});

$.init();