var app = require('../app');

//var Tail = require('../lib/tail');

app.set('port', process.env.PORT || 3000);

var server = require('http').createServer(app).listen(app.get('port'),function(){
  console.log('Express server listening on port ' + app.get('port'));
});

require('../lib/glare_socket')(server);
/*
var tail = new Tail('/var/log');
tail.showDirTree('/var/log', function(files){
  console.log("Dir content: "+files)
});
*/
