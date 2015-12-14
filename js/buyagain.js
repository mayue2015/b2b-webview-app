angular.module('Index',[])
	.controller('buyagainController',
		function($scope,$http,$location,$cookieStore,$timeout){
			WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'再次购买');
			
			angular.element('#header').scope().back=function(){
				var url=$location.search()['backUrl'];
				var backurl = decodeURIComponent(url);
				toBackHref(backurl);
			};
			if($location.search()['orderNumber']){
				httpGet($http,'/order/get/'+$location.search()['orderNumber'],
			        function(response){
			        	var buyList = [];
		        		angular.forEach(response.orderDetail,function(content,index){
							var args = {
								'id':content.productNumber,
								'name':content.name,
								'salePrice':content.price,
								'url':content.url
							}
							buyList.push(args);
						});
						var buyInfo = {
							'buyList':buyList
						}
			        	ISetBuyList($scope,$http,$location,$cookieStore,$timeout,buyInfo);
			        },
			        function(errno,errmsg){

			    });
			}else{
				httpGet($http,'/api/favorite',
					function(response){
						var buyList = [];
						angular.forEach(response.favorites,function(content,index){
							var args = {
								'id':content.sku.productId,
								'name':content.sku.name,
								'salePrice':content.salePrice,
								'url':content.sku.mediaFileUrl/*,
								'maxBuy':content.maxBuy*/
							}
							buyList.push(args);
						});
						var buyInfo = {
							'buyList':buyList
						}
						ISetBuyList($scope,$http,$location,$cookieStore,$timeout,buyInfo);
					},
					function(errno,errmsg){
						
				});
			}
			
	})
	.directive('iScript',
		function($timeout){
		    return {
		        restrict: 'A',
		        link: function($scope,$element,$attr) {
		            if ($scope.$last === true) {
		                $timeout(function($scope){
		                   
		                });
		            }
		        }
	    	};
	});

function ISetBuyList($scope,$http,$location,$cookieStore,$timeout,response){
	$scope.buyList = response.buyList;
	$scope.item_length=$scope.buyList.length;
	$scope.chose_length=$scope.buyList.length;
	$scope.chose_item = 'i-buy-select-chose';
	$scope.changeNumber = function(target,type){
		var number = parseInt(target.sum);
		switch(type){
			case 0:
				if(number > 1){
					target.sum = --number;
				};
			break;

			case 1:
				if(number < /*target.maxBuy*/999){
					target.sum = ++number;
				};
			break;
		}
	};
	$scope.ChoseItem = function(target,index){
		if(target.chose_item == 'i-buy-select-chose'){
			target.chose_item = '';
			$scope.chose_length = --$scope.chose_length;
		}else{
			target.chose_item = 'i-buy-select-chose';
			$scope.chose_length = ++$scope.chose_length;
		}
	};
	$scope.ChoseAll = function(){
		var list = angular.element('.i-buy-list-item');
		if($scope.chose_length >= $scope.item_length){
			angular.forEach(list,function(content,index){
				var item = angular.element('#item-'+index).scope();
				item.chose_item = '';
			});
			$scope.chose_length = 0;
		}else{
			angular.forEach(list,function(content,index){
				var item = angular.element('#item-'+index).scope();
				item.chose_item = 'i-buy-select-chose';
			});
			$scope.chose_length = $scope.item_length;
		}
	};
	$scope.JoinCar = function(){
		var joinList = [];
		var productList = $('.i-buy-select-chose');
		angular.forEach(productList,function(content,index){
			var target = $(content).parent().attr('id');
			var item = angular.element('#'+target).scope();
			var args = {
				'productNumber':item.list.id,
				'number':item.sum
			}
			joinList.push(args);
		});
		if(joinList.length > 0){
			var info = {
				"cartList":joinList
			}
			IJoinCar($http,info,$timeout);
		}
	};
}

function IJoinCar(http,paramet,timeout){
	httpPost(http,'/cart/add',
		paramet,
		function(response){
			var publicCar = angular.element('.public-car').scope();
			publicCar.publics = response;
			$('.f-car-info').text(response.total).show();
			var url='#/web/car?backUrl='+ encodeURIComponent('#/web/list');
	        toNewHref(url);
		},
		function(errno,errmsg){
			var args = {
				'title':'采购商品请先注册，或联系我们',
				'true_word':'登录',
				'false_word':'注册',
				'phone':'400-898-1100',
				'type':1
			}
	        Myconfirm($.toJSON(args),function(){
	        	var url='#/web/login?backUrl='+ encodeURIComponent(location.href);
	        	toNewHref(url);
	        },
	        function(){
	        	var url='#/web/regist?backUrl='+ encodeURIComponent(location.href);
	        	toNewHref(url);
	    });
	});
}

function ICheckNumber(target){
	var joinList = [];
	var value = parseInt(target.sum);
	if(value <= 0 || isNaN(value)){
		target.sum = 1;
	}
	if(value > 999){
		target.sum = 999;
	}
}