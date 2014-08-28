var socket = io.connect('localhost:3000');


socket.on('logevent', function(data){
  $('#log_list').append('<li>Log: '+data.logs+'</li>');
});

socket.on('grep', function(data){
  alert(data);
  $('#log_list').append('<li>Grepped: '+data.logs+'</li>');
});
