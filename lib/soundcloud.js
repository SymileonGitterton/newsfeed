var request = require('request');

var SC_URL = 'https://api.soundcloud.com/tracks.json';
var SC_CLIENT_ID = '1c3aeb3f91390630d351f3c708148086';
var SC_EMBED_URL = 'https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F';

/**
 * Queries SoundCloud for tracks that match the given query.
 *
 * @param query -- the search query to send to SoundCloud
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
	console.log("I am the search function in our soundcloud.js file");
	/*
	var options = {
  		host: 'www.google.com',
  		port: 80,
  		path: '/index.html'
	};
	*/
	var options = {
		host: 'api.soundcloud.com',
		path: '/tracks.json?client_id='+SC_CLIENT_ID+"&q="+query,
		headers: {
			"Content-Type": "application/json"
		}
	};

	var req = http.get(options, function(respo) {
  		console.log("Got response status: " + respo.statusCode);
  		if (respo.statusCode != "200") {
  			console.log("the status code was not 200");
  			callback(respo.statusCode,null);
  		} else {
  			var str = '';
  			respo.on('data', function(chunk) {		// gather response data and piece it together
  				str += chunk;
  			});
  			respo.on('end', function() {			// we have the full response from soundcloud now
    			console.log('response is complete at '+str.length+' characters');
    			var repObj = JSON.parse(str);
    			var searchResults = [];
    			for (var i=0;i<repObj.length;i++) {
    				searchResults.push({title: repObj[i].title,
    									id:    SC_EMBED_URL+repObj[i].id
    								  })
    			}
     			//for (var i=0;i<searchResults.length;i++) {
    			//	console.log(i+" "+searchResults[i].id+" "+searchResults[i].title);
    			//}   
    			callback(null,searchResults);
  			});
  		}
	});

	req.on('error', function(e) {					// request error
  		console.log("Got error: " + e.message);
  		callback(e.message,null);
	});

};
