/* imports */
var tail = require('../lib/tail');
var log = require('../lib/log');

/* local definitions */
var current_grep = "",
current_file = '/var/log/messages',
tail_proc;

module.exports = function(app, io){

  var command = 'tail';  
  /* GET home page */
  app.get('/', function(req, res) {
    log.info("Got get request!!");

    tail.showDirTree('/var/log', function(files){

      res.render('index',{ 
	      title: 'Glare',
	      files: files,
        current_grep: current_grep,
        current_file: current_file,
        command: command
      });
    }); 
  });

  app.post('/', function(req, res){
    log.info("got post request!!!");

    current_grep = (req.body.search)?req.body.search:current_grep;
    log.info("Current_grep is: "+ current_grep);
    current_file = (req.body.filename)?req.body.filename:current_file;
    log.info("Current_file is: "+ current_file);
    command = (req.body.command)?req.body.command:command;
      
    log.info("Command in request is: "+ req.body.command);
    log.info("Command was set to: "+ command);
    
    if(tail_proc){
      log.info("Killing tail process: %s", tail_proc);
      tail.killTail(tail_proc);
    }
    
    if(command === 'tail'){
      
      log.info("Starting new %s process with %s file", command, current_file);  
      tail_proc = tail.doTail(current_file, function(logs){
        lines = logs.split("\n");
        lines.forEach(function(line){
          if(line.indexOf(current_grep) > -1){
            io.sockets.emit('tail', {logs : line});
          }
        });
      }); 
    }
    if(command === 'less'){
      
      tail.doLess(current_file, function(logs){
        lines = logs.split("\n");
        lines.forEach(function(line){
          if(line.indexOf(current_grep) > -1){
            io.sockets.emit('less', {logs: line});
          }
        });
      });
    }
    //log.info("Redirecting to root!!");
    tail.showDirTree('/var/log', function(files){

      res.render('index',{ 
	      title: 'Glare',
	      files: files,
        current_grep: current_grep,
        current_file: current_file,
        command: command
      });
    }); 
  });
};
