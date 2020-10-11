

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}


chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {

  if (typeof tab.url !== "undefined" && changeInfo.status == "complete" && tab.status == 'complete' && tab.url.indexOf("https://classroom.google.com/") > -1 ) {


  	const sendnewtimeout = 2 * 60500; // 2 minutes (with a bit of leeway)

    chrome.storage.local.get(null, function(data){
    	var currentuuid = data.uuidv4; 
    	console.log(data);

    	

    	if (typeof data.uuidv4 === 'undefined'){
    		let newuuid = uuidv4();
    		chrome.storage.local.set({'uuidv4': newuuid}, function() {});
    		currentuuid = newuuid;

    		
    	} 


    	if (typeof data.lastrequest === 'undefined' || Date.now() - data.lastrequest > sendnewtimeout) {
    		if(data.lastrequest != 'undefined') {
    			console.log((Date.now() - data.lastrequest)/1000 );
    		}

    		



    		chrome.storage.local.set({'lastrequest': Date.now()}, function(){});
    		var xhr;
    		if (window.XMLHttpRequest) {
		        //New browsers.
		        xhr = new XMLHttpRequest();
		        // chrome.tabs.executeScript({code: 'document.body.style.backgroundColor="red"'});
		    }
		    else if (window.ActiveXObject) {
		        //Old IE Browsers.
		        xhr = new ActiveXObject("Microsoft.XMLHTTP");
		    }

		    if(xhr != null) {

		    	


		    	jsonstuff = JSON.stringify({"uuid": currentuuid, "hostname": extractHostname(tab.url)});
		    	xhr.open("POST", "http://gavinrohrer.com/datacollection/index.php?jsload="+jsonstuff);
		    	xhr.send();
		    	// console.log("made request");



		    } else {
		    	console.log("xhr declare failure");
		    }

    	}
    });
  }
});
