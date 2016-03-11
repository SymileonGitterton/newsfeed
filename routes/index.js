// TODO: put any require() calls here
var Post           = require('../models/post.js');		// postsdb is a mongoose object(?)
var api_soundcloud = require('../lib/soundcloud.js');
var api_youtube    = require('../lib/youtube.js');
var api_flickr     = require('../lib/flickr.js');

var resultsSet = [];
var searchesReturned = 0;
var SEARCH_TARGET_COUNT = 3;


var collectResultsAndPublishIfReady = function(error, results, source, response) {
	// log what came back
	console.log("I am the callback that was passed to "+source+" search()");
  	console.log("[publishIfReady] response has type: "+typeof(response)); 

	if (error != null) {
		console.log("ERROR: "+error);	// first parameter not null? an error happened
	} else {
		console.log(results.length+" results received");
	}
	// prepare a result if we got one
	if (results.length > 0) {
		results[0].api = source;
		resultsSet.push(results[0]);
	}
	// render and return html, if all done...
	if (++searchesReturned >= SEARCH_TARGET_COUNT) {		// naked increment of global is not thread safe!!!!
		console.log("got the whole result set");
		for(var i=0;i<resultsSet.length;i++) {
			console.log(resultsSet[i].api+" title="+resultsSet[i].title+"  source="+resultsSet[i].source);
		}
		// now somehow render the resultsSet and give back to the client? as JSON?
		response.setHeader('Content-Type', 'application/json');
		response.send(JSON.stringify(resultsSet));
	}
};


module.exports = function(app) {

  	// root: gives you the rendered index.html
  	app.get('/', function(request, response) {
    	response.render('index.html');
  	});

  	// /search performs the search via three apis
  	app.get('/search', function(request, response) {
		searchesReturned = 0;
		resultsSet = [];
  		var qstring = request.query.query.replace(/ /g, '%20');
  		console.log("request.query.query: "+request.query.query+" type "+typeof(request.query.query)+" qstring: "+qstring);
  		console.log("this is happening because a search came in");

  		// 1. search soundclound
  		api_soundcloud.search(qstring, function(error,results) {
			collectResultsAndPublishIfReady(error,results,'soundcloud',response)
  		}); // end of youtube search


  		// 2. search YubeToob
  		api_youtube.search(qstring, function(error,results) {
			collectResultsAndPublishIfReady(error,results,'youtube',response)
		}); // end of soundcloud search


  		// 3. search fuckr
  		api_flickr.search(qstring, function(error,results) {
  			collectResultsAndPublishIfReady(error,results,'flickr',response)
  		}); // end of flickr search
  	});

  	// fetch all posts from mongodb
  	app.get('/posts', function(request, response) {
  		console.log("here we are in app.get, about to call Post.find()");
		Post.find(function(error, postsSet) {
				if (error) {
					throw error;
				}
  				console.log("this is the postsSet that came back from mongo:");
				console.log(postsSet);
  				// return as JSON
				response.setHeader('Content-Type', 'application/json');
		  		response.send(JSON.stringify(postsSet));
			});
  	});  

  	// create a post object from supplied data and add to Mongo
  	app.post('/posts', function(request, response) {
		var newPost = new Post({
  				api:    request.body.api,
				title: 	request.body.title,
				source: request.body.source,
				upvotes: 0
		});
		// TODO:PMA validate input, respond 422 if not good.
		// save the post to Mongo
		newPost.save(function(error) {
			if (error) {
				throw error;
			}
			// return as JSON
			response.setHeader('Content-Type', 'application/json');
		  	response.send(JSON.stringify(newPost));
		});
	});

  	// remove a post from Mongo
  	app.post('/posts/remove', function(request, response) {
  		console.log("about to remove");
  		Post.findByIdAndRemove(request.body.id, function(error, postForDeletion) {
			if (error) {
				throw error;
			}
			response.setHeader('Content-Type', 'application/json');
		  	response.send();	// return empty			
  		});
  	});


  	// update a post in Mongo
  	app.post('/posts/upvote', function(request, response) {
  		console.log("upvoting now...");
  		Post.findById(request.body.id, function(error, postForUpdating) {
			if (error) {
				throw error;
			}
		});
		postForUpdating.upvotes++;
		// save the post to Mongo
		newPost.save(function(error) {
			if (error) {
				throw error;
			}
			response.setHeader('Content-Type', 'application/json');
			response.send(JSON.stringify(postForUpdating));
  		});
  	});
};
