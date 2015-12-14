angular.module('Index',[])
	.controller('listController',
		function($scope,$http,$location,$cookieStore){
			WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'常购清单');
			$('.back').hide();
			Myloading(true);
			CheckLoginCookie($http,$cookieStore,function(){
				if(getCookie('nativeCollect')){
					var productList = [];
			    	angular.forEach($.evalJSON(getCookie('nativeCollect')).list,function(content,index){
			    		if(index < $.evalJSON(getCookie('nativeCollect')).list.length-1){
			    			HCollectProduct($scope,$http,$location,$cookieStore,content,true);
			    		}else{
			    			HCollectProduct($scope,$http,$location,$cookieStore,content,false);
			    		}
			    	});	
				}else{
					HSetList($scope,$http,$location,$cookieStore);
				}
			},
			function(){
				HSetList($scope,$http,$location,$cookieStore);
			});
	});

function HCollectProduct($scope,$http,$location,$cookieStore,value,status){
	httpOther($http,'/api/favorite?skuId='+value,'PUT',
		{},
		function(response){
			if(!status){
				$cookieStore.remove('nativeCollect');
				HSetList($scope,$http,$location,$cookieStore);
			}
		},
		function(errno,errmsg){
	});
}

function HSetList($scope,$http,$location,$cookieStore){
	httpGet($http,'/api/favorite',
		function(response){
			$scope.myList = response.favorites;
			if(response.favorites.length <= 0){
				$scope.noList = true;
				$scope.toMain = function(){
					toNewHref('#/web/category');
				}
			}else{
				HSetButton($location,$cookieStore,1);
				$scope.List = true;
			}
			Myloading(false);
		},
		function(errno,errmsg){
			if(getCookie('nativeCollect')){
				HSetButton($location,$cookieStore,0);
				var productList = [];
		    	angular.forEach($.evalJSON(getCookie('nativeCollect')).list,function(content,index){
		    		httpGet($http,'/product/get/'+content,
						function(response){
							var args = {
								'count':0,
								'quantity':0,
								'salePrice':response.price,
								'sku':{
									'mediaFileUrl':response.imageList[0],
									'name':response.name,
									'marketPrice':response.marketPrice
								}
							}
							productList.push(args);
						},
						function(errno,errmsg){

					});
		    	});	
		    	$scope.myList = productList;
		    	$scope.List = true;				    	
			}else{
				$scope.noList = true;
				$scope.toMain = function(){
					toNewHref('#/web/category');
				}
			}
			Myloading(false);
	});
}

function HSetButton(local,cookie,status){
	if(status == 1){
		var button1 = {
			'id':'Hbuyagain',
			'position':'left',
			'myclass':'h-add-buyagain',
			'info':'再次购买'
		}
		AddButton($.toJSON(button1),function(){
			$('#'+button1.id).bind('click',function(){
				var url='#/web/list/buyagain?backUrl='+encodeURIComponent(location.href);
				toNewHref(url);
			});
		});
	}

	var button2 = {
		'id':'Hedit',
		'position':'right',
		'myclass':'',
		'info':'编辑'
	}
	AddButton($.toJSON(button2),function(){
		$('#'+button2.id).bind('click',function(){
			var backurl = '#/web/list/edit?backUrl='+ encodeURIComponent(location.href);
			toNewHref(backurl);
		});
	});
}