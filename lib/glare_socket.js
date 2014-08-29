var log = require('./log');
//var tail = require('./tail');

module.exports = function(server){

  //use the express app to create socket.io server
  var io = require('socket.io').listen(server);  

  io.sockets.on('connection', function(client){
    log.info("Client connected!");
    client.emit('status', {message: "connected"});
  });

  return io;
}

