var fs = require('fs'),
spawn = require('child_process').spawn,
log = require('./log');

var tail = {};

tail.doTail = function(file, callback){

  var tail = spawn('tail', ['-f', file]);

  log.info("Tailling file: %s", file);

  tail.stdout.on('data', function(data){
    
    if(callback){
      callback(data.toString());
    }
  });
  
  tail.stderr.on('data', function(data){
    
    if(callback){
      callback("STDERR: "+ data.toString());
    }
  });
  
  tail.on('close', function(code){
    if (code !== 0) {
      log.error('tail process exited with code ' + code);
    }
  });

  return tail;
}

tail.killTail = function(tail_proc){
  tail_proc.kill('SIGHUP');
}

tail.doLess = function(file, callback){
  var less = spawn('less', [file]);

  less.stdout.on('data', function(data){
    
    if(callback){
      callback(data.toString());
    }
  });

  less.stderr.on('data', function(data){
    if(callback){
      callback(data.toString());
    }
  });
}

tail.showDirTree = function(dir, callback){
  

  var self = this;
  var files = fs.readdirSync(dir);
  var fileTree = []; 
  
  for(var i in files){
    var cFile = dir +'/' +files[i];
    
    var status = fs.statSync(cFile);
    if(status.isFile()){
      fileTree.push(cFile);
      
    }else if(status.isDirectory()){
      self.showDirTree(cFile);
    }
  }
  
  if(callback){
    callback(fileTree);
  }
};
             
module.exports = tail;
