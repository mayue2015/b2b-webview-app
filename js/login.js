angular.module('Index',[])
	.controller('loginController',
		function($scope,$http,$location,$cookieStore){
			WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'登录');
			$('.header-info').find('[tag = add-button]').remove();
			if($cookieStore.get('ln')){
				$scope.username = $cookieStore.get('ln');
			}
			var url=$location.search()['backUrl'];
			angular.element('#header').scope().back=function(){
				var url=$location.search()['backUrl'];
				if(url.length>0){
					url=decodeURIComponent(url);
					var position=url.indexOf('backUrl=')+8;
					if(position>=0)
					{
						backUrl=encodeURIComponent(url.substr(position));
						if(backUrl.indexOf('backUrl')<=0)
							backUrl=decodeURIComponent(backUrl);
						url=url.substr(0,position)+backUrl;
					}
				}
				else
				{
					url='#/web/category';
					//url='#/web/main';
				}
				toBackHref(url);
			};

			$scope.regist=function(){
				var url='#/web/regist';
				var backUrl=$location.search()['backUrl'];
				url=url+'?backUrl='+encodeURIComponent(backUrl);
				toNewHref(url);
			};
			$scope.main=function(){
				toBackHref('#/web/category');
			};
			$scope.forget=function(){
				toNewHref('#/web/forget');
			};

			$scope.login = function(){
				if(CheckNull($scope.logininfo.username) && CheckNull($scope.logininfo.password)){
					httpPost($http,'/user/login',
						$scope.logininfo,
						function(response){
							var url=$location.search()['backUrl'];
							if(url.length>0){
								url=decodeURIComponent(url);
								var position=url.indexOf('backUrl=')+8;
								if(position>=0)
								{
									backUrl=encodeURIComponent(url.substr(position));
									if(backUrl.indexOf('backUrl')<=0)
										backUrl=decodeURIComponent(backUrl);
									url=url.substr(0,position)+backUrl;
								}
							}
							else
							{
								url='#/web/category';
								//url='#/web/main';
							}
							setCookie('ln',encodeURIComponent($scope.logininfo.username),365);
							setCookie('lp',encodeURIComponent($scope.logininfo.password),365);
							LoginActivity($http,$cookieStore,url);
						},
						function(errno,errmsg){
							var args = {
								'title':errmsg,
								'true_word':'确定',
								'false_word':'取消',
								'phone':'',
								'type':''
							}
							Myconfirm($.toJSON(args));
					});
				}
			};
	});

function LoginActivity($http,$cookieStore,url){
	httpGet($http,'/api/banner',
		function(response){
			$cookieStore.remove('activety');
			CheckEnter($cookieStore,response.welcomeContent.welcomeTitle,response.welcomeContent.welcomeMessage,
				function(){
					toBackHref(url);
			});
		},
		function(errno,errmsg){
			Myloading(false);
	});
}