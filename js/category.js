angular.module('Index',[])
	.controller('categoryController',
		function($scope,$http,$location,$rootScope,$cookieStore){
			WeixinAction($scope,$http);
			if(isWeixin()){
				CGetService($http,$scope);
			}
			HeaderShow($('.normal'),'调料');
			$('.back').hide(); 
			Myloading(true);
			GetCarInfo($scope,$http,
				function(scope,http,data){
					scope.doLogin = false;
				},
				function(){
					
			});
			$scope.toSearch=function(){
				var backUrl=encodeURIComponent('#/web/category');
				var url="#/web/search?backUrl="+backUrl;
				toNewHref(url);
			};
			httpPost($http,'/category',
				{
					'all':1
				},
				function(response){
					$scope.categoryList = response.categorys[0].subCategory;
					var productCookie = $cookieStore.get("productType");
					if(productCookie){
						$scope.categoryId = productCookie.categoryId;
						$scope.type = productCookie.type;
						var index = CheckIndex($.toJSON(response.categorys[0].subCategory),productCookie.categoryId);
						$scope.detailList = response.categorys[0].subCategory[index].subCategory;
					}else{
						$scope.categoryId = response.categorys[0].subCategory[0].categoryId;
						$scope.detailList = response.categorys[0].subCategory[0].subCategory;
					}

					$scope.ChoseCategory = function(target){
						$scope.type = null;
						$scope.categoryId = response.categorys[0].subCategory[target.index].categoryId;
						$scope.detailList = response.categorys[0].subCategory[target.index].subCategory;
					}

					$rootScope.ChoseType = function(target,value){
						if(value == 0){
							$scope.type = '';
						}else{
							$scope.type = target.c_detailList.categoryId;
						}
						var productType = {
							'categoryId':$scope.categoryId,
							'type':$scope.type
						}
						$cookieStore.put("productType",productType);
						$(".back").show();
						var backUrl=encodeURIComponent('#/web/category');
						var url='#/web/product?backUrl='+backUrl;
						toNewHref('#/web/product');
					}
				},
				function(errno,errmsg){

			});
	})
	.directive('cScript',
		function($timeout){
		    return {
		        restrict: 'A',
		        link: function($scope,$element,$attr) {
		            if ($scope.$last === true) {
		                $timeout(function(){
							Myloading(false);
		                });
		            }
		        }
	    	};
	});

function CheckIndex(datas,value){
	var list = $.evalJSON(datas);
	var position;
	angular.forEach(list,function(content,index){
		if(value == content.categoryId){
			position = index;
			return false;
		}
	});

	return position;
}

function CGetService($http,$scope){
	httpPost(
		$http,
		'/user/center',
		'',
		function(response){
			CSetButton($scope,$http,true,response.telephone);
		},
		function(errno,errmsg){
			CSetButton($scope,$http,false);
		}
	);
}

function CSetButton($scope,$http,value,phone){
	var button1 = {
		'id':'Cservice',
		'position':'right',
		'myclass':'c-service-icon',
		'info':''
	}
	AddButton($.toJSON(button1),function(){
		angular.element('.normal').scope().rightClick = function(){
			if(value && phone){
				var args = {
					'title':'确定要拨打的客服专员电话',
					'true_word':'拨打',
					'false_word':'取消',
					'phone':phone,
					'type':''
				}
				Myconfirm($.toJSON(args),function(){
					toNewHref('tel:'+phone+'');
				});
			}else{
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
		};
	});
}