
//发现页面
//$(document).on("pageInit", "#faxian", function(e, id, page) {
	var link1 = document.getElementById("my-found").childNodes[1].children[0].children;
	var link2 = document.getElementById("my-found").childNodes[1].children[1].children;
	var link3 = document.getElementById("my-found").childNodes[1].children[2].children;
	
//	console.log(link1);
	link1[0].onclick = function() {
		window.location.href = "http://dynamic.m.tuniu.com/m2015/flight/index";
	}
	link1[1].onclick = function() {
		window.location.href = "http://dynamic.m.tuniu.com/train";
	}
	link1[2].onclick = function() {
		window.location.href = "http://alifuwu.hezuo.changtu.com/";
	}
	link2[0].onclick = function() {
		window.location.href = "http://m.tuniu.com/m2015/mpChannel/index";
	}
	link2[1].onclick = function() {
		window.location.href = "http://m.tuniu.com/hotel";
	}
	link2[2].onclick = function() {
		window.location.href = "http://weather.html5.qq.com/";
	}
	link3[0].onclick = function() {
		window.location.href = "http://webmetro.itouchchina.com/citylist.php";
	}
	link3[1].onclick = function() {
		window.location.href = "http://taxi.map.baidu.com/";
	}
	link3[2].onclick = function() {
		window.location.href = "moviePhoto.html";
	}
//})

$(".mytouch").on("touchstart", function() {
	$(this).addClass("myop");
})
$(".mytouch").on("touchend", function() {
	$(this).removeClass("myop");
})

//阻止IOS底部拖动
function noscroll() {
	var content = document.querySelector('.content') || null;
	var startY;

	if(content) {
		content.addEventListener('touchstart', function(e) {
			startY = e.touches[0].clientY;
		});

		content.addEventListener('touchmove', function(e) {
			// 高位表示向上滚动
			// 底位表示向下滚动
			// 1容许 0禁止
			var status = '11';
			var ele = this;

			var currentY = e.touches[0].clientY;

			if(ele.scrollTop === 0) {
				// 如果内容小于容器则同时禁止上下滚动
				status = ele.offsetHeight >= ele.scrollHeight ? '00' : '01';
			} else if(ele.scrollTop + ele.offsetHeight >= ele.scrollHeight) {
				// 已经滚到底部了只能向上滚动
				status = '10';
			}

			if(status != '11') {
				// 判断当前的滚动方向
				var direction = currentY - startY > 0 ? '10' : '01';
				// 操作方向和当前允许状态求与运算，运算结果为0，就说明不允许该方向滚动，则禁止默认事件，阻止滚动
				if(!(parseInt(status, 2) & parseInt(direction, 2))) {
					e.preventDefault();
				}
			}
		});
	}
}

noscroll();
$.init();