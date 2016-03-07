(function(window, document, undefined) {
  var SearchModel = {};

  var SEARCH_URL = '/search';
  var STATUS_OK = 200;

  /**
   * Loads API search results for a given query.
   *
   * Calls: callback(error, results)
   *  error -- the error that occurred or NULL if no error occurred
   *  results -- an array of search results
   */
  SearchModel.search = function(query, callback) {
    console.log("incoming query: "+query);
    query = encodeURIComponent(query);
    console.log("encoded query: "+query);

    // 1) create an XMLHttpRequest object
    var hackReq = new XMLHttpRequest();
    
    // 2) Handle the 'load' event with this code:
    hackReq.addEventListener('load', function() {                 // callback for when load completes from server
            if (hackReq.status != STATUS_OK) {
              callback(hackReq.responseText);
            } else {
              callback(null,JSON.parse(hackReq.responseText));
            }
        });

    // 3) open a URL with the correct request type
    //hackURL = "http://127.0.0.1:3000"+SEARCH_URL+"/?query="+query;
    hackURL = SEARCH_URL+"/?query="+query;
    console.log("encoded search URL: "+hackURL);
    hackReq.open('GET', hackURL);

    // 4) set the content-type header, if this is a POST
    hackReq.setRequestHeader("Content-type", "application/json");

    // 5) send the request to the server, with parameters if a POST
    hackReq.send(); 
    // done; exit and await 'load' callback
  };

  window.SearchModel = SearchModel;
})(this, this.document);
