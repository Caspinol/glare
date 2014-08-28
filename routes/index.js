var tail = require('../lib/tail');
var log = require('../lib/log');
var current_grep = "",
current_file = '/var/log/messages',
command = 'tail', tail_proc;

module.exports = function(app, io){

  /* GET home page. */
  app.get('/', function(req, res) {
    
    if(command === 'tail'){
      tail_proc = tail.doTail(current_file, function(logs){
        if(logs.indexOf(current_grep) > -1){
          io.sockets.emit('grep', {logs : logs.toString()});
        }
      });
    }else{
      if(tail_proc)
        tail.killTail(tail_proc);

      tail.doLess(current_file, function(logs){

        if(logs.indexOf(current_grep) > -1){
          io.sockets.emit('grep', {logs : logs.toString()});
        }
      });
    }
    
    tail.showDirTree('/var/log', function(files){
      
      res.render('index', { 
	      title: 'Glare',
	      files: files,
        current_grep: current_grep,
        current_file: current_file,
        command: command
      });
    });
  });
  
  app.post('/grep', function(req,res){
    //kill previous tail
    if(tail_proc)
      tail.killTail(tail_proc);

    current_grep = req.body.search;
    res.redirect('/');
  });

  app.post('/fileselect', function(req,res){
    //kill running tail
    if(tail_proc)
      tail.killTail(tail_proc);

    current_file = req.body.filename;
    res.redirect('/');
  });

  app.post('/command', function(req,res){
    
    if(tail_proc)
      tail.killTail(tail_proc);
    
    command = req.body.cmd;
    res.redirect('/');
  });
};
