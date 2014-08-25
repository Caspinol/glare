var fs = require('fs'),
path = require('path');

function Tail(filename){
  this.filename = filename;
}

Tail.prototype.showDirTree = function(dir, callback){
 
  var self = this;
  var files = fs.readdirSync(dir);
  var fileTree = []; 

  for(var i in files){
    var cFile = dir +'/' +files[i];

    var status = fs.statSync(cFile);
    if(status.isFile()){
      fileTree.push(cFile);
      //console.log(cFile)
    }else if(status.isDirectory()){
      self.showDirTree(cFile);
    }
  }
  
  if(callback){

    callback(fileTree);
  }
};
             
module.exports = Tail;