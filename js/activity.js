angular.module('Index',[])
	.controller('activityController',
		function($scope,$http,$timeout,$cookieStore){
			$('.header-info').find('[tag = add-button]').remove();
			HeaderShow($('.normal'),'活动规则');
			angular.element('#header').scope().back=function(){
				$cookieStore.remove('ac');
				toBackHref('#/web/main');
			};
	})
	.directive('activity',
		function($timeout,$http,$cookieStore){
			var url = $cookieStore.get('ac').split(':')[2].split('/')[1];
		    return {
		        restrict: 'A',
		    	templateUrl : '../activitys/'+url
	    	};
	});