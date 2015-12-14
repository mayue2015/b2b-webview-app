angular.module('Index',[])
	.controller('searchListController',
		function($scope,$http,$location,$timeout){
			WeixinAction($scope,$http);
			header=angular.element('.searchList').scope();
			keyWord=$location.search()['keyWord'];
			header.keyWord=keyWord;
			angular.element('#header').scope().back=function(){
				var backUrl=encodeURIComponent($location.search()['backUrl']);
				var url='#/web/search?backUrl='+backUrl;
				toBackHref(url);
			};
			header.searchClick=function(){
				var backUrl=encodeURIComponent($location.search()['backUrl']);
				var url="#/web/search?keyWord="+keyWord+'&backUrl='+backUrl;
				toNewHref(url);
			};
			HeaderShow($('.searchList'),'');
			Myloading(true);
			SLSearchButton($scope,$location);
			GetCarInfo($scope,$http,
				function(scope,http,data){
					var item = angular.element('#header');
					var datas = $.evalJSON(data);
					if(datas.total <= 0){
						$('.f-car-info').hide();
					}else{
						var total = parseInt(datas.total);
						if(total > 99){
							total = '99+';
						}
						item.find('.f-car-info').text(total).show();
					}
				},
				function(){
					angular.element('#header').find('.f-car-info').hide();
			});
			SLSetList($scope,$http,$location,$timeout);
	})
	.directive('slScript',
		function($timeout,$http){
		    return {
		        restrict: 'A',
		        controller:function($scope,$http){
		        	if ($scope.$last === true) {
		                $timeout(function(){
		                   SLSetStatus();
		                   Myloading(false);
		                });
		            }
		        }
	    	};
	});

function SLSetStatus(){
	var list = angular.element('.f-product-list-item');
	angular.forEach(list,function(content,index){
		var item = angular.element('#item-'+index).scope();
		if(item.list.maxBuy <= 0){
			item.status = '暂无货';
		}
		SLCollectSlide('item-'+index);
	});
}

function SLSetList(scope,http,location,timeout){
	var paramet = {
		"name":scope.keyWord,
		"brandId":scope.brandId,
		"sort":scope.sortType,
		"order":scope.sortMethod,
		"rows":0
	}
	httpPost(
		http,
		'/product/search',
		paramet,
		function(response){
			scope.brand = false;
			scope.sub_chose = 'f-sumbox-nocontroller';
			scope.productList = response.rows;
			scope.brandList = response.brandList;
			scope.sortList = function(target,value){
				switch(value){
					case 0:
						target.sortType = 'price';
						if(!target.sortMethod || target.sortMethod=='asc'){
							target.sortMethod = 'desc';
						}else{
							target.sortMethod = 'asc';
						}
					break;
					case 1:
						target.sortType = 'sellCount';
						target.sortMethod = '';
					break;
				}
				SLSetList(scope,http,location,timeout);
			};
			scope.joinCar = function(target){
				var joinList = [];
				var productInfo = {
					'productNumber':target.list.productNumber,
					'number':target.sum
				};
				joinList.push(productInfo);
				var args = {
					"cartList":joinList
				}
				SLJoinCar(http,args,timeout);
			};
			scope.collect = function(target){
				$('#item-'+target.$index).find('.f-item-collect').css({
					'width':"0px",
					'opacity':'0'
				});
				SLCollectProduct(http,timeout,target.list.productNumber);
			};
			scope.changeNumber = function(target,type){
				var number = parseInt(target.sum);
				switch(type){
					case 0:
						if(number > 1){
							target.sum = --number;
						};
					break;

					case 1:
						if(number < target.list.maxBuy){
							target.sum = ++number;
						};
					break;
				}
			};
			scope.choseBrand = function(){
				scope.brand = !scope.brand;
			}
			scope.selectBrand = function(target,type){
				if(type == 0){
					scope.brandId = 0;
				}else{
					scope.brandId = target.brand.id;
				}
				SLSetList(scope,http,location);
			}
			if(!getCookie('lead')){
				scope.lead = false;
				scope.closeLead= function(){
					scope.lead = true;
					setCookie('lead',true,365);
				};
			}
			Myloading(false);
		},
		function(errno,errmsg) {
		}
	);
}

function SLJoinCar(http,paramet,timeout){
	httpPost(
		http,
		'/cart/add',
		paramet,
		function(response){
			Myalert('加入成功',timeout);
			var publicCar = angular.element('.public-car').scope();
			publicCar.publics = response;
			var item = angular.element('#header');
			if(response.total <= 0){
				$('.f-car-info').hide();
			}else{
				var total = parseInt(response.total);
				if(total > 99){
					total = '99+';
				}
				item.find('.f-car-info').text(total).show();
			}
		},
		function(response){
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
		});
}

function SLCheckNumber(target){
	var value = parseInt($(target).val());
	if(value <= 0){
		$(target).val('1');
	}
	if(value > target.list.maxBuy){
		$(target).val(target.list.maxBuy);
	}
}

function SLCollectProduct($http,$timeout,value){
	httpOther($http,'/api/favorite?skuId='+value,'PUT',
		{},
		function(response){
			Myalert('收藏成功',$timeout);
		},
		function(errno,errmsg){
			var collectList = [];
			var nativeCollect = {};
			if(getCookie('nativeCollect')){
				var flag = true;
				nativeCollect = $.evalJSON(getCookie('nativeCollect'));
				$.each(nativeCollect.list,function(index,content){
					if(content == value){
						flag = false;
						return false;
					}
				});
				if(flag) nativeCollect.list.push(value);
			}else{
				collectList.push(value);
				nativeCollect = {
					'list':collectList
				}
			}
			setCookie('nativeCollect',$.toJSON(nativeCollect),365);
			Myalert('收藏成功',$timeout);
	});
}

function SLSearchButton(target,local){
	$('.header-info').find('[tag = add-button]').remove();
	var button = {
		'id':'SLcar',
		'position':'right-search',
		'myclass':'f-add-car',
		'info':'<div class="f-car-info">0</div>'
	}
	AddButton($.toJSON(button),function(){
		$('#'+button.id).bind('click',function(){
			var backurl = encodeURIComponent(location.href);
			var url='#/web/car?backUrl=' + backurl;
			toNewHref(url);
		});
	});
}

function SLCollectSlide(target){
		var item = $('#'+target); 
		var hammer = new Hammer(document.getElementById(target));
		hammer.on("swipeleft",function(e){
			$('.f-item-collect').css({
				'width':"0px",
				'opacity':'0'
			});
			item.find('.f-item-collect').animate({
				width:'120px',
				opacity:'1'
			},'fast');
		});
		hammer.on("swiperight",function(e){
	   		item.find('.f-item-collect').animate({
				width:'0px',
				opacity:'0'
			},'fast');
		});
}