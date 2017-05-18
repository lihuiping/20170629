var conf = 0; //0为本地测试接口；1为真实接口
var toke = token(); //获取token
var goodsList = ['../assets/data/shopping-cart.json', baseUrl() + 'index.php?r=cart&token=' + toke]; //
var delGoods = ['../assets/data/shopping-cart.json', baseUrl() + 'index.php?r=cart&m=delCart&token=' + toke]; //删除购物车
var normsList = ['../assets/data/goods-attr.json', baseUrl() + 'index.php?r=cart&m=get_cart_goods_attr&token=' + toke]; //获取购物车规格接口
var couponsList = ['../assets/data/coupons.json', baseUrl() + 'index.php?r=Discount_coupon&m=getShopCoupon&token=' + toke]; //获取优惠券接口
var couponList = ['', baseUrl() + 'index.php?r=User_discount_coupon&m=addUserCoupon'] //获取领取优惠券接口
var editGoods = ['', baseUrl() + 'index.php?r=cart&m=editcart']; //获取编辑属性规格接口
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
//实例化vue对象
var vm = new Vue({
	el: '#shopping',
	data: {
		checked: [],
		shopcked: [],
		totalPrice: [],
		totalQcb: [],
		shoppingList: [],
		shopList: [],
		cartList: [],
		lists: [],
		goods: [],
		donation: false
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

	mounted: function() {
		//钩子函数
		var _this = this;
		this.$nextTick(function() {
			vm.showView();
		})
	},
	computed: {
		totalMoney: function(item, index) {
			var sum = 0;
			for(var i = 0; i < this.totalPrice.length; i++) {
				sum += this.totalPrice[i];
			};
			return sum.toFixed(2);
		},
		totalQc: function(item, index) {
			var sum = 0;
			for(var i = 0; i < this.totalQcb.length; i++) {
				sum += this.totalQcb[i];
			};
			return sum;
		},
		shopckAll: {
			get: function() {
				return this.checkedCount == this.lists.length;
			},
			set: function(value) {
				console.log(value);
				var _this = this;
				if(value) {
					this.shopcked = this.lists.map(function(item, index) {
						return item.shopid;
					});
					this.lists.forEach(function(item, index) {

					});
					_this.shopcked.forEach(function(item, index) {
						_this.lists.forEach(function(ss, index) {
							if(ss.shopid == item) {
								ss.checked = true;
							}
						});
					});
					if(typeof item.checked === 'undefined') {
						_this.$set(item, 'checked', true);
					}
				} else {
					this.lists.forEach(function(item, index) {

						//									item.shopid = ;
					});
				}
			}
		},
		shopCheck: {
			get: function() {
				return this.checkedCount == this.lists.length;
			},

			set: function(item) {
				console.log(item)
				if(item) {
					this.checked = this.lists.map(function(item, index) {
						//									console.log(item);
						var total = item.price * item.number;
						var totalqcb = item.sell_price * item.number;
						_this.totalPrice.push(total);
						_this.totalQcb.push(totalqcb);
						return item.id
					});
				}else{
					this.lists.forEach(function(item, index) {
						item.checked = false;
					});
				}
			}
		},
		checkAll: {
			get: function() {
				return this.checkedCount == this.lists.length;

			},
			set: function(value) {
				var _this = this;
				if(value) {
					this.totalPrice = [];
					this.totalQcb = [];

					this.checked = this.lists.map(function(item, index) {
						//									console.log(item);
						var total = item.price * item.number;
						var totalqcb = item.sell_price * item.number;
						_this.totalPrice.push(total);
						_this.totalQcb.push(totalqcb);
						return item.id
					});
					console.log(this.checked);
					//					this.shopcked = this.shopList.map(function(item, index) {
					//						return item.shopid;
					//					});

				} else {
					this.checked = [];
					this.totalPrice = [];
					this.totalQcb = [];
					this.lists.forEach(function(item, index) {
						item.checked = false;
					});
					this.shopList.forEach(function(item, index) {
						console.log(item.shopcked)
						item.shopcked = false;
					});

				}
			}
		},
		checkedCount: {
			get: function() {
				return this.checked.length;
			}
		}
	},
	methods: {
		showView: function() {
			//显示渲染视图
			var _this = this;
			axios.get(goodsList[conf]).then(function(response) {
				var resObj = response.data;
				_this.$nextTick(function() {
					if(resObj && resObj.res == "1") {
						_this.shoppingList = resObj.data.able;
						//										console.log(_this.shoppingList);
						_this.shoppingList.forEach(function(item, index) {
							_this.shopList.push(item);
							return this.shopList;
						});
						//										console.log(_this.shopList);
						_this.shopList.forEach(function(item, index) {
							_this.cartList.push(item.cartlist);
							return _this.goodsListData;
						});

						_this.cartList.forEach(function(item, index) {
							item.list.forEach(function(item, index) {
								_this.lists.push(item);
								return _this.lists;
							});
						});

						var liP = $('.ccart-shixiao').find('li').length;
						if(liP === 0) {
							$('.ccart-shixiao').remove();

						}
					} else {
						$.toast("操作失败");
					}
				});
			});
		},
		currClick: function(item, index) {
			//单个商品选中
			var _this = this;
			if(typeof item.checked == 'undefined') {
				this.$set(item, 'checked', true);
				var total = item.price * item.number;
				var totalqcb = item.sell_price * item.number;
				this.totalPrice.push(total);
				this.totalQcb.push(totalqcb);
			} else {
				item.checked = !item.checked;
				if(item.checked) {
					this.totalPrice = [];
					this.totalQcb = [];
					this.lists.forEach(function(item, index) {
						if(item.checked) {
							var total = item.price * item.number;
							var totalqcb = item.sell_price * item.number;
							_this.totalPrice.push(total);
							_this.totalQcb.push(totalqcb);
						}
					});
				} else {
					this.totalPrice = [];
					this.totalQcb = [];
					this.lists.forEach(function(item, index) {
						if(item.checked) {
							var total = item.price * item.number;
							var totalqcb = item.sell_price * item.number;
							_this.totalPrice.push(total);
							_this.totalQcb.push(totalqcb);
						}
					});
				}
			}
		},
		shopCheck: function(shopid, index) {
			var _this = this;
			if(typeof shopid.checked == 'undefined') {
				_this.$set(shopid, 'checked', true);
				
			} else {
				shopid.checked = !shopid.checked;
			}
			console.log(shopid.checked);
			this.checked = shopid.cartlist.list.map(function(list, index) {
				if(typeof list.checked == 'undefined') {
					_this.$set(list, 'checked', shopid.checked);

				} else {
					list.checked = shopid.checked;
				}
				return list.id;
			});

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
							if(ckleng <= 1) {
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

		}
	}
});