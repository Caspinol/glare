var express = require('express');
var router = express.Router();
var Tail = require('../lib/tail');

/* GET home page. */
router.get('/', function(req, res) {
  var tail = new Tail();

  var files = tail.showDirTree('/var/log', function(files){
    res.render('index', { 
      title: 'Glare',
      files: files
    });
  });
});

module.exports = router;
