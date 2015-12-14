 angular.module('Index',[])
	.controller('editController',
		function($scope , $http , $location){
			WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'修改餐馆');
			angular.element('#header').scope().back=function(){
				var url = '#/web/restaurant';				
				toNewHref(url);
			};
			httpGet($http,'/restaurant/list',
				function(response){
					$scope.Info = response.restaurantList[0];
					$scope.name = $scope.Info.name;
					$scope.contact = $scope.Info.realname;
					$scope.phone = $scope.Info.telephone;
				},
				function(errno,errmsg){

			});

		    $scope.restaurantEdit = function(){
		    	if(!CheckNull($scope.name,'请填写餐馆名称')) return;
		    	if(!CheckNull($scope.contact,'请填收货人')) return;
		    	if(!CheckNull($scope.phone,'请填写手机号')) return;
			    if($scope.phone.length != 11){
			        var args = {
			            'title':'请填写规范号码',
			            'true_word':'确定',
			            'false_word':'取消',
			            'phone':'',
			            'type':''
			        }
			        Myconfirm($.toJSON(args));
			        return;
			    }
			    var json={
	    			'id':$scope.Info.id,
				    'name':$scope.name,
				    'realname':$scope.contact,
				    'telephone':$scope.phone

	    		}
		    	httpPost($http,'/restaurant/update',json,
					function(response){
						var backurl = '#/web/restaurant';
						toBackHref(backurl);
					},
					function(errno,errmsg){
				});
		    }
	});