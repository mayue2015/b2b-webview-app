angular.module('Index',[])
	.controller('listeditController',
		function($scope,$http,$location,$cookieStore,$rootScope){
			WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'常购清单编辑');
			$rootScope.http = $http;
			angular.element('#header').scope().back=function(){
				var backurl = $location.search()['backUrl'];
				if($location.search()['prevUrl']){
					backurl = $location.search()['prevUrl'];
				}
				toBackHref(backurl);
			};
			
			httpGet($http,'/api/favorite',
				function(response){
					$scope.myList = response.favorites;
					$scope.List = true;
					$scope.item_length=$scope.myList.length;
					$scope.chose_length=0;
					SetCollectList($scope,$http,$location,$cookieStore,1);
				},
				function(errno,errmsg){
					if(getCookie('nativeCollect')){
						$scope.chose_length=0;
						var productList = [];
				    	angular.forEach($.evalJSON(getCookie('nativeCollect')).list,function(content,index){
				    		httpGet($http,'/product/get/'+content,
								function(response){
									var args = {
										'productNumber':content,
										'count':0,
										'quantity':0,
										'salePrice':response.price,
										'sku':{
											'mediaFileUrl':response.imageList[0],
											'name':response.name,
											'marketPrice':response.marketPrice
										}
									}
									productList.push(args);
									$scope.item_length=productList.length;
								},
								function(errno,errmsg){

							});
				    	});	
						$scope.myList = productList;
						$scope.List = true;
						SetCollectList($scope,$http,$location,$cookieStore,0);
					}
			});
	})
	.directive('hScript',
		function($timeout,$http){
		    return {
		        restrict: 'A',
		        controller:function($scope,$http){
		        	if ($scope.$last === true) {
		                $timeout(function(){
		                   //ECheckCarNumber($scope,$http);
		                   Myloading(false);
		                });
		            }
		        }
	    	};
	});

function SetCollectList($scope,$http,$location,$cookieStore,status){
	$scope.ChoseItem = function(target,index){
		if(target.chose_item == 'ed-buy-select-chose'){
			target.chose_item = '';
			$scope.chose_length = --$scope.chose_length;
		}else{
			target.chose_item = 'ed-buy-select-chose';
			$scope.chose_length = ++$scope.chose_length;
		}
	};
	$scope.ChoseAll = function(){
		var list = angular.element('.ed-list-list-item');
		if($scope.chose_length >= $scope.item_length){
			angular.forEach(list,function(content,index){
				var item = angular.element('#item-'+index).scope();
				item.chose_item = '';
			});
			$scope.chose_length = 0;
		}else{
			angular.forEach(list,function(content,index){
				var item = angular.element('#item-'+index).scope();
				item.chose_item = 'ed-buy-select-chose';
			});
			$scope.chose_length = $scope.item_length;
		}
	};
	$scope.deleteCar = function(){
		var args = {
			'title':'确定删除？',
			'true_word':'确定',
			'false_word':'取消',
			'phone':'',
			'type':''
		}
		if(status == 1){
			Myconfirm($.toJSON(args),function(){
				var deleteList = '?skuId=';
				var productList = $('.ed-buy-select-chose');
				angular.forEach(productList,function(content,index){
					var target = $(content).parent().attr('id');
					var item = angular.element('#'+target).scope();
					if(index == 0){
						deleteList+= item.list.sku.id;
					}else{
						deleteList+= ',' + item.list.sku.id;
					}
				});
				DeleteCollect($scope,$http,deleteList);
			});
		}else{
			Myconfirm($.toJSON(args),function(){
				var collectList = [];
				var collects = $('.ed-chose-icon');
				var sum = collects.length;
				angular.forEach(collects,function(content,index){
					var target = $(content).parent().attr('id');
					var item = angular.element('#'+target).scope();
					if(!$(content).hasClass('ed-buy-select-chose')){
						collectList.push(item.list.productNumber);
						var nativeCollect = {
							'list':collectList
						}
						setCookie('nativeCollect',$.toJSON(nativeCollect),365);
					}else{
						if(--sum <= 0){
							setCookie('nativeCollect','',-1);
						}
					}
				});
				toBackHref('#/web/list');
			});
		}
	};
	Myloading(false);
}

function DeleteCollect($scope,$http,deleteList){
	httpOther($http,'/api/favorite'+deleteList,'DELETE',
		{},
		function(response){
			toBackHref('#/web/list');
		},
		function(errno,errmsg){
			
		}) ;
}