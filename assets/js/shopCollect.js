 var conf = 1;
 var getgood = ['../assets/data/model.json', baseUrl() + 'member.php?r=Fav_goods&m=findfav'];
 var getshop = ['../assets/data/shopmodel.json', baseUrl() + 'member.php?r=Fav_business&m=findfav'];
 var del_good = ['../assets/data/shopmodel.json', baseUrl() + 'member.php?r=Fav_goods&m=delfav'];
 var del_business = ['../assets/data/shopmodel.json', baseUrl() + 'member.php?r=Fav_business&m=delfav'];
  


 // --子项复选框被单击---
 function ChkSonClick(sonName, cbAllId) {
     var arrSon = $(sonName)
         //console.log(arrSon.length);
     var cbAll = document.getElementById(cbAllId);
     for (var i = 0; i < arrSon.length; i++) {
         if (!arrSon[i].checked) {
             cbAll.checked = false;
             return;
         }
     }
     cbAll.checked = true;
 }

 function clIput(id) {
     $(id).each(function(event, index) {
         ChkSonClick($(this), 'chkAll');
     });
 }
 function getgoodlist() {
     $.ajax({       
         type: "get",
                async: false,
                url: getgood[conf], //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
                cache: false, //默认值true
                dataType :   'json',
         data: { token: token()},
                 // jsonp: "jsoncallback",
                       //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                     //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
                success: function(json) {           
             dataList = json;
             //console.log(dataList);
             var len_good = $("#good li").length;
             if (len_good > "1") {
                 $("#good").show();
                 //  $(".no-good").hide();
             } else if (dataList.res == "0" || len_good == "0") {
                 $("#good").hide();
                 $(".no-good").removeClass('hidden');
             }
             var app = new Vue({
                 el: '#good',
                 data: dataList,
                 methods: {
                     getTitleHref: function(val) {
                         return 'goods-detail.html?id=' + val
                     }
                 }
             });       
         },
                error: function() { }   
     });
 }

 function getshoplist() {
     $.ajax({       
         type: "get",
                async: false,
                url: getshop[conf],
                cache: false, //默认值true
                dataType :   'json',
         data: { token: token() },
                 // jsonp: "jsoncallback",
                       //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                     //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
                success: function(json) {           
             dataList = json;
             var len_good = $("#shop li").length;
             if (len_good > "1") {
                 $("#shop").show();
                 //$(".no-shop").hide();
             } else if (dataList.res == "0" || len_good == "0") {
                 $("#shop").hide();
                 $(".no-shop").removeClass("hidden");
             }

             var app = new Vue({
                 el: '#shop',
                 data: dataList,
                 methods: {
                     goodMessage: function(dataList) {}
                 }
             });       
         },
                error: function() {}   
     });
 }

 function cancel_good(event) {
     var del_goodid = event.find("label").attr("for");
     $.ajax({
         type: "POST",
         url: del_good[conf],
         traditional: true,
         data: { id: del_goodid, token: token() },
         cache: false,
         success: function(data) {
             // $.toast("取消店铺成功",3000);
             // layer.msg('取消店铺成功');
             layer.open({
                 content: '已取消收藏所选商品',
                 skin: 'msg',
                 time: 2
             });
             // $(".cancelCollect").remove();
             event.remove();
         },
         error: function(data) {
             layer.open({
                 content: '取消收藏所选商品失败',
                 skin: 'msg',
                 time: 2
             });
         }
     })
 };

 function cancel_business(event) {
     var del_shopid = event.attr("for");
     $.ajax({
         type: "POST",
         url: del_business[conf],
         traditional: true,
         data: { id: del_shopid, token: token() },
         cache: false,
         success: function(data) {
             // $.toast("取消店铺成功",3000);
             // layer.msg('取消店铺成功');
             layer.open({
                 content: '已取消收藏所选商铺',
                 skin: 'msg',
                 time: 2
             });
             // $(".cancelCollect").remove();
             event.parent().remove();
         },
         error: function(data) {
             layer.open({
                 content: '取消收藏所选商铺失败',
                 skin: 'msg',
                 time: 2
             });
         }
     })
 }
 $(function() {
     /*绑定数据*/
     //商品
     getgoodlist();
     getshoplist();
     //单选
     $(".tabs input[name='my-radio']").on("click", function(event) {
         clIput(".active input[name='my-radio']");
         var del_num = $(".tabs .active input[name='my-radio']:checked").length;
         $(".del_num").text(del_num);
     });
     // $(".shop input[name='my-radio']").on("click", function(event) {
     //     clIput("#tab2 .goods input[name='my-radio']");
     //      var del_num= $(".tabs .active input[name='my-radio']:checked").length;
     //     $(".del_num").text(del_num);
     // });
     //全选
     var isCheckAll = false;
     $("#chkAll").on("click", function() {
         if (isCheckAll) {
             $("input[type='checkbox']").each(function() {
                 this.checked = false;
             });
             isCheckAll = false;
             $(".del_num").text("0");
         } else {
             $("input[type='checkbox']").each(function() {
                 this.checked = true;
             });
             isCheckAll = true;
             $(".del_num").text($(".active input[name='my-radio']:checked").length);
         }
     });

     //多选删除
     $(".gooddel").on("click", function() {
         var checkList = '';
         $(".tabs .active input[name='my-radio']:checked").each(function(i, v) {
             //          debugger;
             if (checkList == '') {
                 checkList = $(v).attr('id');
             } else {
                 checkList += ',' + $(v).attr('id');
             }
         });

         if ($(".bdbtm.active").text().trim() == "商品") {
             $.ajax({
                 type: "POST",
                 url: del_good[conf],
                 traditional: true,
                 data: { id: checkList, token: token() },
                 cache: false, //默认值true
                         //dataType :   'jsonp',
                           // jsonp: "jsoncallback",
                 success: function(data) {
                     
                     var p_checked = $(".tabs .active input[name='my-radio']:checked");
                     if (p_checked.length > 0) {
                         layer.open({
                             content: '删除商品成功',
                             skin: 'msg',
                             time: 2
                         });
                         p_checked.parent().parent().remove();
                         getgoodlist();

                     } else {
                         layer.open({
                             content: '请选择删除的商品',
                             skin: 'msg',
                             time: 2
                         });
                         $("del_num").text("0");
                     }

                 },
                 error: function(data) {
                     layer.open({
                         content: '删除商品失败',
                         skin: 'msg',
                         time: 2
                     });
                 }
             })
         } else if ($(".bdbtm.active").text().trim() == "商店") {
             $.ajax({
                 type: "POST",
                 url: del_business[conf],
                 //dataType: "jsonp",
                 // jsonp: "jsoncallback",
                 traditional: true,
                 data: { id: checkList, token: token()  },
                 cache: false,
                 success: function(data) {
                     var s_checked = $(".tabs .active input[name='my-radio']:checked");
                     if (s_checked.length > 0) {
                         layer.open({
                             content: '删除店铺成功',
                             skin: 'msg',
                             time: 2
                         });
                         s_checked.parent().parent().remove();
                         getshoplist();
                     } else {
                         layer.open({
                             content: '请选择删除的店铺',
                             skin: 'msg',
                             time: 2
                         });
                         $("del_num").text("0");
                     }
                 },
                 error: function(data) {
                     layer.open({
                         content: '删除店铺失败',
                         skin: 'msg',
                         time: 2
                     });
                 }
             })
         }
     });

     $(".tabs").on("click", ".cancelCollect", function(event) {
         del_obj = $(event.currentTarget).parent().parent().parent();
         var cancel_goodli = $(del_obj.parent()).find("li").length;
         var cancel_shopli = $(del_obj.parent().parent().parent()).find("li").length;
         if ($(".bdbtm.active").text().trim() == "商品") {
             cancel_good(del_obj);
             if (cancel_goodli > "1") {
                 $("#good").show();
                 //$(".no-shop").hide();
             } else if (cancel_goodli == "1") {
                 $("#good").hide();
                 $(".no-good").removeClass("hidden");
             }
         } else {
             cancel_business(del_obj);
             if (cancel_shopli > "1") {
                 $("#shop").show();
                 //$(".no-shop").hide();
             } else if (cancel_shopli == "1") {
                 $("#shop").hide();
                 $(".no-shop").removeClass("hidden");
             }
         }
     })



     //初始化时加载商品
     if ($(".bdbtm.active").text().trim() == "商品") {
         //加载时显示有无商品
         if ($(".good li").length == 0) {
             $(".no-good").show();
             $(".editor").show();
             $(".no-shop").hide();
             $(".foot-all").hide();
             $(".complete").hide();
         }
     } else if ($(".bdbtm.active").text().trim() == "商店") {
         //加载时显示有无商品
         if ($(".shop li").length == 0) {
             $(".no-shop").show();
             $(".editor").show();
             $(".no-good").hide();
             $(".foot-all").hide();
             $(".complete").hide();
         }
     }

     //选项卡切换 
     $(".tab-link").on("click", function() {
         $(".foot-all").hide();
         $(".editor").show();
         $(".complete").hide();
         $(".media").hide();
         $(".item-inner").removeClass("item-inner-p");
         $(".cancelCollect").show();
         if ($(".bdbtm.active").text().trim() == "商品" && $(".good li").length == 0) {
             $(".no-shop").show();
         } else if ($(".bdbtm.active").text().trim() == "商店" && $(".shop li").length == 0) {
             $(".no-good").show();
         }
     })

     //编辑
     $(".editor").on("click", function() {
         $(".editor").hide();
         $(".complete").show();
         $(".foot-all").show();
         $(".media").show();
         $(".del_num").text("0");
         var mingcheng = $(".bdbtm.active").text().trim();
         $("input[type='checkbox']").prop("checked", false);
         if (mingcheng == "商品") {
             //添加效果
             $("#tab1 .item-inner").addClass("item-inner-p");
             $(".foot-all .foot-btn").addClass("slideInUp");
             $(".foot-all .foot-btn").removeClass("slideOutDown");
             $(".foot-all .foot-btn").addClass("animated");
             $(".good").show();
             $("#tab2 .media").hide();
             $("#tab1 .cancelCollect").hide();
         } else if (mingcheng == "商店") {
             //$(".editor").attr("disabled","true");
             $(".shop").show();
             $("#tab2 .item-inner").addClass("item-inner-p");
             $("#tab1 .item-inner").addClass("item-inner-r");
             $(".foot-all .foot-btn").addClass("slideInUp");
             $(".foot-all .foot-btn").removeClass("slideOutDown");
             $(".foot-all .foot-btn").addClass("animated");
             $("#tab2 .cancelCollect").hide();

         }
     });
     //点击标签页切换

     //完成
     $(".complete").on("click", function() {
         $(".editor").show();
         $(".complete").hide();
         $(".foot-all").hide();
         if ($(".bdbtm.active").text().trim() == "商品") {
             //移除效果
             $("#tab1 .item-inner").removeClass("item-inner-p");
             $(".foot-all .foot-btn").addClass("slideOutDown");
             $(".foot-all .foot-btn").removeClass("slideInUp");
             $(".foot-all .foot-btn").addClass("animated");
             $("#tab1 .cancelCollect").show();
             //          $(".good").hide();
         } else if ($(".bdbtm.active").text().trim() == "商店") {
             $("#tab2 .item-inner").removeClass("item-inner-p");
             $("#tab2 .cancelCollect").show();
             $(".shop").show();
         }
     });
 })
