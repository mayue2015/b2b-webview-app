angular.module('Index',[])
	.controller('orderDetailController',
		function($scope,$http,$location,$timeout){
			WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'订单详情');
			Myloading(true);
			angular.element('#header').scope().back=function(){
				var url = '#/web/order';
				if($location.search()['from'] == 1){
					url = '#/web/category';
				}
				if($location.search()['from'] == 2){
					url = '#/web/main';
				}
				
				toBackHref(url);
			};
			httpGet($http,'/order/get/'+$location.search()['orderNumber'],
		        function(response){
		        	$scope.order=response;
		        	$scope.orderStatus = MatchStatus($scope.order.status);
		        	
		        	GetSystemInfo($scope,$http,function(data){
		        		var time = response.createTime;
						var line = data.orderSyncTime;
						var time_list1 = time.split('-');
						var time_list2 = time_list1[2].split(' ');
						var time_list3 = time_list2[1].split(':');
						now = new Date(time_list1[0],parseInt(time_list1[1]) - 1,time_list2[0]);
						hours = time_list3[0];
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
		        		Myloading(false);
					});
		        	$scope.orderCancel = function(){
		        		var args = {
							'title':'确定撤消该订单？',
							'true_word':'确定',
							'false_word':'取消',
							'phone':'',
							'type':''
						}
						Myconfirm($.toJSON(args),function(){
							httpGet($http,'/order/cancel/'+$location.search()['orderNumber'],
					        function(response){
					        	Myalert('订单已取消',$timeout);
					        	$scope.orderStatus = '已取消';
					        	$scope.order.status = -1;
					        },
					        function(errno,errmsg){

					    	});
						});
		        	}

		        	$scope.buyAgain = function(){
		        		var buyList=Array();
		        		angular.forEach($scope.order.orderDetail,function(content,index){
		        			var json={
		        				'number':content.number,
		        				'productNumber':content.productNumber
		        			}
		        			buyList.push(json);
		        		});
		        		var args={
		        			'cartList':buyList
		        		}
		        		ODJoinCar($http,args,$timeout);
		        		/*var buyList = [];
		        		angular.forEach(response.orderDetail,function(content,index){
							var args = {
								'id':content.productNumber,
								'name':content.name,
								'salePrice':content.price,
								'url':content.url
							}
							buyList.push(args);
						});
						var buyInfo = {
							'buyList':buyList
						}*/
						//var url='#/web/list/buyagain?backUrl='+encodeURIComponent(location.href) + '&orderNumber=' + $scope.order.orderNumber;
						//toNewHref(url);
		        	}
		        },
		        function(errno,errmsg){

		    });
	});

function ODJoinCar(http,paramet,timeout){
	httpPost(http,'/cart/add',
		paramet,
		function(response){
			//Myalert('加入成功',timeout);
			//var publicCar = angular.element('.public-car').scope();
			//publicCar.publics = response;
			//$('.f-car-info').text(response.total).show();
			var url='#/web/car?backUrl='+encodeURIComponent(window.location.href);
			toNewHref(url);
		},
		function(errno,errmsg){
			var args = {
				'title':'采购商品请先注册，或联系我们',
				'true_word':'登录',
				'false_word':'注册',
				'phone':'400-898-1100',
				'type':1
			}
	        Myconfirm($.toJSON(args),function(){
	        	var url='#/web/login?backUrl='+ encodeURIComponent(location.href);
	        	toNewHref(url);
	        },
	        function(){
	        	var url='#/web/regist?backUrl='+ encodeURIComponent(location.href);
	        	toNewHref(url);
	    });
	});
}