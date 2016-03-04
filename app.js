console.log(" >>> let us begin");
var http = require('http');
console.log(" >>> http has been requied");
var express = require('express');
console.log(" >>> express has been requied");
var app = express();
console.log(" >>> express has been instantiated: " + app);
//console.log(app);

console.log(" >>>>>> about to require mongoose");
var mongoose = require('mongoose');
console.log(" >>> mongoose has been requied");
mongoose.connect('mongodb://localhost:27017/callback-newsfeed-db');

var server = http.createServer(app);

require('./settings.js')(app, express);
require('./routes/index.js')(app);

server.listen(process.env.PORT || 3000);
console.log('Listening at 127.0.0.1:' + 3000);
