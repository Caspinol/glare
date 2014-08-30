$(document).ready(function(){

  var socket = io.connect('localhost:3000');
  
  socket.on('status', function(data){
    $('#log_list').append('<li>Status: '+data.message+'</li>');
  });
  
  socket.on('tail', function(data){
    $('#log_list').append('<li>Tail: '+data.logs+'</li>');
  });
  
  socket.on('less', function(data){
    $('#log_list').append('<li>Less: '+data.logs+'</li>');
    console.log(data.message);
  });

  $("#submit_cmd").click(function(e){
    
    $.ajax({
      url: '/',
      method: 'POST',
      data: $('#command_form').serialize(),
      dataType: 'text',
      success: function(data){
        
        $('#log_list').empty();
        
        if($('#submit_cmd').val() === 'tail'){
          $('#submit_cmd').val('less');
          $('#hidden_cmd').val('less');
        }else{
          $('#submit_cmd').val('tail');
          $('#hidden_cmd').val('tail');
        }
      }
    });
  });

  $('#submit_search').click(function(e){
    
    $.ajax({
      url: '/',
      method: 'POST',
      data: $('#grep_form').serialize(),
      dataType: 'text',
      success: function(data){
        $('#log_list').empty();
      }
    });
  });

  $('#submit_file').click(function(e){

    $.ajax({
      url: '/',
      method: 'POST',
      data: $('#file_form').serialize(),
      dataType: 'text',
      success: function(data){
        $('#log_list').empty();
      }
    });
    //e.preventDefault();
  });
});


