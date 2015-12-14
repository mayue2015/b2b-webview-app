/*ios&android版本号*/
var versionIos = '1.1';
var versionAndroid = '1.3';

function toBackHref(url) {
	angular.element('.normal').scope().rightClick = function(){}
	if(!isIos() && !isWeixin())
	{
		android.goBack(url);
	}
	else
	{
		window.location.href=url;
	}
}

function toNewHref(url)
{
	angular.element('.normal').scope().rightClick = function(){}
	if(!isIos() && !isWeixin())
	{
		android.changehref(url);
	}
	else
	{
		location.href=url;
	}
}

function isIos()
{
	var browser = navigator.userAgent;
	var flag=browser.indexOf('iPhone')==-1 ? false : true;
	return flag;
}

function isWeixin(){  
    var ua = window.navigator.userAgent.toLowerCase(); 
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		return true; 
	}else{ 
		return false; 
	} 
}  

function WeixinAction($scope,$http,type){
	var publicCar = angular.element('.public-car').scope();
	publicCar.weixin = false;
	var isWX = isWeixin();
	if(isWX){
		$scope.weixin = isWX;
		$('#uiView').removeAttr('style');
		if(type != 0){
			GetCarInfo($scope,$http,function(scope,http,response){
				var data = $.evalJSON(response);
				publicCar.publics = data;
				publicCar.weixinCar = function(){
					toNewHref('#/web/car?backUrl='+encodeURIComponent(location.href));
				}
			},
			function(scope,http,errmsg){
				publicCar.weixinCar = function(){
					toNewHref('#/web/car?backUrl='+encodeURIComponent(location.href));
				}
			});
			$('#uiView').css('padding','0px 0px 114px 0px');
			publicCar.weixin = isWX;
		}
	}
}

function CheckTime(index){
	if(index < 10){
		index = '0' + index;
	}
	return index;
}

function CheckEnter(cookie,title,msg,func){
	if(cookie.get('activety') != 'true'){
		var args = {
			'title':title,
			'content':msg,
			'close_word':'我知道了'
		}
		Myactivity($.toJSON(args),func);
		cookie.put('activety','true');
	}
}

function HeaderShow(value,msg){
	$('.back').show();
	$('.header-info').find('[tag = add-button]').remove();
	$('header').hide();
	value.show();
	$('.header-title').html(msg);
}

function AddButton(data,callback,scope,location){
	var args = $.evalJSON(data);
	$('.header-info').find('.public-button-'+args.position).append('<div id="'+args.id+'" tag="add-button" class="public-add-button '+args.myclass+'">'+args.info+'</div>');
	if(callback) callback(scope,location);
}

function Myactivity(args,close_fun)
{
	var data = $.evalJSON(args);
	var target=angular.element('#Myalert').scope();
	target.alt_panel=!target.alt_panel;
	target.alt_activity=!target.alt_activity;
	target.alt_act=data;
	target.alt_activity_close_fun=function(){
		target.alt_panel=!target.alt_panel;
		target.alt_activity=!target.alt_activity;
		if(close_fun) close_fun();
	};
	target.panel_type = 'light';
}

function Myconfirm(args,true_fun,false_fun)
{
	var data = $.evalJSON(args);
	var target=angular.element('#Myalert').scope();
	target.alt_panel=!target.alt_panel;
	target.alt_normal=!target.alt_normal;
	target.alt_confirm = data;
	target.alt_true_fun=function(){
		target.alt_panel=!target.alt_panel;
		target.alt_normal=!target.alt_normal;
		target.confirm = false;
		if(true_fun) true_fun();
	};
	target.alt_false_fun=function(){
		target.alt_panel=!target.alt_panel;
		target.alt_normal=!target.alt_normal;
		target.confirm = false;
		if(false_fun) false_fun();
	};
	if(data.phone){
		angular.element('.alert-phone').scope().callPhone=function(){
			toNewHref('tel:'+data.phone+'');
		};
	}
	if(data.type == 1){
		target.confirm = !target.confirm;
		target.confirmClose=function(){
			target.alt_panel=!target.alt_panel;
			target.alt_normal=!target.alt_normal;
			target.confirm = false;
		};
	}
	target.panel_type = 'deep';
}

function Myalert(value,timeout){
	var target = angular.element('#Myalert').scope();
	target.alt_panel = !target.alt_panel;
	target.alt_alert = !target.alt_alert;
	target.alt_msg = value;
	target.panel_type = 'opacity';
	timeout(function(){
        target.alt_panel = !target.alt_panel;
		target.alt_alert = !target.alt_alert;
    },1500);
}

function Mainconfirm(args,true_fun,false_fun)
{
	var data = $.evalJSON(args);
	var target=angular.element('#Myalert').scope();
	target.alt_panel=!target.alt_panel;
	target.alt_main=!target.alt_main;
	target.alt_confirm = data;
	target.alt_true_fun=function(){
		target.alt_panel=!target.alt_panel;
		target.alt_main=!target.alt_main;
		target.confirm = false;
		if(true_fun) true_fun();
	};
	target.alt_false_fun=function(){
		target.alt_panel=!target.alt_panel;
		target.alt_main=!target.alt_main;
		target.confirm = false;
		if(false_fun) false_fun();		
	};
	if(data.phone){
		angular.element('.alert-phone').scope().callPhone=function(){
			toNewHref('tel:'+data.phone+'');
		};
	}
	if(data.type == 1){
		target.confirm = !target.confirm;
		target.mainConfirmClose=function(){
			target.alt_panel=false;
			target.alt_main=false;
			target.confirm = false;
		};
	}
	target.panel_type = 'deep';
}

function Myloading(bool){
	var target = angular.element('#Myalert').scope();
	target.panel_type = 'loading';
	target.alt_panel = bool;
	target.loading = bool;
}

function GetCarInfo(scope,http,callback,errfunc){
	httpGet(http,'/cart/total',
		function(response){
			if(callback) callback(scope,http,$.toJSON(response));
		},
		function(errno,errmsg){
			if(errfunc) errfunc(scope,http,errmsg);
	});
}

function GetSystemInfo(scope,http,callback){
	http({
        method: 'GET',
        url: '/system/param',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
    .success(function(response){
    	if(callback) callback(response);
    })
    .error(function(response){
    	
    });
}

function CheckNull(value,errmsg){
	if($.trim(value).length <= 0){
		if(errmsg){
			var args = {
				'title':errmsg,
				'true_word':'确定',
				'false_word':'取消',
				'phone':'',
				'type':''
			}
			Myconfirm($.toJSON(args));
		}
		return false;
	}
	return true;
}

function MatchStatus(value){
	var status = '';
	switch(parseInt(value)){
		case -1:
			status = '已取消';
		break;
		case 2:
			status = '配送中';
		break;
		case 3:
			status = '已下单';
		break;
		case 4:
			status = '已完成';
		break;
	}
	return status;
}

function MatchZone($http,value){
	var status = '';
	httpGet($http,'',
		function(response){
			angular.forEach(response.zoneList,function(content,index){

			});
		},
		function(errno,errmsg){

	});
	return status;
}

function CheckLoginCookie($http,$cookieStore,true_func,false_func){
	var userInfo = {};
	userInfo.username = $cookieStore.get('ln');
	userInfo.password = $cookieStore.get('lp');
	if(userInfo.username && userInfo.password){
		httpPost($http,'/user/login',
			userInfo,
			function(response){
				if(true_func) true_func();
			},
			function(errno,errmsg){
				if(true_func) true_func();
		});
	}else{
		if(false_func){
			false_func();
		}else{
			if(true_func) true_func();
		}
	}
}

function SetParamet(){
	var args = {};
	if(isIos()){
		args.platform = 'ios';
		args.version = versionIos;
		return args;
	}
	if(isWeixin()){
		args.platform = 'wx';
		args.version = '';
		return args;
	}
	args.platform = 'android';
	args.version = versionAndroid;
	return args;
}

function httpPost($http,url,paramet,success_func,error_func){
	var args = SetParamet();
	paramet.platform = args.platform;
	paramet.version = args.version;
	$http({
        method: 'POST',
        url: url,
        data: $.toJSON(paramet),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
	.success(
		function(response){
			if(response.errno == 0){
				success_func(response);
			}else{
				error_func(response.errno,response.errmsg);
			}
		}
	)
	.error(function(response) {
		var errno = 10000;
		var errmsg = '未知错误';

		switch(XMLHttpRequest.status)
		{
			case 400:
				errno = 10400;
				errmsg = '接口参数错误';
				break;
			case 401:
				errno = 10401;
				errmsg = '未授权的接口调用';
				break;
			case 403:
				errno = 10403;
				errmsg = '对此接口无访问权限';
				break;
			case 404:
				errno = 10404;
				errmsg = '接口路径不存在';
				break;
			case 406:
				errno = 10406;
				errmsg = '请求无法被接受';
				break;
			case 0:
			case 408:
				errno = 10408;
				errmsg = '请求超时';
			case 409:
				errno = 10409;
				errmsg = '请求资源冲突，请重试';
				break;
			case 415:
				errno = 10415;
				errmsg = '不支持此用户代理';
				break;
			case 500:
				errno = 10500;
				errmsg = '服务器内部错误';
				break;
			default:
				errno = 10000;
				errmsg = '未知错误 '+XMLHttpRequest.status;
		}
        error_func(errno,errmsg);
    });
}

function httpGet($http,url,success_func,error_func){
	var args = SetParamet();
	if(url.split('?')[1]){
		url+= '&platform='+args.platform;
	}else{
		url+= '?platform='+args.platform;
	}
	if(args.version != '') url+= '&version='+args.version;
	$http({
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
	.success(
		function(response){
			if(response.errno == 0){
				success_func(response);
			}else{
				error_func(response.errno,response.errmsg);
			}
		}
	)
	.error(function(response) {
		var errno = 10000;
		var errmsg = '未知错误';

		switch(XMLHttpRequest.status)
		{
			case 400:
				errno = 10400;
				errmsg = '接口参数错误';
				break;
			case 401:
				errno = 10401;
				errmsg = '未授权的接口调用';
				break;
			case 403:
				errno = 10403;
				errmsg = '对此接口无访问权限';
				break;
			case 404:
				errno = 10404;
				errmsg = '接口路径不存在';
				break;
			case 406:
				errno = 10406;
				errmsg = '请求无法被接受';
				break;
			case 0:
			case 408:
				errno = 10408;
				errmsg = '请求超时';
			case 409:
				errno = 10409;
				errmsg = '请求资源冲突，请重试';
				break;
			case 415:
				errno = 10415;
				errmsg = '不支持此用户代理';
				break;
			case 500:
				errno = 10500;
				errmsg = '服务器内部错误';
				break;
			default:
				errno = 10000;
				errmsg = '未知错误 '+XMLHttpRequest.status;
		}
        error_func(errno,errmsg);
    });
}

function httpOther($http,url,method,paramet,success_func,error_func){
	var args = SetParamet();
	if(url.split('?')[1]){
		url+= '&platform='+args.platform;
	}else{
		url+= '?platform='+args.platform;
	}
	if(args.version != '') url+= '&version='+args.version;
	$http({
        method: method,
        url: url,
        data: $.toJSON(paramet),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
	.success(
		function(response){
			if(response.errno == 0){
				success_func(response);
			}else{
				error_func(response.errno,response.errmsg);
			}
		}
	)
	.error(function(response) {
		var errno = 10000;
		var errmsg = '未知错误';

		switch(XMLHttpRequest.status)
		{
			case 400:
				errno = 10400;
				errmsg = '接口参数错误';
				break;
			case 401:
				errno = 10401;
				errmsg = '未授权的接口调用';
				break;
			case 403:
				errno = 10403;
				errmsg = '对此接口无访问权限';
				break;
			case 404:
				errno = 10404;
				errmsg = '接口路径不存在';
				break;
			case 406:
				errno = 10406;
				errmsg = '请求无法被接受';
				break;
			case 0:
			case 408:
				errno = 10408;
				errmsg = '请求超时';
			case 409:
				errno = 10409;
				errmsg = '请求资源冲突，请重试';
				break;
			case 415:
				errno = 10415;
				errmsg = '不支持此用户代理';
				break;
			case 500:
				errno = 10500;
				errmsg = '服务器内部错误';
				break;
			default:
				errno = 10000;
				errmsg = '未知错误 '+XMLHttpRequest.status;
		}
        error_func(errno,errmsg);
    });
}

function getCookie(time){
	if(document.cookie.length > 0){
		start=document.cookie.indexOf(time + "=");
		if(start!=-1){ 
			start=start + time.length+1 ;
			end=document.cookie.indexOf(";",start);
			if (end==-1) end=document.cookie.length;
			return unescape(document.cookie.substring(start,end));
		} 
	}
	return "";
}

function setCookie(time,value,expiretime){
	var date = new Date();
	date.setTime(date.getTime() + expiretime*3600*1000);
	document.cookie=time+ "=" +escape(value)+";expires="+date.toGMTString()+";path=/";
}