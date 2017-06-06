var conf = 1; //0为本地测试接口；1为真实接口
var toke = token(); //获取token
var goodsList = ['../assets/data/shopping-cart.json', baseUrl() + 'index.php?r=cart&token=' + toke]; //
var delGoods = ['', baseUrl() + 'index.php?r=cart&m=delCart&token=' + toke]; //删除购物车
var normsList = ['../assets/data/goods-attr.json', baseUrl() + 'index.php?r=cart&m=get_cart_goods_attr&token=' + toke]; //获取购物车规格接口
var couponsList = ['../assets/data/coupons.json', baseUrl() + 'index.php?r=Discount_coupon&m=getShopCoupon&token=' + toke]; //获取优惠券接口
var couponList = ['', baseUrl() + 'index.php?r=User_discount_coupon&m=addUserCoupon'] //获取领取优惠券接口
var editGoods = ['', baseUrl() + 'index.php?r=cart&m=editcart']; //获取编辑属性规格接口

//购物车属性编辑
var goodsAttr = new Vue({
	el: '#goods_edit_attr',
	data: {
		parameter: [],
		ruleIndex: 0,
		imgSrc: "",
	},
	filters: {
		//过滤器
		formatQcb1: function(value, quentity) {
			if(!quentity) {
				quentity = 1;
			}
			return value * quentity;
		},
		formatMoney1: function(value, quentity) {
			if(!quentity) {
				quentity = 1;
			}
			return "￥" + (value * quentity).toFixed(2);
		}
	},
	mounted: function() {
		//初始化加载数据
		//		var _this = this;
		//		this.$nextTick(function(){
		//			_this.showParameter();
		//		})	
	},
	methods: {
		showParameter: function(product) {
			//初始化数据
			var _this = this;
			_this.$nextTick(function() {
				axios.post(normsList[conf], transformRequest({
					goods_id: product.goods_id,
					cart_id: product.id,
					token: toke
				})).then(function(response) {
					var datas = response.data;
					if(datas.res == "1") {
						_this.parameter = datas.data;
					} else {
						layer.open({
							content: '数据错误！',
							skin: 'msg',
							time: 1
						});
					}
				});
			});
		},
		selectRule: function(chooseRule, index, pro_id, attr_id, attrId) {
			//点击选择商品属性
			var _this = this;
			_this.$nextTick(function() {
				$('li[data-pub="' + attr_id + '"]').removeClass('active');
				$('li[data-pro="' + pro_id + '"]').addClass('active');
				$("." + attr_id).html(chooseRule);
				$("." + attr_id).attr("attrId", attrId);
			});
		},

		changeNum: function(goods, num) {
			//选择数量
			var _this = this;
			var carNum = goods.cart_number;
			var kucun = goods.kucun;
			if(num > 0) {
				if(carNum < kucun) {
					goods.cart_number++;
				} else {
					goods.number = goods.kucun;
					layer.open({
						content: '库存不足！',
						skin: 'msg',
						time: 1
					});
					return false;
				}
			} else {
				goods.cart_number--;
				if(goods.cart_number < 1) {
					goods.cart_number = 1;
				}
			}
			axios.post(editGoods[conf], transformRequest({
				goods_id: goods.goods_id,
				cart_id: goods.cart_id,
				num: goods.cart_number,
				token: toke
			})).then(function(data) {
				var resData = data.data;
				if(resData.res == "1") {
					_this.$nextTick(function() {
						checkedGoods();
					});
				} else {
					goods.cart_number--;
				}
			});

		},
		selectFinish: function(goods) {
			//提交编辑属性
			var _this = this;
			var flag = true;
			var ids = "";
			var attrArr = "";
			$(".ruleClass b").each(function(i, v) {
				checkedGoods();
				if($(v).text() == "") {
					layer.open({
						content: '请选择' + $(v).attr('data-val'),
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					flag = false;
					return false;
				} else {
					if(ids == "") {
						ids = $(v).attr("attrId");
						attrArr = $(v).text();
					} else {
						ids += "," + $(v).attr("attrId");
						attrArr += " " + $(v).text();
					}
				}
			});

			//			$("div[data-attrId=" + goods.cart_id + "]").html("规格：" + attrArr +'<i class="icon icon-down"></i>');
			if(flag) {
				var nums = $("#goods_number").val();
				axios.post(editGoods[conf], transformRequest({
					goods_id: goods.goods_id,
					cart_id: goods.cart_id,
					attr: ids,
					num: nums,
					token: toke
				}), {
					headers: header
				}).then(function(response) {
					var res = response.data.res;
					var msg = response.data.msg;
					if(res == 1) {
						checkedGoods();
						layer.open({
							content: msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});

						vm.showView();
					} else {
						layer.open({
							content: msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				});
			}
			$.closeModal('.popup-about');

		}
	}
});

// 购物车列表渲染

var vm = new Vue({
	el: "#shopping_cart",

	data: {
		shoppingList: [],
		totalMoney: 0,
		checkAll: false,
		currentProduct: '',
		delBtn: true,
		checked: [],
		baseNum: 0,
		loadingFlag:true,
		shopflag: true,
		donation: false
	},
	computed: {
		//计算
		allChecked: {
			get: function() {
				return this.checkedCount = this.shoppingList.length;
			},
			set: function(value) {
				if(value) {
					this.checked = this.shoppingList.map(function(item) {
						return item.name;
					})
				} else {
					this.checked = [];
				}
			}
		},
		checkedCount: {
			get: function(value) {
				return value.checked.length;
			}
		}
	},
	mounted: function() {
		//钩子函数
		var _this = this;
		_this.$nextTick(function() {
			_this.showView();
		})
	},

	filters: {
		//过滤器
		formatQcb: function(value, quentity) {
			if(!quentity) {
				quentity = 1;
			}
			return value * quentity;
		},
		formatMoney: function(value, quentity) {
			if(!quentity) {
				quentity = 1;
			}
			return "￥" + (value * quentity).toFixed(2);
		}
	},
	methods: {
		showView: function() {
			//显示渲染视图
			var _this = this;
			axios.get(goodsList[conf], {
				token: toke
			}).then(function(response) {
				var resObj = response.data;
				_this.loadingFlag = false;
				if(resObj && resObj.res == "1") {
					_this.shoppingList = resObj.data;
					_this.shopflag = false;
				}
			});

		},
		getTitleHref: function(val) {
			return 'goods-detail.html?id=' + val
		},
		changeMoney: function(goods, way) {
			//计算商品价格
			var _this = this;
			var carNum = goods.number;
			var kucun = goods.kucun;

			if(way > 0) {
				if(carNum < kucun) {
					goods.number++;

				} else {
					goods.number = goods.kucun;
					layer.open({
						content: '库存不足！',
						skin: 'msg',
						time: 1
					});
				}
			} else {
				goods.number--;
				if(goods.number < 1) {
					goods.number = 1;
				}
			}
			axios.post(editGoods[conf], transformRequest({
				goods_id: goods.goods_id,
				cart_id: goods.id,
				num: goods.number,
				token: toke
			})).then(function(response) {
				var retData = response.data;
				if(retData.res == 1) {

				} else {
					goods.number--;
					$.toast(retData.msg);
				}
			});
			_this.$nextTick(function() {
				checkedGoods();
			});
		},
		delGoods: function(product, type) {
			//删除商品
			
			var _this = this;
			_this.currentProduct = product;
			var cart_id = _this.currentProduct.id; //商店id
			var shop_id = _this.currentProduct.shopid;
			if(_this.currentProduct == "undefined") {
				_this.$set(product, 'checked', true);
			}
			$.confirm('确认删除吗？', function(e) {
				$.swipeoutClose('li.swipeout');
				axios.post(delGoods[conf], transformRequest({
					ids: cart_id,
					token: toke
				})).then(function(response) {
					var resObj = response.data;
					if(resObj || resObj.res == "1") {
						var procheck = $("input[data-delcc=" + product.id + "]").prop('checked');
						if(procheck) {
							var protot = $("#ck_lenght").text();
							var qctot = $("#count_qcb").text();
							var cnytot = $("#count_price").text();
							var cnypr = product.sell_price * product.number;
							var qcpr = product.price * product.number;
							$("#count_qcb").text(qctot - qcpr);
							$("#count_price").text((cnytot - cnypr).toFixed(2));
							$("#ck_lenght").text(protot - 1);
							if(protot == 1) {
								$(".ccart-list").remove();
							}
							_this.$nextTick(function() {
								
								vm.showView();
							});
							$.toast("删除成功");

						} else {
							var ckleng = $(".count-price").length;
							if(ckleng <= 1){
								$(".ccart-list").remove();
								vm.showView();
							}
							_this.$nextTick(function() {
								
								vm.showView();
							});

						}

					} else {
						$.toast("删除失败");
					}

				});
			});
			
			$('.modal-inner').addClass("shopcartAera");
//			$('.modal-text').addClass("searchTop");
			$('.modal-button').addClass("shopcartConfirm");
			$('.modal-button:first-child').addClass("shopcartCancel");
			$('.modal-button-bold').addClass("shopcartSure");

		},
		showEdit: function(product) {
			//编辑属性
			$.popup('.popup-about');
			this.$nextTick(function() {
				goodsAttr.showParameter(product);
			});

		},
		getCoupon: function(product) {
			//领取优惠券
			$.popup('.popup-stageticket');
			this.$nextTick(function() {
				coupon.showCoupon(product);
			});
		},
		checkedGood: function(e) {
			//选中商品
			var inputAllNum = $("input[data-sub='" + e + "']").length;
			var inputCkNum = $("input[data-sub='" + e + "']:checked").length;
			if(inputAllNum === inputCkNum && inputCkNum > 0) {
				$("input[data-top='" + e + "']").prop('checked', true);
				$("input[data-top='" + e + "']").attr('status', '1');
			} else {
				$("input[data-top='" + e + "']").prop('checked', false);
				$("input[data-top='" + e + "']").attr('status', '0');
			}
			checkedGoods();
		},
		shopAllGoods: function(e) {
			//商铺全选
			//if(_this._data.checkAll)
			var _this = this;
			//			_this.checked = e;
			//			var childLs = e.cartlist.list.length;
			//			e.cartlist.list.forEach(function(item,index){
			//				item.checked = true;
			//				console.log(item.checked)
			//				
			//			});

			var status = $("input[data-top='" + e.shopid + "']").attr('status');

			$("input[data-top='" + e.shopid + "']").attr('status');
			if(status === '0') {
				_this._data.checkAll = true;
				$("input[data-top='" + e.shopid + "']").attr('status', '1');
			} else {
				_this._data.checkAll = false;
				$("input[data-top='" + e.shopid + "']").attr('status', '0');
			}

			$("input[data-pro='" + e.shopid + "']").prop('checked', _this._data.checkAll);
			checkedGoods();
		}
	}
});
//购物车结算提交
$("#sub_shopping").on('click', function() {
	var goodsData = [];
	var data = "";
	$(".count-price").each(function(index, event) {
		var isck = $(this).is(':checked');
		if(isck) {
			var thisId = $(this).attr("id");
			goodsData.push(thisId);
		}

	});
	data = goodsData.join(',');
	if(data.length == 0) {
		$.toast('请选择商品！');
		return false;
	} else {

		location.href = "confirmOrder.html?attr=" + data + '&token=' + toke;
	}
});

//计算价格
function checkedGoods() {
	var qcbcount = 0; //七彩币
	var rmbPrice = 0; //人民币
	var goodsNum = 0; //选中商品数量
	var allGdoos = 0; //所有商品数量
	$('.ccart-con .count-price').each(function(index, event) {
		var isCk = $(this).prop("checked");
		allGdoos++;
		if(isCk) {
			var inputNum = parseInt($(this).data("nums"));
			goodsNum++;
			qcbcount += parseInt($(this).data('qcb')) * inputNum;
			rmbPrice += parseFloat($(this).data('price')) * inputNum;
		}
	});

	if(goodsNum != allGdoos) {
		$('#check_all').prop('checked', false)
	} else {
		$('#check_all').prop('checked', true);
	}

	$("#count_qcb").text(qcbcount);
	$("#count_price").text(rmbPrice.toFixed(2));
	$("#ck_lenght").text(goodsNum);

}

function shopAllChecked(obj) {
	obj.parent('.ccart-title').sibling('.ccart-content').find('.count-price').each(function(index, event) {
		var isCk = $(event).prop('checked');
		if(!isCk) {
			$(event).prop('checked', false);
		} else {
			$(event).prop('checked', true);
		}
	});
}
//商铺全选

$('#check_all').on('click', function(e) {
	//底部点击全选
	var isCk = $(this).prop("checked");
	$('.count-price').prop("checked", isCk);

	$('#shopping_cart input[type="checkbox"]').each(function(index, e) {
		if(!isCk) {
			$(this).prop("checked", false);
		} else {
			$(this).prop('checked', true);

		}

	});
	checkedGoods();
});

//axios请求跨域
var header = {
	'content-type': 'application/x-www-form-urlencoded'
};
//axios处理数据转换格式
function transformRequest(data) {
	var ret = '';
	for(var it in data) {
		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	};
	return ret;
};

//优惠券
var coupon = new Vue({
	el: '.popup-stageticket',
	data: {
		couponList: []
	},
	filters: {
		couponsMoney: function(value, currency) {
			if(currency == 1) {
				return "七彩币" + value;

			} else if(currency == 2) {
				return "￥" + value;
			}
		},
		receiveStatus: function(status) {
			if(status == 1) {
				return value = "已领取";
			} else {
				return value = "领券";

			}
		}
	},
	mounted: function() {
		//初始化加载数据
		//		this.showCoupon();
	},
	methods: {
		showCoupon: function(product) {
			//获取优惠券数据
			axios.post(couponsList[conf], transformRequest({
				shop_id: product.shopid,
				token: toke
			})).then(function(response) {
				//				console.log(response.data);
				var data = response.data;
				//				console.log(data);
				coupon.couponList = data;
				if(data.res == 0) {
					$(".sp-box").hide();
				}
			});
		},
		receiveCoupons: function(id) {
			//领取优惠券
			if($("#" + id).html() == "领券") {
				axios.post(couponList[conf], transformRequest({
					discount_coupon_id: id,
					token: toke
				}), {
					headers: header
				}).then(function(response) {
					var res = response.data.res;
					var msg = response.data.msg
					if(res == 1) {
						$("#" + id).html("已领取");
						layer.open({
							content: '成功领取优惠券',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					} else {
						layer.open({
							content: msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					};
				});
			};
		}
	}
});

$.init();