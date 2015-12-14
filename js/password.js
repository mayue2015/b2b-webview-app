angular.module('Index',[])
	.controller('passwordController',
		function($scope,$http,$timeout,$rootScope){
		$rootScope.timeout = $timeout;
		HeaderShow($('.normal'),'找回密码');
		angular.element('#header').scope().back=function(){
			var url='#/web/login';
			toBackHref(url);
		};

		$scope.getCode = function(){
			if(!CheckNull($scope.userPhone)){
				var args = {
					'title':'请填写手机号',
					'true_word':'确定',
					'false_word':'取消',
					'phone':'',
					'type':''
				}
				Myconfirm($.toJSON(args));
				return;
			}
			if($scope.codeTime <= 0){
				PHoldeCode($timeout);
				httpPost($http,'/user/send/sms',
					{
						"telephone":$scope.userPhone
					},
					function(response){
						$scope.Mycode = response.code;
					},
					function(errno,errmsg){
						
				});
			}
		}

		$scope.showNewPassword=function(){
			if(!CheckNull($scope.userPhone)){
				var args = {
					'title':'请填写手机号',
					'true_word':'确定',
					'false_word':'取消',
					'phone':'',
					'type':''
				}
				Myconfirm($.toJSON(args));
				return;
			}
			if(!CheckNull($scope.code)){
				var args = {
					'title':'请填写验证码',
					'true_word':'确定',
					'false_word':'取消',
					'phone':'',
					'type':''
				}
				Myconfirm($.toJSON(args));
				return;
			}
			httpPost($http,'/user/check/sms',
				{
					'telephone':$scope.userPhone,
					'code':$scope.Mycode,
					'random':$scope.code
				},
				function(response){
					$scope.newPasswordFlag=true;
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
		};

		$scope.Modify=function(){
			if(!CheckNull($scope.newPwd)){
				var args = {
					'title':'请填写新密码',
					'true_word':'确定',
					'false_word':'取消',
					'phone':'',
					'type':''
				}
				Myconfirm($.toJSON(args));
				return;
			}
			if(!CheckNull($scope.repeatPwd)){
				var args = {
					'title':'请确定密码',
					'true_word':'确定',
					'false_word':'取消',
					'phone':'',
					'type':''
				}
				Myconfirm($.toJSON(args));
				return;
			}
			if(!($scope.repeatPwd == $scope.newPwd)){
				var args = {
					'title':'两次密码不同，请重新输入',
					'true_word':'确定',
					'false_word':'取消',
					'phone':'',
					'type':''
				}
				Myconfirm($.toJSON(args));
				return;
			}
			httpPost($http,'/user/forget/password',
				{
					'telephone':$scope.userPhone,
					'password':$scope.newPwd,
					'code':$scope.Mycode,
					'random':$scope.code
				}, 
				function(response){
					toBackHref('#/web/login');
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
		};
	});

function PHoldeCode(){
	var holdtime = 60;
	var item = angular.element('#p-code-button').scope();
	if(item.codeTime <= 0){
		item.codeTime = holdtime;
	}else{
		item.codeTime--;
	}
	if(item.codeTime > 0 && item.codeTime <= holdtime){
		item.codeStatus = item.codeTime + '秒后失效';
		item.timeout(PHoldeCode,1000);
	}else{
		item.codeStatus = '获取验证码';
	}
}