
/**
 * Module dependencies.
 */

var express = require('express')
  , socketio = require('socket.io')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// socket.io
var io = socketio.listen(app);
var count = 0;
io.sockets.on('connection', function(socket) {
  // connect
  count++;
  io.sockets.emit('count change', count);
  
  // sound
  socket.on('play sound', function (data) {
    socket.broadcast.emit('someone plays sound', data);
  });
  
  socket.on('disconnect', function() {
    // disconnect
    count--;
    socket.broadcast.emit('count change', count);
  });
});
