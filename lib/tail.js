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
  var less;
  
  //find the extension
  var ext = file.substring(file.length - 3, file.length);
  if(ext === '.gz'){
    less = spawn('zcat', [file]);
  }else if(ext === '.xz'){
    less = spawn('xzcat', [file]);
  }else{
    less = spawn('cat', [file]);
  }

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


tail.showDirTree = function(dir, cb){
  
/*
  this is troublesome because the js callback system
*/

  var self = this;
  var fileTree = [];

  fs.readdir(dir, function(e, list){
    //error so just abort
    if(e) return cb(null);

    var fileNum = list.length;
    //scan trough all files in root dir
    if(fileNum === 0) return cb(fileTree);
    
    list.forEach(function(file){
      file = dir+'/'+file;
      fs.stat(file, function(e, stat){
        if(stat.isDirectory()){
          self.showDirTree(file, function(sublist){
            fileTree = fileTree.concat(sublist);
            if((--fileNum) === 0) return cb(fileTree);
          });
        }else{
          fileTree.push(file);
          if((--fileNum) === 0) return cb(fileTree);
        }
      });
    });
  });
  
};
             
module.exports = tail;
