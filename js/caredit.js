angular.module('Index',[])
	.controller('careditController',
		function($scope,$http,$location){
			WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'购物车编辑');
			Myloading(true);
			angular.element('#header').scope().back=function(){
				var backurl = $location.search()['backUrl'];
				if($location.search()['prevUrl']){
					backurl+= '?prevUrl=' + encodeURIComponent($location.search()['prevUrl']);
				}
				toBackHref(backurl);
			};
			httpGet($http,'/cart/list',
				function(response){
					$scope.carList = response.cartList;
					$scope.chose_item='i-buy-select-chose';
					$scope.item_length=$scope.carList.length;
					$scope.chose_length=$scope.carList.length;
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
						var list = angular.element('.car-buy-list-item');
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
					$scope.deleteCar = function(){
						var args = {
							'title':'确定删除？',
							'true_word':'确定',
							'false_word':'取消',
							'phone':'',
							'type':''
						}
						Myconfirm($.toJSON(args),function(){
							var joinList = [];
							var productList = $('.i-buy-select-chose');
							angular.forEach(productList,function(content,index){
								var target = $(content).parent().attr('id');
								var item = angular.element('#'+target).scope();
								var args = {
									'id':item.list.id,
									'number':0
								}
								joinList.push(args);
							});
							var args = {
								'cartList':joinList
							}
							IEditCar($scope,$http,args,$location);
						},function(){
							
						});
					};
					Myloading(false);
				},
				function(errno,errmsg){

			});
	});

function IEditCar($scope,$http,paramet,$location){
	httpPost($http,'/cart/update',
		paramet,
		function(response){
			GetCarInfo($scope,$http,function($scope,$http,data){
				var datas = $.evalJSON(data);
				var backurl = $location.search()['backUrl'];
				if($location.search()['prevUrl']){
					backurl+= '?prevUrl=' + encodeURIComponent($location.search()['prevUrl']);
				}
				toBackHref(backurl);
			});
		},
		function(errno,errmsg){

	});
}