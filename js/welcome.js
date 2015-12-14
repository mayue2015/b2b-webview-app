angular.module('Index',[])
	.controller('welcomeController',
		function($scope){
			welcomeBind();
			$scope.toMain=function(){
				toNewHref('#/web/main');
			};
		}
	);
function welcomeBind()
{
	var list=$(".welcome-panel-div");
	$.each(list,function(key,value){
		var target=$(value);
		var hammer=new Hammer(value);
		if(key!=0)
		{
			hammer.on('swiperight',function(e){
				/*
				$(".welcome-panel-div").hide();
				target.prev().show();
				*/
				prevPage(target);
				$("#welcome-"+key).attr('class','');
				$("#welcome-"+key).prev().attr('class','welcome-footer-full');
			});
		}
		if(key!=list.length-1){
			hammer.on('swipeleft',function(e){
				//$(".welcome-panel-div").hide();
				nextPage(target);
				$("#welcome-"+key).attr('class','');
				$("#welcome-"+key).next().attr('class','welcome-footer-full');
			});
		}
	});
}
function prevPage(target)
{
	var width=window.document.width;
	var width='1300';
	target.prev().css('left','-'+width+'px');
	target.prev().show();
	target.animate({left:width},'fast','linear');
	target.prev().animate({left:'0px'},'fast','linear',function(){
		target.hide();
		target.css('left','0px');
	});
}
function nextPage(target)
{
	var width=window.document.width;
	var width='1300px';
	target.next().css('left',width);
	target.next().show();
	target.animate({left:'-'+width},'fast','linear');
	target.next().animate({left:'0px'},'fast','linear',function(){
		target.hide();
		target.css('left','0px');
	});
}
