var fs = require('fs'),
spawn = require('child_process').spawn,
log = require('./log');

var tail = {};

tail.doTail = function(file, callback){

  var tail = spawn('tail', ['-f', file]);
  log.info("Tailling file: %s", file);

  tail.stdout.on('data', function(data){
    log.info("Raw tail output: %s",data);
    if(callback){
      callback(data.toString());
    }
  });

  tail.stderr.on('data', function(data){
    log.info("Raw tail output: %s",data);
    if(callback){
      callback("STDERR: "+ data.toString());
    }
  });

  tail.on('close', function(code){
    if (code !== 0) {
      log.warning('ps process exited with code ' + code);
    }
  });
}

tail.showDirTree = function(dir, callback){
  
  log.info("Scanning directory: %s", dir);

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
