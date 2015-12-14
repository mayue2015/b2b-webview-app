angular.module('Index',[])
	.controller('orderController',
		function($scope,$http,$location,$cookieStore){
			WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'我的订单');
			Myloading(true);
			if(!isWeixin()){
				angular.element('#header').scope().back=function(){
					var url='#/web/mine';
					toBackHref(url);
				};
			}else{
				$('.back').hide();
			}
			CheckLoginCookie($http,$cookieStore,function(){
				OSetOrderList($scope,$http);
				$scope.sortList=function(target,value){
					target.sortType = value;
					OSetOrderList($scope,$http);
				}
			});
	})
	.directive('oScript',
		function($timeout,$http){
		    return {
		        restrict: 'A',
		        controller:function($scope,$http){
		        	if ($scope.$last === true) {
		                $timeout(function(){
		                	var list = angular.element('.o-order-item');
							angular.forEach(list,function(content,index){
								var item = angular.element('#order-'+index).scope();
								item.orderStatus = MatchStatus(item.order.status);
							});
		                    Myloading(false);
		                });
		            }
		        }
	    	};
	});

function OSetOrderList($scope,$http){
	httpPost($http,'/order/list',
		{
        	'status':$scope.sortType
        },
        function(response){
        	$scope.orderList = response.rows;
        	
			$scope.toDetail = function(value){
				var url='#/web/order/detail?orderNumber='+ value;
				toNewHref(url);
			}
			Myloading(false);
        },
        function(errno,errmsg){
        	Myloading(false);
        	toNewHref('#/web/login?backUrl='+encodeURIComponent(location.href));
    });
}