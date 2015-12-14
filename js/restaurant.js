angular.module('Index',[])
	.controller('restaurantController',
		function($scope,$http,$location,$cookieStore){
			WeixinAction($scope,$http,0);
			Myloading(true);
			HeaderShow($('.normal'),'我的餐馆');
			$(".back").show();
			if(!isWeixin()){
				angular.element('#header').scope().back=function(){
					//$(".back").hide();
					var url='#/web/mine';
					toBackHref(url);
				};
			}else{
				$('.back').hide();
			}
			CheckLoginCookie($http,$cookieStore,function(){
				httpGet(
					$http,
					'/restaurant/list',
					function(response){
						if(response.restaurantList.length > 0){
							$scope.hasRestaurant = true;
							$scope.restaurant = response.restaurantList[0];
							if(response.restaurantList[0].status == 2){
								MSetButton($location.search()['backUrl']);
							}
							
						}
						Myloading(false);
					},
					function(response){
						Myloading(false);
						toNewHref('#/web/login?backUrl='+encodeURIComponent(location.href));
					}
				);
			});
			
	});

function MSetButton(){
	$('.header-info').find('[tag = add-button]').remove();
	var button1 = {
		'remove':1,
		'id':'Eedit',
		'position':'right',
		'myclass':'',
		'info':'编辑'
	}
	AddButton($.toJSON(button1),function(){
		$('#'+button1.id).bind('click',function(){
			var url='#/web/restaurant/edit';
			toNewHref(url);
		});
	});
}

function MatchReStatus(value){
	var status = '';
	switch(parseInt(value)){
		case 1:
			status = '待审核';
		break;

		case 2:
			status = '审核通过';
		break;

		case 3:
			status = '审核失败';
		break;
	}
}