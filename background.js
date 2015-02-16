/*chrome.app.runtime.onLaunched.addListener(function() {
 console.log("runtime.onLaunched");
 });*/
var host = "140.123.101.185:3009";
var web_host="http://"+host;
var ws_host="ws://"+host;
var id_host = 'http://140.123.101.185:9527';

chrome.browserAction.setPopup({
        popup: "popup.html"
    });
/*debug*/
 webs = new Wsclient(ws_host, "notify" , {intervalTime:3000});
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

		})(obj);
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

function Wsclient(wsURL, wsProtocol, option, callback) {
	if(!option) option={};
	var ws = undefined;
	
	var intervalTime = option.intervalTime || 10000;
	var connect = function() {
		ws = new WebSocket(wsURL, wsProtocol);
		
		
		ws.onmessage = function(e) {
			console.log(e.data);
			try {
				receiveJson = JSON.parse(e.data);
			} catch(e) {
				console.log("JSON parse error at Wsclient.onmessage()");
				return false;
			}

			if (receiveJson.title) {
				var message = receiveJson.message || "";
				var opt = {
					type : "basic",
					title : receiveJson.title,
					message : message,
					iconUrl : "icon.png" //TODO change good icon

				};
				getmesage(opt);
			}

			chrome.browserAction.setBadgeText({
				text : "" + receiveJson.notificationNum
			});

			
		};
		ws.onclose = function(e) {
			console.log("ws close");
			ws = null;
			setTimeout(connect,intervalTime);						
		};
		ws.onopen = function(e) {//TODO auth!
			/* testing by not really uid*/
		
			$.get(id_host + "/id/get/", function(data) {
				//console.log('DATA',data);
				//chrome.tabs.sendMessage(targetTab.id, {type: 'id', data: data});
				if (data != null) {
					//ws.send(JSON.stringify(auth_data));
					ws.send(JSON.stringify({type:"verify",uid:data}));
					//console.log(data);
				} else {
					//turn login page by chrome.tabs.create();
				}
			}); 

			/* just testing ,use mine uid*/
			//ws.send(JSON.stringify({type:"verify",uid:5567}));
			/* testing end */
			console.log("ws open");
		};
		ws.onerror = function(e) {
			console.log("something wrong in ws");
		};
	}; 
	connect();

	//TODO auth method
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
	
	
	
	return {ws:ws};
}
