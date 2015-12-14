angular.module('Index',[])
	.controller('configController',
		function($scope,$http,$location,$cookieStore){
			WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'确认订单');
			Myloading(true);
			angular.element('#header').scope().back=function(){
				var backurl = $location.search()['backUrl'];
				if($location.search()['prevUrl']){
					backurl+= '?backUrl=' + encodeURIComponent($location.search()['prevUrl']);
				}
				$cookieStore.remove("configList");
				toBackHref(backurl);
			};
			var data = $cookieStore.get('configList');
	    	if($.trim(data).length <= 0){
	    		toBackHref('#/web/category');
	    		return;
	    	}
	    	var productList = [];
	    	angular.forEach(data.configList,function(content,index){
	    		httpGet($http,'/product/get/'+content.productNumber,
					function(response){
						var args = {
							'name':response.name,
							'money':response.price,
							'url':response.imageList[0],
							'number':content.number,
						}
						productList.push(args);
					},
					function(errno,errmsg){

				});
	    	});
	    	$scope.productInfo = productList;
			httpGet($http,'/restaurant/json',
				function(response){
					$scope.userInfo = response.restaurantList[0];
			    	
			    	GetSystemInfo($scope,$http,function(response){
			    		var cost = data.cost;
			    		var fee = 0;
			    		if(cost < response.shippingFeeLimit){
			    			fee = response.shippingFee;
			    			cost+= fee;
			    		}
			    		$scope.cost = cost;
			    		$scope.sendCost = fee;
			    		var now = new Date();
						var hours = now.getHours();
						var line = response.orderSyncTime;
						var days = 1;
						if(hours > line){
							days = 2;
						}
						var new_date = new Date(now.getTime() + 1000*60*60*24*days);
						var year = new_date.getFullYear();
						var month = new_date.getMonth()+1;
						var day = new_date.getDate();
						month = CheckTime(month);
						day = CheckTime(day);
						$scope.sendTime = year + '-' + month + '-' + day;
			    	});
			    	$scope.upOrder = function(){
			    		var args = {
							'title':'确认提交订单？',
							'true_word':'确定',
							'false_word':'取消',
							'phone':'',
							'type':''
						}
						Myconfirm($.toJSON(args),function(){
							var products = [];
				    		angular.forEach(data.configList,function(content,index){
				    			var args = {
				    				'productNumber':content.productNumber,
				    				'number':content.number
				    			}
				    			products.push(args);
				    		});
				    		httpPost($http,'/order/create',
					    		{
					    			'restaurantId':$scope.userInfo.id,
					    			'productList':products,
					    			'fromCart':1
					    		},
					    		function(response){
					    			$cookieStore.remove("configList");
					    			toNewHref('#/web/order/detail?orderNumber='+response.orderNumber+'&from=1');
					    		},
					    		function(errno,errmsg){

					    	});
						});
			    	}
			    	Myloading(false);
				},
				function(errno,errmsg){

			});
	});