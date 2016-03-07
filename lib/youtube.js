var request = require('request');
var https = require('https');

var YT_URL = 'https://www.googleapis.com/youtube/v3/search';
var YT_API_KEY = 'AIzaSyDDP01Gnj3-wfoqM59xQz6pryJQhmYWCt8';
var YT_EMBED_URL = 'http://www.youtube.com/embed/';

var aGlobalThingy = {};

/**
 * Queries YouTube for tracks that match the given query
 * 
 * @param query - the search query to send to YouTube
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
	console.log("I am the search function in our youtube.js file");

	var options = {
		host: 'www.googleapis.com',
		path: '/youtube/v3/search?key='+YT_API_KEY+"&q="+query+"&type=video&part=snippet",
		headers: {
			"Content-Type": "application/json"
		}
	};

	var req = https.get(options, function(respo) {
  		console.log("Got response status: " + respo.statusCode);
  		if (respo.statusCode != "200") {
  			console.log("the status code was not 200");
  			console.log(respo);
  			callback(respo.statusCode);
  		} else {
  			var str = '';
  			respo.on('data', function(chunk) {		// gather response data and piece it together
  				console.log(chunk.length+" data event arrived...")
  				str += chunk;
  			});
  			respo.on('end', function() {			// we have the full response from soundcloud now
    			console.log('now the end event has arrived - eat up the '+str.length+' characters!');
    			var repObj = JSON.parse(str);
    			//console.log(repObj);
    			console.log("the response delivered an object containing "+repObj.items.length+" items");
    			//console.log("here is the first one:");
    			//console.log(repObj.items[0]);
    			var searchResults = [];
    			for (var i=0;i<repObj.items.length;i++) {
    				searchResults.push({title:  repObj.items[i].snippet.title,
    									          source: YT_EMBED_URL+repObj.items[i].id.videoId
    								            })
    			}
     			//for (var i=0;i<searchResults.length;i++) {
    			//	console.log(i+" "+searchResults[i].id+" "+searchResults[i].title);
    			//}   
    			//aGlobalThingy = repObj;
    			console.log("now let's call the callback code that was passed into this search function...");
    			callback(null,searchResults);
  			});
  		}
	});

	req.on('error', function(e) {					// request error
  		console.log("Got error: " + e.message);
  		callback(e.message);
	});

};
