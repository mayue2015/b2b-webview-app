angular.module('Index',[])
	.controller('addController',
		function($scope , $http){
			HeaderShow($('.normal'),'添加餐馆');
	});