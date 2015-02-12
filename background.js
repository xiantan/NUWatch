/*chrome.app.runtime.onLaunched.addListener(function() {
 console.log("runtime.onLaunched");
 });*/
var host = "140.123.101.185:3009";
var web_host="http://"+host;
var ws_host="ws://"+host;
var userIdentify = 'tan_test';

chrome.browserAction.setPopup({
        popup: "popup.html"
    });
/*debug*/
 webs = new Wsclient(ws_host, "notify");
chrome.runtime.onInstalled.addListener(function(details) {
//chrome.runtime.onStartup.addListener(function(details) {
	/*chrome.tabs.query({}, function(tabs) {
		for(var i in tabs){
			chrome.tabs.reload(tabs[i].id,{bypassCache: true});
		}
	});*/
	/*if(details.reason == "install"){
        console.log("This is a first install!");
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        chrome.tabs.query({}, function(tabs) {
		for(var i=0;i<tabs.length&&i<10;i++){
			if(tabs[i].url == "chrome://extensions/"){
				continue;
			}
			chrome.tabs.reload(tabs[i].id);
			//console.log(tabs[0].id);
		}
		});
    }*/
    //chrome.storage.local.remove('content',function(){console.log("remove content @ extension inital");});
    chrome.storage.local.clear(function(){console.log("clear all @ extension inital");});
	console.log("should be all reload");

}); 

chrome.runtime.onStartup.addListener(function() {
}); 

 
 /*debug*/
chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "getSource") {
		chrome.tabs.query({}, function(tabs) {
		for(var i in tabs){
			chrome.tabs.sendMessage(tabs[i].id, {
							action : "getSource"
						},function(){
							//console.log(tabUpdate.id+" sendGetSourceMessage done");
							if(chrome.runtime.lastError){
								console.log("error: "+chrome.runtime.lastError.message);
							}
						});

		}
	});
		console.log("send to get  source");
		//console.log(request.source);
	}
	else if(request.action == "isSource"){
		
		console.log(request.url);
		//console.log(request.source);
		var obj={url:request.url,content:request.source,title:request.title};
		obj[request.url]=request.url;
		(function(obj){
			var url = obj.url;
			var content = obj.content;
			var title = obj.title;
			var obj2 ={};
			obj2[url] = {url:url,content:content,title:title};
			contentSave = {url:url,content:content};
			chrome.storage.local.set(obj2,function(){
			});
		// chrome.storage.local.get('content',function(items){
			// var contentSave={};
			// if(!items.content){
				// console.log("no content in storage.local");
				// console.log(items);				
			// }
			// else{
				// contentSave = items.content;
			// }
			// if(!contentSave.hasOwnProperty(obj.url)){
						// contentSave[obj.url]=obj;
						// console.log(contentSave);
			// }
			// else{
				// return true;
			// }
			// //items.content[obj.url]=obj;
		// chrome.storage.local.set({content:contentSave},function(){
// 			
			// if(chrome.runtime.lastError){
				// console.log("error @ bg.js.onMessage.action:isSource ::"+chrome.runtime.lastError.message);
			// }
			// else{
				// console.log("chrome.storage.local.set{'content') success for url:"+obj.url);
			// }
		// });
		// });
		})(obj);
	}
	else if(request.action == "search"){//won't work anymore 
	
		// chrome.storage.local.get(null, function(items) {
			// contentSave = items.content;
			// //console.log(items);return;
			// var results = {};
			// pattern = request.search;
			// var locate = -1;
// 			
			// //var results = [];
			// //for (var i = 0; i < contentSave.length; i++) {
			// for (var i in items) {
				// locate = items[i].content.indexOf(pattern);
				// if (locate != -1 && !results.hasOwnProperty(items[i].url)) {
					// var url = items[i].url;
					// var content = items[i].content;
					// // results.push({ url:url });
					// results[url] = url;
					// console.log(locate + "$$$$" + results.hasOwnProperty(items[i].url) + "&&&" + items[i].url);
				// } else {
					// console.log(locate + "$$$$" + results.hasOwnProperty(items[i].url) + "&&&" + items[i].url);
				// }
			// }
			// // for(var i =0;i<results.length;i++){
			// // console.log(results[i].url);
			// // }
// 
			// console.log("result" + JSON.stringify(results));
		// }); 


		
	}
	else if(request.msg){
		console.log("msg: "+request.msg);
	}
	else if(request.openUrls){
		var obj = request.openUrls;
		for(var i=0;i< obj.urls.length;i++){
			(function(obj,i){
				
				if(chrome.runtime.lastError){
								console.log("error: "+chrome.runtime.lastError.message);
							}
				chrome.tabs.create({
					//active : false
				}, function(tab) {//BUG BUG TODO
					// chrome.tabs.create({url:obj.urls[i].url},function(tab){
					chrome.tabs.update(tab.id, {
						url : obj.urls[i].url,
						active : false
					}, function(tabUpdate) {
						setTimeout(function(){
							console.log(tabUpdate.id);
						chrome.tabs.sendMessage(tabUpdate.id, {
							action : "setScrollPosition",
							to : obj.urls[i].scrollLocation
						},function(){
							console.log(tabUpdate.id+" sendMessagedone");
							if(chrome.runtime.lastError){
								console.log("error: "+chrome.runtime.lastError.message);
							}
						});
						},2000);
						console.log("updateID: "+tabUpdate.id);
					});
				}); 

				
			})(obj,i);
			console.log(obj.urls[i].title+"||"+obj.urls[i].scrollLocation);			
		}
		
	}
	else  {
		console.log(request);
		//console.log(request.source);
	}
	
});
function getmesage(opt) {//should be websocket.onmessage
	chrome.notifications.create("id" + Math.random(), opt, function(id) {
		console.log("createID:" + id);
	});
	//this wii put to get message from notifications
	chrome.browserAction.setBadgeBackgroundColor({
		color : [255, 0, 0, 0]
	});
};
chrome.notifications.onClicked.addListener(replyBtnClick);
function replyBtnClick(notificationId) {
	console.log("id:" + notificationId);
	chrome.browserAction.setBadgeText({
		text : ""
	});
	chrome.tabs.create({//TODO should go to our website
		url : "http://www.cs.ccu.edu.tw/"
	});
	chrome.notifications.clear(notificationId, function(wasCleared) {
	});

};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.status == 'complete') {//TODO sent restful request to server
		console.log("tabs.onUpdated:[" + tab.url + "] id: " + tabId + "  status: " + changeInfo.status);
	}
});

// chrome.tabs.onCreated.addListener(function(tab) {
	// console.log("tabs.onCreated: " + tab.url);
// });

function Wsclient(wsURL, wsProtocol, callback) {
	var websocket = null;
	var isClose = true;
	var ws = new WebSocket(wsURL, wsProtocol);
	this.ws = ws;
	ws.onmessage = function(e) {
		console.log(e.data);
		try {
			receiveJson = JSON.parse(e.data);
		} catch(e) {
			console.log("JSON parse error at Wsclient.onmessage()");
			return false;
		}
		var opt = {
			type : "basic",
			title : receiveJson.title,
			message : receiveJson.message,
			iconUrl : "icon.png"

		};
		chrome.browserAction.setBadgeText({
			text : "" + receiveJson.notificationNum
		});

		getmesage(opt);
	};
	ws.onclose = function(e) {//TODO reconnect
		isClose = true;
		console.log("ws close");
	};
	ws.onopen = function(e) {
		console.log("ws open");
	};
	ws.onerror = function(e) {
		console.log("something wrong in ws");
	};
	//TODO auth
	/*
	 $.get(WWW_HOST+"/ws/users/me", function(data) {
	 //console.log('DATA',data);
	 //chrome.tabs.sendMessage(targetTab.id, {type: 'id', data: data});
	 if(!=null){
	 ws.send(JSON.stringify(auth_data));
	 }
	 else{
	 turn login page by chrome.tabs.create();
	 }
	 });*/
}
