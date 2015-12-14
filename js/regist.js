angular.module('Index',[])
	.controller('registController',
		function($scope,$http,$location){
            WeixinAction($scope,$http,0);
			HeaderShow($('.normal'),'注册');
			RGetCity($scope,$http);
			RGetRestaurant($scope,$http);
			angular.element('#header').scope().back=function(){
				$('.header-info').find('[tag = add-button]').remove();
				var backurl = '#/web/login';
				if($location.search()['backUrl']){
					backurl = backurl+'?backUrl='+encodeURIComponent($location.search()['backUrl']);
				}
                //backurl=decodeURIComponent(backurl);
				toBackHref(backurl);
			};
			$scope.registInfo={
				has:1
			};
			$scope.hasRestaurant=function(key){
				$scope.registInfo.has=key;
				if(key==1)
				{
					$scope.restaurant = true;
				}
				else
				{
					$scope.restaurant = false;
				}
			};
			$scope.getZone = function(target){
                $scope.registInfo.registId = target.cityInfo.id;
                $scope.cityName = target.cityInfo.name;
				RGetZone($scope,$http,target.cityInfo.id);
			}
            $scope.setZone = function(target){
                $scope.registInfo.zoneId = target.zoneInfo.id;
                $scope.zoneName = target.zoneInfo.name;
            }
            $scope.setType = function(target){
                $scope.registInfo.type = target.typeInfo.value;
                $scope.typeName = target.typeInfo.showValue;
            }
			$scope.regist=function(){
				CheckHasUser($scope,$http);
			};
	});

function CheckHasUser(scope,http){
    if(!CheckNull(scope.registInfo.telephone,'请填写手机号')) return;
    if(scope.registInfo.telephone.length != 11){
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
    httpPost(
        http,
        '/user/check/username',
        {
            'username':scope.registInfo.telephone
        },
        function(response){
            CheckParamet(scope,http);
        },
        function(errno,errmsg){
            var args = {
                'title':'此号已存在，请用其他号码注册',
                'true_word':'确定',
                'false_word':'取消',
                'phone':'',
                'type':''
            }
            Myconfirm($.toJSON(args));
    });
}

function CheckParamet(scope,http){
    if(!CheckNull(scope.registInfo.password,'请填写密码')) return;
    if(scope.registInfo.password.length < 6 || scope.registInfo.password.length > 12){
        var args = {
            'title':'请设置6-12位英文/数字/符号密码',
            'true_word':'确定',
            'false_word':'取消',
            'phone':'',
            'type':''
        }
        Myconfirm($.toJSON(args));
        return;
    }
    if(!CheckNull(scope.rePassword,'请确认密码')) return;
    if(scope.registInfo.password != scope.rePassword){
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
    if(scope.registInfo.has == 1){
        if(!CheckNull(scope.registInfo.name,'请填写餐馆名称')) return;
        if(!CheckNull(scope.registInfo.address,'请填写详细地址')) return;
        if(!CheckNull(scope.registInfo.realname,'请填写收货人')) return;
    }
    RegistUser(scope,http);
}

function RegistUser(scope,http){
	var json=scope.registInfo;
    httpPost(
        http,
        '/user/create',
        json,
        function(response){
            if(scope.registInfo.has == 1){
                RCreateRastaurant(scope,http);
            }else{
                toNewHref('#/web/regist/success?userTell='+scope.registInfo.telephone);
            }
        },
        function(response){}
    );
}

function RCreateRastaurant(scope,http){
    var json=scope.registInfo;
    httpPost(
        http,
        '/restaurant/create',
        json,
        function(response){
            toNewHref('#/web/regist/success?userTell='+scope.registInfo.telephone);
        },
        function(response){}
    );
}

function RGetCity(scope,http){
    httpGet(
        http,
        '/region/d2/1',
        function(response){
            scope.cityList = response.regions;
            scope.registInfo.regionId = scope.cityList[0].id;
            scope.cityName = scope.cityList[0].name;
            RGetZone(scope,http,scope.registInfo.regionId);
        },
        function(response) {
            // body...
        }
    );
}

function RGetZone(scope,http,value){
    httpGet(
        http,
        '/region/zones/'+value,
        function(response){
            scope.zoneList = response.zones;
            scope.registInfo.zoneId = scope.zoneList[0].id;
            scope.zoneName = scope.zoneList[0].name;
        },
        function(response) {

        }
    );
}

function RGetRestaurant(scope,http){
    httpGet(
        http,
        '/dict/key/4',
        function(response){
            scope.typeList = response.values;
            scope.registInfo.type = scope.typeList[0].value;
            scope.typeName = scope.typeList[0].showValue;
        },
        function(response){
        }
    );
}