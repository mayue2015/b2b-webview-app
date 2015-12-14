angular.module('Index',[])
	.controller('carController',
		function($scope,$http,$location,$cookieStore,$rootScope){
			WeixinAction($scope,$http,0);
			$rootScope.http = $http;
			angular.element('#header').scope().back=function(){
				var backurl = $location.search()['backUrl'];
				if($location.search()['prevUrl']){
					backurl = $location.search()['prevUrl'];
				}
				toBackHref(backurl);
			};
			HeaderShow($('.normal'),'购物车');
			httpGet($http,'/api/banner',
				function(response){
					$scope.shoppingTip = response.shoppingTip;
				},
				function(errno,errmsg){

			});
			ESetCarList($scope,$http,$location,$cookieStore);
	})
	.directive('eScript',
		function($timeout,$http){
		    return {
		        restrict: 'A',
		        controller:function($scope,$http){
		        	if ($scope.$last === true) {
		                $timeout(function(){
		                   ECheckCarNumber($scope,$http);
		                   Myloading(false);
		                });
		            }
		        }
	    	};
	});

function ESetCarList($scope,$http,$location,$cookieStore){
	Myloading(true);
	httpGet($http,'/cart/list',
		function(response){
			if(response.cartList.length <= 0){
				$scope.noCar = true;
				$scope.toMain = function(){
					toBackHref('#/web/category');
				}
				Myloading(false);
			}else{
				GetCarInfo($scope,$http,function(scope,http,data){
					var datas = $.evalJSON(data);
					$scope.carInfo = datas;
				});
				$scope.hasCar = true;
				ESetButton($scope,$location);
				$scope.carList = response.cartList;
				$scope.shippingFeeLimit = response.shippingFeeLimit;
				//$scope.chose_item='e-car-select-chose';
				$scope.item_length=$scope.carList.length;
				$scope.chose_length=0;
				$scope.changeNumber = function(target,type){
					var joinList = [];
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
					var args = {
						'id':target.list.id,
						'number':target.sum
					}
					joinList.push(args);
					var editinfo = {
						'cartList':joinList
					}
					EUpdateCar($scope,$http,editinfo);
				};
				$scope.ChoseItem = function(target){
					if(target.list.maxBuy > 0){
						if(target.chose_item == 'e-car-select-chose'){
							target.chose_item = '';
							$scope.chose_length = --$scope.chose_length;
						}else{
							target.chose_item = 'e-car-select-chose';
							$scope.chose_length = ++$scope.chose_length;
						}
						ECalculateSum($scope);
					}						
				};
				$scope.ChoseAll = function(target){
					var list = angular.element('.e-car-list-item');
					if($scope.chose_length >= $scope.item_length){
						var noneList = [];
						angular.forEach(list,function(content,index){
							var item = angular.element('#item-'+index).scope();
							if(item.list.maxBuy > 0){
								item.chose_item = '';
							}else{
								noneList.push(item.list.name);
							}
						});
						$scope.chose_length = 0;
					}else{
						var noneList = [];
						angular.forEach(list,function(content,index){
							var item = angular.element('#item-'+index).scope();
							if(item.list.maxBuy > 0){
								item.chose_item = 'e-car-select-chose';
							}else{
								noneList.push(item.list.name);
							}
						});
						$scope.chose_length = $scope.item_length;
						if(noneList.length > 0){
		                	var alt_msg = '"'+noneList[0]+'"等'+noneList.length+'件商品库存不足';
		                	if(noneList.length == 1) alt_msg = '"'+noneList[0]+'"库存不足';
		                	var args = {
								'title':alt_msg,
								'true_word':'确定',
								'false_word':'取消',
								'phone':'',
								'type':''
							}
							Myconfirm($.toJSON(args));
		                }
					}
	                ECalculateSum($scope);
				};
				$scope.toConfig = function(){
					httpGet($http,'/restaurant/json',
						function(response){
							if(response.restaurantList.length <= 0){
								var args = {
									'title':'您的餐馆尚未审核成功，请耐心等待',
									'true_word':'确定',
									'false_word':'取消',
									'phone':'',
									'type':''
								}
								Myconfirm($.toJSON(args));
							}else{
								if(angular.element('.e-car-select-chose').length <= 0){
									var args = {
										'title':'请选择要购买的商品',
										'true_word':'确定',
										'false_word':'取消',
										'phone':'',
										'type':''
									}
									Myconfirm($.toJSON(args));
								}else{
									var config = [];
									var Mylist = angular.element('.e-car-list-item');
									angular.forEach(Mylist,function(content,index){
										var item = angular.element('#item-'+index).scope();
										if($(content).find('.e-car-select').hasClass('e-car-select-chose')){
											var args = {
												'productNumber':item.list.productNumber,
												'number':item.sum
											}
											config.push(args);
										};
									});
									var args = {
										'cost':$scope.carInfo.money,
										'configList':config
									}
									$cookieStore.put("configList",args);
									var backurl = '#/web/config?backUrl='+ encodeURIComponent('#/web/car') + '&prevUrl=' + encodeURIComponent($location.search()['backUrl']);
									toNewHref(backurl);
								}
							}
						},
						function(errno,errmsg){
							
					});
				};
			}
		},
		function(errno,errmsg){
			$scope.noLogin = true;
			$scope.toLogin = function(){
				var backUrl=encodeURIComponent(location.href);
				var url='#/web/login?backUrl='+encodeURIComponent(location.href);
				toNewHref(url);
			}
			Myloading(false);
	});
}

function ECheckCarNumber(scope,http){
	var changeList = [];
	var list = angular.element('.e-car-list-item');
	angular.forEach(list,function(content,index){
		var item = angular.element('#item-'+index).scope();
		if(item.sum > item.list.maxBuy && item.list.maxBuy != 0){
			item.sum = item.list.maxBuy;
			var args = {
				'id':item.list.id,
				'number':item.sum
			}
			changeList.push(args);
		}
	});
	if(changeList.length > 0){
		var editinfo = {
			'cartList':changeList
		}
		EUpdateCar(scope,http,editinfo);
	}
}

function ECheckNumber(target){
	var joinList = [];
	var value = parseInt(target.sum);
	if(value <= 0 || isNaN(value)){
		target.sum = 1;
	}
	if(value > target.list.maxBuy && target.list.maxBuy > 0){
		target.sum = target.list.maxBuy;
	}
	if(!isNaN(value) && target.list.maxBuy > 0){
		var args = {
			'id':target.list.id,
			'number':target.sum
		}
		joinList.push(args);
		var editinfo = {
			'cartList':joinList
		}
		EUpdateCar(target,target.http,editinfo);
	}
}

function ECalculateSum(scope){
	var type = 0;
	var sum = 0;
	var cost = 0;
	var list = angular.element('.e-car-list-item');
	angular.forEach(list,function(content,index){
		var item = angular.element('#item-'+index).scope();
		if(item.chose_item != '' && item.list.maxBuy > 0){
			type++;
			sum+= parseInt(item.sum);
			cost+= parseFloat(item.list.price) * parseInt(item.sum);
		}
	});
	scope.carInfo.type = type;
	scope.carInfo.total = sum;
	scope.carInfo.money = cost.toFixed(2);
}

function ESetButton(scope,local){
	var button = {
		'remove':1,
		'id':'Eedit',
		'position':'right',
		'myclass':'',
		'info':'编辑'
	}
	AddButton($.toJSON(button),function(scope,local){
		var target = angular.element('#'+button.id).click(function(){
			var backurl = '#/web/car/edit?backUrl='+ encodeURIComponent('#/web/car') + '&prevUrl=' + encodeURIComponent(local.search()['backUrl']);
			//location.href = backurl;
			toNewHref(backurl);
		});
	},scope,local);
}

function EUpdateCar($scope,$http,paramet){
	httpPost($http,'/cart/update',
		paramet,
		function(response){
			ECalculateSum($scope);
		},
		function(errno,errmsg){

	});
}