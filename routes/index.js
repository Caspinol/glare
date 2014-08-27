var tail = require('../lib/tail');


module.exports = function(app, io){
  
  /*start sockets.io listener*/
  tail.doTail('/var/log/messages', function(logs){
    io.sockets.emit('logevent', {logs : logs.toString()});
  });
  /* GET home page. */
  app.get('/', function(req, res) {
    
    var files = tail.showDirTree('/var/log', function(files){
      res.render('index', { 
	title: 'Glare',
	files: files
      });
    });
  });
};
