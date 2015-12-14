angular.module('Index',[])
	.controller('downloadController',
		function($scope,$http,$location){
			WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'下载App');
			$('.back').hide();
			$scope.download = function(){
				/*var url = 'http://www.canguanwuyou.cn/terminal/get/1';
				toNewHref(url);*/
			}
	});