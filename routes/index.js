/* imports */
var tail = require('../lib/tail');
var log = require('../lib/log');
var colorize = require('../lib/mod');

module.exports = function(app, io){

  /* local definitions */
  var fields = {};
  fields.grep = "",
  fields.file = '/var/log/messages',
  fields.command = 'tail';

  fields.title = 'GLARE';

  /* GET home page */
  app.get('/', function(req, res) {
    log.info("Got get request!!");

    //start the default tail process
    tail_proc = tail.doTail(fields.file, function(logs){
      var lines = logs.split("\n");
      lines.forEach(function(line){
        if(line.indexOf(fields.grep) > -1){
          io.sockets.emit('tail', {logs : line});
        }
      });
    }); 
    
    //scan the directory
    tail.showDirTree('/var/log', function(files){
      fields.files = files;

      res.render('index',{ 
        fields : fields
      });
    }); 
  });


  /* Handle the POST for updates */
  app.post('/', function(req, res){

    log.info("RAW GREP  :%s", req.body.search);
    log.info("GREP: %s", req.body.clear);
    
    if(req.body.search){
      fields.grep = req.body.search;
    }else{
      fields.grep = "";
    }
    log.info("GREP: %s",fields.grep);
    fields.file = (req.body.filename)?req.body.filename:fields.file;
    
    fields.command = (req.body.command)?req.body.command: fields.command;
      
    
    if(tail_proc){
      log.info("Killing tail process: %s", tail_proc);
      tail.killTail(tail_proc);
    }
    
    if(fields.command === 'tail'){
      
      log.info("Starting new %s process with %s file", fields.command, fields.file);  
      tail_proc = tail.doTail(fields.file, function(logs){
        
        var lines = logs.split('\n');
        lines.forEach(function(line){
          if(line.indexOf(fields.grep) > -1){
            //colorize the grepped word
            var l = colorize(line, fields.grep);
            l = '<li>Tail: '+l+'</li>';
            io.sockets.emit('tail', {logs : l});
          }
        });
      }); 
    }

    if(fields.command === 'less'){
      
      log.info("Starting new %s process with %s file", fields.command, fields.file);      
      tail.doLess(fields.file, function(logs){
        var lines = logs.split("\n");
        lines.forEach(function(line){
          if(line.indexOf(fields.grep) > -1){
            
            //colorize the grepped word
            var l = colorize(line, fields.grep);
            l = '<li>Less: '+l+'</li>';
            io.sockets.emit('less', {logs: l});
          }
        });
      });
    }
    //update client with new values
    res.status(200).json(fields);
  });
};
