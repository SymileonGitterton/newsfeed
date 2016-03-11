(function(window, document, undefined) {
  var NewsfeedView = {};

  /* Renders the newsfeed into the given $newsfeed element. */
  NewsfeedView.render = function($newsfeed) {
      console.log("It's all to do in newsfeedView!");
      PostModel.loadAll(function(error, responseObject) {
        // things to do when all the posts come back - 
        console.log("this came back from postModel.loadAll");
        console.log(responseObject);
        for (var i=0;i<responseObject.length;i++) {
          NewsfeedView.renderPost($newsfeed, responseObject[i], false)
        }
        $newsfeed.imagesLoaded(function() {
          $newsfeed.masonry({
          columnWidth: '.post',
          itemSelector: '.post'
          });
        });
     });
  };

  /* Given post information, renders a post element into $newsfeed. */
  NewsfeedView.renderPost = function($newsfeed, post, updateMasonry) {
    // TODO
    console.log("I am supposed to be rendering a post here");
    console.log("this is the post:");
    console.log(post);

    var renpo = Templates.renderPost(post);
    console.log("renpo the rendered template was ");
    console.log(renpo);

    if (updateMasonry) {
      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry('prepended', $post);
      });
    }
  };

  window.NewsfeedView = NewsfeedView;
})(this, this.document);
