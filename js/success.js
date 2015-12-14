angular.module('Index',[])
	.controller('successController',
		function($scope,$http,$location){
			WeixinAction($scope,$http,0);
			$('.back').hide();
			HeaderShow($('.normal'),'提交成功');
			$scope.userPhone = $location.search()['userTell'];
			$scope.toMain = function(){
				toBackHref('#/web/category');
			}
	});