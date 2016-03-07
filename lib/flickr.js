var request = require('request');
var https = require('https');

var FLICKR_URL = 'https://api.flickr.com/services/rest/?';
var FLICKR_API_KEY = '3cffcc97867ea6aaf3d7fa2690f0ae10';
var STATUS_OK = 200;

/**
 * Queries Flickr for photos that match the given query.
 *
 * @param query -- the search query to send to Flickr
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
	console.log("I am the search function in our flickr.js file");

	var options = {
		host: 'api.flickr.com',
		path: '/services/rest/?api_key='+FLICKR_API_KEY+"&text="+query+"&method=flickr.photos.search&format=json&media=photos&sort=relevance&nojsoncallback=1",
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
    			console.log("the response delivered an object containing "+repObj.photos.photo.length+" items");
    			console.log("here is the first one:");
    			console.log(repObj.photos.photo[0]);
    			var searchResults = [];
    			for (var i=0;i<repObj.photos.photo.length;i++) {
    				searchResults.push({title:  repObj.photos.photo[i].title,
    									source: 'https://farm'+repObj.photos.photo[i].farm
    									         +'.staticflickr.com/'+repObj.photos.photo[i].server
    									         +'/'+repObj.photos.photo[i].id
    									         +'_'+repObj.photos.photo[i].secret
    									         +'_z.jpg'
    								  })
    			}
     			//for (var i=0;i<searchResults.length;i++) {
    			//   console.log(i+" "+searchResults[i].source+" "+searchResults[i].title);
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
