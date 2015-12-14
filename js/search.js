angular.module('Index',[])
	.controller('searchController',
		function($scope,$http,$location){
			WeixinAction($scope,$http,0);
			$('header').hide();
			$('.header-info').find('[tag = add-button]').remove();
			var keyWord=decodeURIComponent($location.search()['keyWord']);
			$scope.keyWord=keyWord=='undefined' ? '' : keyWord;

			$scope.back=function(){
				var url=$location.search()['backUrl'];
				if(!url)
					url='#/web/category';
				toBackHref(url);
			};

			$scope.search=function(){
				var backUrl=encodeURIComponent($location.search()['backUrl']);
				var keyWord=$scope.keyWord==undefined ? '' : $scope.keyWord;
				keyWord=encodeURIComponent(keyWord);
				var url="#/web/search/list?keyWord="+keyWord+"&backUrl="+backUrl;
				addSearchHistory($scope);

				toNewHref(url);
			};
			
			$scope.keyWord=$location.search()['keyWord'];
			$scope.cleanUsed=function(){
				clnSearchHistory($scope);
			};
			$scope.clickHistory=function(target){
				$scope.keyWord=target.product.name;
				$scope.search();
			};
			getSearchHistory($scope);
			$('.search-input-img').attr('href',decodeURIComponent($location.search()['backUrl'])).show();
	});
function clnSearchHistory($scope)
{
	$scope.list=[];
	//localStorage.searchHistory=null;
	setCookie('searchHistory',Array());
}
function addSearchHistory($scope)
{
	if($scope.keyWord=='' || $scope.keyWord=='undefined' || $scope.keyWord==undefined)
		return;
	var list=getCookie('searchHistory');
	//var list=localStorage.searchHistory;
	var flag=true;
	list=list.length==0 ? Array() : $.evalJSON(list);
	list=list ? list : Array();
	$.each(list,function(key,value){
		if($scope.keyWord==value.name)
			flag=false;
	});
	if(!flag)
		return;
	var maxLength=10;
	var historyLength=list.length;
	if(historyLength>=maxLength)
		list.shift();
	var json={
		'name':$scope.keyWord
	}
	list.push(json);
	setCookie('searchHistory',$.toJSON(list),365);
	//localStorage.searchHistory=$.toJSON(list);
	$scope.list=list.reverse();
}
function getSearchHistory($scope)
{
	var list=getCookie('searchHistory');
	//var list=localStorage.searchHistory;
	list=list.length==0 ? Array() : $.evalJSON(list);
	list=list ? list : Array();
	$scope.list=list.reverse();
}