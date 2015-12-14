angular.module('Index',[])
	.controller('mineController',
		function($scope,$http,$timeout,$cookieStore){
			Myloading(true);
			$('.header-info').find('[tag = add-button]').remove();
			HeaderShow($('.normal'),'我的');
			$(".back").hide();
			$scope.toLogin=function(){
				$(".back").show();
				var url='#/web/login';
				var backUrl=encodeURIComponent(location.href);
				url=url+'?backUrl='+backUrl;
				toNewHref(url);
			};
			$scope.call=function(value){
				var url = 'tel:'+value;
				toNewHref(url);
			};
			httpPost(
				$http,
				'/user/center',
				'',
				function(response){
					DSetButton($http,$cookieStore);
					$scope.userInfo = response;
					$scope.doLogin = true;
					if(response.telephone){
						$scope.serviceInfo = true;
					}
					$scope.changeUrl = function(value){
						var url = '';
						switch(value){
							case 1:
								url = '#/web/restaurant?backUrl='+encodeURIComponent(location.href);
							break;

							case 2:
								url = '#/web/order?backUrl='+encodeURIComponent(location.href);
							break;
						}
						toNewHref(url);
					}
					$scope.Complaints = function(){
						var args = {
							'title':'确定投诉客服？',
							'true_word':'确定',
							'false_word':'取消',
							'phone':'',
							'type':''
						}
						Myconfirm($.toJSON(args),function(){
							httpGet($http,'/user/complain/'+$scope.userInfo.adminId,
								function(response){
									Myalert('投诉成功',$timeout);
								},
								function(errno,errmsg){

							});
						});
					}
					Myloading(false);
				},
				function(errno,errmsg){
					$scope.noLogin = true;
					$scope.changeUrl = function(value){	
						var url = '';
						switch(value){
							case 1:
								url = '#/web/login?backUrl='+encodeURIComponent(location.href);
							break;

							case 2:
								url = '#/web/login?backUrl='+encodeURIComponent(location.href);
							break;
						}
						toNewHref(url);
					} 
					Myloading(false);
				}
			);
	});

function DSetButton($http,$cookieStore){
	var button1 = {
		'id':'Dlogout',
		'position':'right',
		'myclass':'',
		'info':'退出登录'
	}
	AddButton($.toJSON(button1),function(){
		angular.element('.normal').scope().rightClick = function(){
			var args = {
				'title':'确定退出登录？',
				'true_word':'确定',
				'false_word':'取消',
				'phone':'',
				'type':''
			}
			Myconfirm($.toJSON(args),function(){
				httpGet($http,'/user/logout',
					function(response){
						$cookieStore.remove('lp');
						location.reload();
					},
					function(errno,errmsg){

				});
			});
		};
	});
}