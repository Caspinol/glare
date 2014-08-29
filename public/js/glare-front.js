$(document).ready(function(){

  var socket = io.connect('localhost:3000');
  
  socket.on('status', function(data){
    //$('#log_list').append('<li>Status: '+data.message+'</li>');
  });
  
  socket.on('tail', function(data){
    alert("tail : "+data);
    $('#log_list').append('<li>Tail: '+data.logs+'</li>');
  });
  
  socket.on('less', function(data){
    alert("less" +data.message);
    $('#log_list').append('<li>Less: '+data.message+'</li>');
    console.log(data.message);
  });
});

var cmd = 

