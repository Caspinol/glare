var tail = require('../lib/tail');
var log = require('../lib/log');
var current_grep = "", fileList;

module.exports = function(app, io){
  
  /*start sockets.io listener*/
  var tail_proc = tail.doTail('/var/log/dmesg',  function(logs){
    io.sockets.emit('logevent', {logs : logs.toString()});
  });

  /* GET home page. */
  app.get('/', function(req, res) {
    
    tail_proc = tail.doTail('/var/log/messages', function(logs){
      if(logs.indexOf(current_grep) > -1){
        io.sockets.emit('grep', {logs : logs.toString()});
      }
    });
    
    tail.showDirTree('/var/log', function(files){
      fileList = files;
      res.render('index', { 
	      title: 'Glare',
	      files: files
      });
    });
  });
  
  app.post('/grep', function(req,res){
    //kill previous tail
    tail.killTail(tail_proc);

    current_grep = req.body.search;
    res.redirect('/');
  });
};
