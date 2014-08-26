var socket = io.connect('localhost:3000');


socket.on('welcome', function(data){
  $('#log_list').append('<li>'+data.message+'</li>')
});

socket.on('time', function(data){
  $('#log_list').append('<li>'+data.time+'</li>')
});

socket.on('logevent', function(data){
  $('#log_list').append('<li>'+data.log+'</li>');
});
