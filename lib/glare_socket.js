var log = require('./log');
var Tail = require('./tail');
var tail = new Tail();

module.exports = function(server){

  //use the express app to create socket.io server
  var io = require('socket.io').listen(server);  

  io.sockets.on('connection', function(client){
    
  });

  tail.showDirTree('/var/log', function(files){                                                                                                                     
    console.log("Dir content: "+files);
  });
  
  tail.doTail('/var/log/messages', function(logs){
    if(logs){
      io.sockets.emit('logevent', {logs: logs});
    }
  });
  

  // Send current time every 10s
  setInterval(sendTime, 10000);
  
  function sendTime(){
    io.sockets.emit('time', { time: new Date().toJSON() });
  }
}

