angular.module('Index',[])
	.controller('serviceController',
		function($scope,$http,$location,$cookieStore){
			Myloading(true);
			WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'我的客服');
			$('.back').hide();
			CheckLoginCookie($http,$cookieStore,function(){
				ServiceInfo($http,$scope)
			
				$scope.toLogin=function(){
					var backUrl=window.location.href;
					var url='#/web/login';
					url=url+'?backUrl='+encodeURIComponent(backUrl);
					toNewHref(url);
				};
				$scope.toRegist=function(){
					var backUrl=window.location.href;
					var url='#/web/regist';
					url=url+'?backUrl='+encodeURIComponent(backUrl);
					toNewHref(url);
				};
				$scope.toCall=function(value){
					var url='tel:'+value;
					toNewHref(url);
				};
			});
		}
);

function ServiceInfo($http,$scope){
	httpPost(
		$http,
		'/user/center',
		'',
		function(response){
			$scope.doLogin = true;
			$scope.service = response;
			Myloading(false);
		},
		function(errno,errmsg){
			$scope.doLogin = false;
			Myloading(false);
		}
	);
}