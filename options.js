//var background = chrome.extension.getBackgroundPage();

var host = "140.123.101.185:3009";
//var userIdentify = background.userIdentify;
document.addEventListener('DOMContentLoaded', function() {
	//$(".center").center();
	//$("#uid").center();
	/*$(window).resize(function() {
		    this.css("position","relative");
    		this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
    		this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
		});*/
	$("#searchSubmit").click(function() {
		// chrome.runtime.sendMessage({
					// action : "search",
					// search : $("#uid").val()
				// });
		//var contentSave={};
		//chrome.storage.local.get(null, function(items) {
			
			//contentSave = items.content;
			//console.log(items);return;
			var results = {};
			pattern = $("#search").val();
			$("#tabList").html("");
			
			
			//var results = [];
			//for (var i = 0; i < contentSave.length; i++) {
			var items = localStorage;
			for (var i in items) {
				if(i == 'keywords')continue;
				var item={};
				
				try{
					item=JSON.parse(items[i]);
				}catch(e){
					continue;
				}
				var locate = undefined;
				
				locate =   item.keyword && item.keyword.indexOf(pattern)  ;
				if(locate === undefined || locate === -1) locate = item.title && item.title.indexOf(pattern) ;
				if(locate === undefined || locate === -1) locate =  item.content && item.content.indexOf(pattern)  ;
				if ( locate !== undefined &&locate != -1 && !results.hasOwnProperty(item.url) ) {
					var url = item.url || '';
					var content = (item.content && item.content.substring(locate-15,locate+30) ) || '';
					var title = item.title || '';
					// results.push({ url:url });
					var obj={};
					obj = {url:url,title:title,subcontent:content};
					
					results[url] = obj;
					console.log(locate + "$$$$" + results.hasOwnProperty(item.url) + "&&&" + item.url);
				} else {
					//console.log(locate + "$$$$" + results.hasOwnProperty(item.url) + "&&&" + item.url);
				}
			}
			// for(var i =0;i<results.length;i++){
			// console.log(results[i].url);
			// }

			console.log("result" + JSON.stringify(results));
				
			htmStr = "";
			$("#tabList").html(""); 
			for (var i in results) {
				if (results[i].title && results[i].title != "") {

					var tabList = document.getElementById("tabList");
					var list = document.createElement('div');
					list.setAttribute("class","list");
					var href = document.createElement("a");
					href.setAttribute("href",results[i].url);
					href.setAttribute("class","title");
					href.innerHTML=results[i].title;
					list.appendChild(href);
					list.appendChild(document.createElement("br"));
					var subcontent = document.createElement('div');
					subcontent.setAttribute("class","subcontent");
					subcontent.appendChild(document.createTextNode(results[i].subcontent) );
					list.appendChild(subcontent);
					tabList.appendChild(list);

					//htmStr += '<div class="list"><a href="' + results[i].url + '">' + results[i].title + '</a><br/>';
					//htmStr += '<div class="subcontent">' + results[i].subcontent + '</div></div>';

				}
				else{
					console.log(results[i]);
				}
			}
			//$("#tabList").html(htmStr); 
			console.log($("#tabList"));

		//}); 


	});
	chrome.runtime.sendMessage({
		msg : "popup.js running"
	});

});

function sendGetScrollPosition(tabs, tabary) {
	deferreds = [];
	for (var i =0;i< (tabs.length);i++) {
		var deferred = $.Deferred();
		deferreds.push(deferred.promise());
		(function(i,deferred){
		chrome.tabs.sendMessage(tabs[i].id, {
			action : "getScrollPosition"
		},((function(response) {
			//console.log(response);
			if (!response){
				console.log("fail in response " + i);
				deferred.resolve();
				return ;
			}
			var obj = {};
			try {
				obj = {
					title : response.title,
					url : response.url,
					scrollLocation : response.scrollLocation
				};
							} catch(e) {
				console.log("fail " + i);
				deferred.resolve();
				return ;
			}
			
			tabary.push(obj);
			console.log("success in sendGetScrollPosition " + i);
			deferred.resolve();
			return ;
		})));
		})(i,deferred);
		//console.log(functionCalls);

	}
	return  deferreds;
}
/*
 * center example 
 jQuery.fn.center = function () {
    this.css("position","relative");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
};*/