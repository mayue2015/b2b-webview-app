var bannerTime;
angular.module('Index',[])
	.controller('mainController',
		function($scope,$http,$location,$cookieStore,$rootScope){
			HeaderShow($('.search'),'');
			Myloading(true);
			CheckLoginCookie($http,$cookieStore,function(){
				BSetMain($scope,$http,$location,$cookieStore,true);
			},
			function(){
				BSetMain($scope,$http,$location,$cookieStore,false);
			});
	})
	.directive('bannerSlide',
		function($timeout){
		    return {
		        restrict: 'A',
		        link: function($scope,$element,$attr) {
		            if ($scope.$last === true) {
		                $timeout(function(){
		                   BannerSlide($timeout);
		                });
		            }
		        }
	    	};
	});

function BSetMain($scope,$http,$location,$cookieStore,flag){
	BGetOrder($http,$scope,$cookieStore,flag);
	BGetService($http,$scope);
	var target=angular.element('.search').scope();
	target.toSearch=function(){
		var backUrl=encodeURIComponent('#/web/main');
		var url="#/web/search?backUrl="+backUrl;
		toNewHref(url);
	}
	$scope.toCategory = function(){
		toNewHref('#/web/category');
	}
	$scope.toCar = function(){
		toNewHref('#/web/car?backUrl='+encodeURIComponent(location.href));
	}
	$scope.toActivity = function(target){
		var url = target.bannerList.redirectUrl;
		if(url){
			$cookieStore.put('ac',url);
			toNewHref('#/web/activity');
		}
	}
	$scope.toDetail = function(target){
		toNewHref('#/web/order/detail?orderNumber='+target.orderList.id+'&from=2');
	}
}

function BSetBanner($scope,$http,$cookieStore,show_alert){
	httpGet($http,'/api/banner',
		function(response){
			$scope.banners = response.banner;
			var adsList = $('.b-ads-ul').find('li');
            $('.b-ads-point-panel').find('[link = '+$(adsList[0]).attr('link')+']').addClass('b-point-chose');
            $.each($scope.banners,function(index,content){
            	if(content.redirectUrl != ''){
            		angular.element('#b-activity').scope().bannerList.redirectUrl = content.redirectUrl;
            		return false;
            	}
            });
            Myloading(false);
            if(show_alert){
            	CheckEnter($cookieStore,response.welcomeContent.welcomeTitle,response.welcomeContent.welcomeMessage);
            }
		},
		function(errno,errmsg){
			Myloading(false);
	});
}

function BGetOrder($http,$scope,$cookieStore,flag){
	httpGet($http,'/api/my-order',
		function(response){
			if(response.orders.length <= 0){
				$scope.orderNone = true;
			}else{
				$scope.Myorder = response.orders;
			}
			BSetBanner($scope,$http,$cookieStore,true);
		},
		function(errno,errmsg){
			$scope.orderNone = true;
			BSetBanner($scope,$http,$cookieStore,false);
	});
}

function BGetService($http,$scope){
	httpPost(
		$http,
		'/user/center',
		'',
		function(response){
			$scope.showService = function(){
				var showPhone = response.telephone;
				if(!showPhone) showPhone = '400-898-1100';
				var args = {
					'title':'确定要拨打的客服专员电话',
					'true_word':'拨打',
					'false_word':'取消',
					'phone':showPhone,
					'type':''
				}
				Myconfirm($.toJSON(args),function(){
					toNewHref('tel:'+showPhone+'');
				});
			}
		},
		function(errno,errmsg){
			$scope.showService = function(){
				var args = {
					'title':'您注册后就可以直接下单！',
					'true_word':'注册',
					'false_word':'登录',
					'phone':'400-898-1100',
					'type':1
				}
				Mainconfirm($.toJSON(args),function(){
					toNewHref('#/web/regist?backUrl='+encodeURIComponent(location.href));
				},
				function(){
					toNewHref('#/web/login?backUrl='+encodeURIComponent(location.href));
				});
			}
			 
		}
	);
}

function BannerChange($timeout,target){
	bannerTime = $timeout(function(){
		if($(target).next().length > 0){
			$('.b-ads-ul').animate({
	   			'marginLeft': parseFloat($('.b-ads-ul').css('margin-left')) - parseFloat($('.b-ads-ul').find('li').css('width'))
	   		},function(){
	   			$('.b-ads-point-panel').find('.b-point-chose').removeClass('b-point-chose');
	   			$('.b-ads-point-panel').find('[link = '+$(target).next().attr('link')+']').addClass('b-point-chose');
	   			BannerChange($timeout,$(target).next());
	   		});
		}else{
			$('.b-ads-ul').animate({
	   			'marginLeft': '0px'
	   		},function(){
	   			$('.b-ads-point-panel').find('.b-point-chose').removeClass('b-point-chose');
	   			$('.b-ads-point-panel').find('[link = banner-0]').addClass('b-point-chose');
	   			BannerChange($timeout,$('.b-ads-ul').find('li')[0]);
	   		});
		}
    },3000);
}

function BannerSlide($timeout){
	var adsList = $('.b-ads-ul').find('li');
	BannerChange($timeout,adsList[0]);
	$.each(adsList,function(index,content){
		var target = $(content);
		var hammer = new Hammer(content);
		if(index != 0){
			hammer.on("swiperight",function(e){
				$timeout.cancel(bannerTime);
		   		$('.b-ads-ul').animate({
		   			'marginLeft': parseFloat($('.b-ads-ul').css('margin-left')) + parseFloat($('.b-ads-ul').find('li').css('width'))
		   		},function(){
		   			$('.b-ads-point-panel').find('.b-point-chose').removeClass('b-point-chose');
		   			$('.b-ads-point-panel').find('[link = '+target.prev().attr('link')+']').addClass('b-point-chose');
		   			BannerChange($timeout,target.prev()[0]);
		   		});
			});
		}

		if(index != adsList.length-1){
			hammer.on("swipeleft",function(e){
				$timeout.cancel(bannerTime);
		   		$('.b-ads-ul').animate({
		   			'marginLeft': parseFloat($('.b-ads-ul').css('margin-left')) - parseFloat($('.b-ads-ul').find('li').css('width'))
		   		},function(){
		   			$('.b-ads-point-panel').find('.b-point-chose').removeClass('b-point-chose');
		   			$('.b-ads-point-panel').find('[link = '+target.next().attr('link')+']').addClass('b-point-chose');
		   			BannerChange($timeout,target.next()[0]);
		   		});
			});
		}
	});
}