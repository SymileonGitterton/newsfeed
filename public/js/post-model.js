(function(window, document, undefined) {
  var PostModel = {};

  var POSTS_URL= '/posts';
  var STATUS_OK = 200;

  /**
   * Loads all newsfeed posts from the server.
   *
   * Calls: callback(error, posts)
   *  error -- the error that occurred or null if no error occurred
   *  results -- an array of newsfeed posts
   */
  PostModel.loadAll = function(callback) {
    console.log("got into PostModel.loadAll");

    // 1) create an XMLHttpRequest object
    var request = new XMLHttpRequest();
    
    // 2) Handle the 'load' event with this code:
    request.addEventListener('load', function() {                 // callback for when load completes from server
            if (request.status != STATUS_OK) {
              console.log("in loadAll, ERROR");
              callback(request.responseText);
            } else {
              console.log("in loadAll, here's what we got - ");
              console.log(request.responseText);
              callback(null,JSON.parse(request.responseText));
            }
        });

    // 3) open a URL with the correct request type
    request.open('GET', POSTS_URL);

    // 4) set the content-type header
    request.setRequestHeader("Content-type", "application/json");

    // 5) send the request to the server, with parameters if a POST
    request.send();

    // done; exit and await 'load' callback
  };

  /* Adds the given post to the list of posts. The post must *not* have
   * an _id associated with it.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the post added, with an _id attribute
   */
  PostModel.add = function(post, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() {
            if (request.status != STATUS_OK) {
              callback(request.responseText);
            } else {
              callback(null,JSON.parse(request.responseText));
            }
        });
    request.open('POST', POSTS_URL);
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(post));   // is this already JSON or not?
  };

  /* Removes the post with the given id.
   *
   * Calls: callback(error)
   *  error -- the error that occurred or null if no error occurred
   */
  PostModel.remove = function(id, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() {
            if (request.status != STATUS_OK) {
              callback(request.responseText);
            } else {
              callback(null);
            }
        });
    request.open('POST', POSTS_URL+'/remove');
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(id));   // is this already JSON or not?  
  };

  /* Upvotes the post with the given id.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the updated post model
   */
  PostModel.upvote = function(id, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() {
            if (request.status != STATUS_OK) {
              callback(request.responseText);
            } else {
              callback(null,JSON.parse(request.responseText));
            }
        });
    request.open('POST', POSTS_URL+'/upvote');
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(id));   // is this already JSON or not?  
  };

  window.PostModel = PostModel;
})(this, this.document);
