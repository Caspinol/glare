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
  });

  $("#submit_cmd").click(function(e){
    
    $.ajax({
      url: '/',
      method: 'POST',
      data: {command : $('#submit_cmd').val()},
      success: function(data){
        
        $('#log_list').empty();

        if(data.command === 'tail'){
          $('#submit_cmd').val('less');
        }else{
          $('#submit_cmd').val('tail');
        }
      }
    });
  });

  $('#submit_search').click(function(e){
    
    $.ajax({
      url: '/',
      method: 'POST',
      data: $('#grep_form').serialize(),
      success: function(data){
        
        $('#log_list').empty();
        $('#grep > label').text('Grepping: '+data.grep);
      }
    });
  });
                         
  $('#submit_file').click(function(e){

    $.ajax({
      url: '/',
      method: 'POST',
      data: $('#file_form').serialize(),
      success: function(data){
        
        $('#log_list').empty();
        $('#file > label').text("File: "+data.file);
      }
    });
  });
});


