// TODO: put any require() calls here
var api_soundcloud = require('../lib/soundcloud.js');
var api_youtube    = require('../lib/youtube.js');
var api_flickr     = require('../lib/flickr.js');
var resultsSet = [];
var searchesReturned = 0;

var SEARCH_TARGET_COUNT = 3;

var collectResultsAndPublishIfReady = function(error, results) {
	// log what came back
	if (error != null) {
		console.log("ERROR: "+error);	// first parameter not null? an error happened
	} else {
		for(var i=0;i<results.length;i++) {
			console.log(i+" "+results[i].id+" "+results[i].title);
		}
	}
	// prepare a result if we got one
	if (results.length >0) {
		results[0].api = 'soundcloud';
		resultsSet.push(results[0]);
	}
	// render and return html, if all done...
	if (++searchesReturned >= SEARCH_TARGET_COUNT) {		// naked increment of global is not thread safe!!!!
		console.log("got the whole result set");
		for(var i=0;i<resultsSet.length;i++) {
			console.log(resultsSet[i].api+" "+resultsSet[i].id+" "+resultsSet[i].title);
		}
		// now somehow render the resultsSet and give back to the client?
	}
};


module.exports = function(app) {
  	/* Renders the newsfeed landing page. */
  	app.get('/', function(request, response) {
    	response.render('index.html');
  	});

  	app.get('/search', function(request, response) {
		resultsSet = [];
  		var qstring = request.query.query.replace(' ', '%20');
  		//console.log("request.query.query: "+request.query.query+" type "+typeof(request.query.query)+" qstring: "+qstring);

  		// 1. search soundclound
  		api_soundcloud.search(qstring, function(error, results) {
			console.log("I am the callback that was passed to soundcloud search()\n");
			//if (error != null) {
			//	console.log("ERROR: "+error);	// first parameter not null? an error happened
			//} else {
			//	for(var i=0;i<results.length;i++) {
			//		console.log(i+" "+results[i].id+" "+results[i].title);
			//	}
			//}
			collectResultsAndPublishIfReady(error,results);
  		}); // end of youtube search


  		// 2. search YubeToob
  		api_youtube.search(qstring, function(error, results) {
			console.log("I am the callback that was passed to youtube search()\n");
			collectResultsAndPublishIfReady(error,results);
  		}); // end of soundcloud search


  		// 3. search fuckr
  		api_flickr.search(qstring, function(error, results) {
			console.log("I am the callback that was passed to flickr search()\n");
			collectResultsAndPublishIfReady(error,results);
  		}); // end of flickr search

  	});

};
