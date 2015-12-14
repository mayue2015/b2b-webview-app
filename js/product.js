angular.module('Index',[])
	.controller('productController',
		function($scope,$http,$location,$timeout,$cookieStore){
			WeixinAction($scope,$http);
			HeaderShow($('.normal'),'');
			Myloading(true);
			angular.element('#header').scope().back=function(){
				var prevurl = '#/web/category';
				toBackHref(prevurl);
			};
			FSetButton($scope,$location);
			GetCarInfo($scope,$http,
				function(scope,http,data){
					var item = angular.element('#header');
					var datas = $.evalJSON(data);
					if(datas.total <= 0){
						$('.f-car-info').hide();
					}else{
						var total = parseInt(datas.total);
						if(total > 99){
							total = '99+';
						}
						item.find('.f-car-info').text(total).show();
					}
				},
				function(){
					angular.element('#header').find('.f-car-info').hide();
			});
			var productType = $cookieStore.get("productType");
			var cateId = productType.type;
			if(cateId == '') cateId = productType.categoryId;
			FGetCategory($scope,$http,productType.categoryId,cateId);
			FSearchName($scope,$http,cateId);
			FSetList($scope,$http,$location,$timeout,cateId,$cookieStore);
	})
	.directive('fScript',
		function($timeout,$http){
		    return {
		        restrict: 'A',
		        controller:function($scope,$http){
		        	if ($scope.$last === true) {
		                $timeout(function(){
		                   FSetStatus();
		                   Myloading(false);
		                });
		            }
		        }
	    	};
	});

function FCollectSlide(target){
		var item = $('#'+target); 
		var hammer = new Hammer(document.getElementById(target));
		hammer.on("swipeleft",function(e){
			$('.f-item-collect').css({
				'width':"0px",
				'opacity':'0'
			});
			item.find('.f-item-collect').animate({
				width:'120px',
				opacity:'1'
			},'fast');
		});
		hammer.on("swiperight",function(e){
	   		item.find('.f-item-collect').animate({
				width:'0px',
				opacity:'0'
			},'fast');
		});
}

function FSetStatus(){
	var list = angular.element('.f-product-list-item');
	angular.forEach(list,function(content,index){
		var item = angular.element('#item-'+index).scope();
		if(item.list.maxBuy <= 0){
			item.status = '暂无货';
		}
		FCollectSlide('item-'+index);
	});
}

function FGetCategory(scope,http,value,type){
	httpPost(http,'/category',
		{
			'categoryId':value
		},
		function(response){
			scope.categoryList = response.categorys[0].subCategory;
			scope.categoryId = type;
		},
		function(errno,errmsg){

	});
}

function FSetList(scope,http,location,timeout,cateId,cookie){
	Myloading(true);
	httpPost(http,'/product/list',
		{
			"categoryId":cateId,
			"brandId":scope.brandId,
			"sort":scope.sortType,
			"order":scope.sortMethod
		},
		function(response){
			if(!scope.productList) Myloading(false);
			scope.sub_chose = 'f-sumbox-nocontroller';
			scope.productList = response.rows;
			scope.brandList = response.brandList;
			angular.element('.normal').scope().selectType = function(target){

			}
			scope.sortList = function(target,value){
				switch(value){
					case 0:
						target.sortType = 'price';
						if(!target.sortMethod || target.sortMethod=='asc'){
							target.sortMethod = 'desc';
						}else{
							target.sortMethod = 'asc';
						}
					break;
					case 1:
						target.sortType = 'sellCount';
						target.sortMethod = '';
					break;
				}
				FSetList(scope,http,location,timeout,cateId);
			};
			scope.joinCar = function(target){
				var joinList = [];
				var productInfo = {
					'productNumber':target.list.productNumber,
					'number':target.sum
				};
				joinList.push(productInfo);
				var args = {
					"cartList":joinList
				}
				FJoinCar(http,args,timeout);
			};
			scope.collect = function(target){
				$('#item-'+target.$index).find('.f-item-collect').css({
					'width':"0px",
					'opacity':'0'
				});
				FCollectProduct(http,timeout,target.list.productNumber);
			};
			scope.changeNumber = function(target,type){
				var number = parseInt(target.sum);
				switch(type){
					case 0:
						if(number > 1){
							target.sum = --number;
						};
					break;

					case 1:
						if(number < target.list.maxBuy){
							target.sum = ++number;
						};
					break;
				}
			};
			scope.choseBrand = function(){
				scope.brand = !scope.brand;
				scope.category = false;
			}
			scope.selectBrand = function(target,type){
				if(type == 0){
					scope.brandId = 0;
				}else{
					scope.brandId = target.brand.id;
				}
				scope.brand = false;
				FSetList(scope,http,location,timeout,cateId);
			}
			angular.element('.normal').scope().choseCategory = function(){
				scope.category = !scope.category;
				scope.brand = false;
			}
			scope.selectCategory = function(target,type){
				var cateInfo = cookie.get('productType');
				var title = '全部';
				if(type == 0){
					scope.categoryAll = true;
					scope.categoryId = cateInfo.categoryId;
				}else{
					title = target.category.name;
					scope.categoryAll = false;
					scope.categoryId = target.category.categoryId;
				}
				scope.category = false;
				$('.header-title').html(title + '<div class="header-selectType"></div>');
				cateInfo.type = scope.categoryId;
				cookie.put('productType',cateInfo);
				FSetList(scope,http,location,timeout,scope.categoryId,cookie);
			}
			if(!getCookie('lead')){
				scope.lead = false;
				scope.closeLead= function(){
					scope.lead = true;
					setCookie('lead',true,365);
				};
			}
		},
		function(errno,errmsg){

	});
}

function FSearchName(scope,http,categoryId){
	httpGet(http,'/category/back_search/'+categoryId,
		function(response){
			var title = '全部'
			scope.categoryAll = true;
			if(response.categoryD2Name.length > 0){
				title = response.now;
				scope.categoryAll = false;
			}
			$('.header-title').html(title + '<div class="header-selectType"></div>');
		},
		function(errno,errmsg){

	});
}

function FJoinCar(http,paramet,timeout){
	httpPost(http,'/cart/add',
		paramet,
		function(response){
			Myalert('加入成功',timeout);
			var publicCar = angular.element('.public-car').scope();
			publicCar.publics = response;
			var item = angular.element('#header');
			if(response.total <= 0){
				$('.f-car-info').hide();
			}else{
				var total = parseInt(response.total);
				if(total > 99){
					total = '99+';
				}
				item.find('.f-car-info').text(total).show();
			}
		},
		function(errno,errmsg){
			var args = {
				'title':'您注册后就可以直接下单！',
				'true_word':'注册',
				'false_word':'登录',
				'phone':'400-898-1100',
				'type':1
			}
			Mainconfirm($.toJSON(args),function(){
				toNewHref('#/web/regist?backUrl='+encodeURIComponent(location.href));
			},
			function(){
				toNewHref('#/web/login?backUrl='+encodeURIComponent(location.href));
			});
		});
}

function FCheckNumber(target){
	var value = parseInt(target.sum);
	if(value <= 0 || isNaN(value)){
		target.sum = 1;
	}
	if(value > target.list.maxBuy){
		target.sum = target.list.maxBuy;
	}
}

function FCollectProduct($http,$timeout,value){
	httpOther($http,'/api/favorite?skuId='+value,'PUT',
		{},
		function(response){
			Myalert('收藏成功',$timeout);
		},
		function(errno,errmsg){
			var collectList = [];
			var nativeCollect = {};
			if(getCookie('nativeCollect')){
				var flag = true;
				nativeCollect = $.evalJSON(getCookie('nativeCollect'));
				$.each(nativeCollect.list,function(index,content){
					if(content == value){
						flag = false;
						return false;
					}
				});
				if(flag) nativeCollect.list.push(value);
			}else{
				collectList.push(value);
				nativeCollect = {
					'list':collectList
				}
			}
			setCookie('nativeCollect',$.toJSON(nativeCollect),365);
			Myalert('收藏成功',$timeout);
	});
}

function FSetButton(target,local){
	var button1 = {
		'id':'Fcar',
		'position':'right',
		'myclass':'f-add-car',
		'info':'<div class="f-car-info">0</div>'
	}
	AddButton($.toJSON(button1),function(){
		$('#'+button1.id).bind('click',function(){
			var backurl = encodeURIComponent(location.href);
			var url='#/web/car?backUrl=' + backurl;
			toNewHref(url);
		});
	});
	var button2 = {
		'remove':1,
		'id':'Fsearch',
		'position':'right',
		'myclass':'f-add-search',
		'info':''
	}
	AddButton($.toJSON(button2),function(){
		$('#'+button2.id).bind('click',function(){
			var backUrl=encodeURIComponent('#'+location.href.split('#')[1]);
			var url="#/web/search?backUrl="+backUrl;
			toNewHref(url);
		});
	});
}