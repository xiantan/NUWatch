//var background = chrome.extension.getBackgroundPage();

var host = "140.123.101.185:3009";
//var userIdentify = background.userIdentify;
document.addEventListener('DOMContentLoaded', function() {

	$("#history").click(function() {
		var str="";
		//console.log("upload clicked");
		
		chrome.history.search({//TODO move to onInstalled
			text : '',
			startTime : 0,
			maxResults : 1e9
		}, function(data) {
			var tmp = [];
			for (var i in data) {
				tmp[i] = {};
				tmp[i].url = data[i].url;
				tmp[i].title = data[i].title;
				tmp[i].visitCount = data[i].visitCount;
			}
			console.log(JSON.stringify(tmp));
			$("#tabList").html(JSON.stringify(tmp));
			/*TODO http request post : JSON.stringify(sendObj)
			 * sendObj = {};
			 * sendObj.urls=tmp;
			 * sendObj.type="history"
			 * sendObj.version=1;
			 * sendObj.uid=identifyId;
			 */

		});

		
		
		return;
		
		userIdentify = $("#uid").val();
		console.log(userIdentify);

		chrome.tabs.query({}, function(tabs) {
			var saveInfo = {};
			var tabary = [];
			var functionCalls = [];
			console.log("query in query.tabs.callback");
			//sendGetScrollPosition(tabs,tabary);
			
			 // for (var i in tabs) {
// 
				// functionCalls = chrome.tabs.sendMessage(tabs[i].id, {
					// action : "getScrollPosition"
				// }, function(response) {
					// console.log(response);
					// if(!response)return;
					// var obj = {};
					// try{
						// obj = {title : response.title,
						// url : response.url,
						// scrollLocation : response.scrollLocation
					// };
					// }catch(e){
						// console.log("fail");
					// }
					// tabary.push(obj);
				// });
// 
			// }
			// console.log(tabary.len);
			myary = sendGetScrollPosition(tabs,tabary);
			console.log("myary.len" + myary.length);
			$.when.apply(null, myary).then(function() {
			// $(document).ajaxStop(function () {
			//setTimeout(function() {
				console.log(tabary);
				console.log('len:'+tabary.length);
				saveInfo.urls = tabary;
				saveInfo.userIdentify = userIdentify;
				saveInfo.timestamp = (new Date()).getTime();
				console.log("all tabs ary OK");

				//chrome.storage.loca;
				$.ajax({
					type : 'POST',
					url : host + "/tabs/save/",
					data : JSON.stringify(saveInfo),
					// data : "122gg",
					contentType : "text/plain",
					// contentType: "application/json",
					//dateType:'text',
					success : function(data) {
						console.log("success:[" + data + "]");
					},
					error : function(data) {
						console.log("fail" + JSON.parse(JSON.stringify(tabary)));
					}
				});
				console.log("window will close");
				// window.close();

			},1000);
		});

	});
	$("#bookmarks").click(function() {
		var str="";

		function traversalBookmark(bookmarks) {//TODO use $.ajax to replace! && must move to chrome.runtime.onInstalled
			//bookmarks.forEach(function(bookmark) {
				for(var i in bookmarks){					
					if (bookmarks[i].children){
						//console.log(">>>"+bookmarks[i].title);
						str += ">>>"+bookmarks[i].title + "<br/>\n";
						traversalBookmark(bookmarks[i].children);
					}
					else{
						//console.log( bookmarks[i].title + "[" +bookmarks[i].url + "]");
						str += bookmarks[i].title + "[" +bookmarks[i].url + "]<br/>\n";
					}
					
				}
		}
		chrome.bookmarks.getTree(function(bookmarks) {
			traversalBookmark(bookmarks);
			$("#tabList").html(str);
		});
		return;
		$.ajax({
			type: 'GET',
			url: "http://140.123.101.185:3009/tabs/get/?uid="+$("#uid").val(),
			//dataType: 'jsonp',
			success: function(json) {
				chrome.runtime.sendMessage({
					openUrls : json
				});

			
    		}
		});
	});
	$("#getsource").click(function() {
		chrome.runtime.sendMessage({
					action : "getSource" //send to background.js
				});

	});
	$("#search").click(function() {
		// chrome.runtime.sendMessage({
					// action : "search",
					// search : $("#uid").val()
				// });
		//var contentSave={};
		//chrome.storage.local.get(null, function(items) {
			var items = localStorage;
			//contentSave = items.content;
			//console.log(items);return;
			var results = {};
			pattern = $("#uid").val();
			var locate = -1;
			
			//var results = [];
			//for (var i = 0; i < contentSave.length; i++) {
			for (var i in items) {
				if(i == 'keywords')continue;
				var item={};
				try{
					item=JSON.parse(items[i]);
				}catch(e){
					continue;
				}
				locate = item.content.indexOf(pattern);
				if (locate != -1 && !results.hasOwnProperty(item.url)) {
					var url = item.url;
					var content = item.content;
					var title = item.title;
					// results.push({ url:url });
					var obj={};
					obj = {url:url,title:title,subcontent:content.substring(locate-15,locate+30)};
					
					results[url] = obj;
					console.log(locate + "$$$$" + results.hasOwnProperty(item.url) + "&&&" + item.url);
				} else {
					console.log(locate + "$$$$" + results.hasOwnProperty(item.url) + "&&&" + item.url);
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
			}
			//$("#tabList").html(htmStr); 
			console.log($("tabList"));

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
