var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
  api:     String,
  source:  String,
  title:   String,
  upvotes: Number
});

var Post = mongoose.model('Post', postSchema);
module.exports = Post;		// anyone who does var foo require() this will get foo.Post, 
							// which is a postSchema-shaped mongoose model.
