
var colorize = function(string, grep){

  //console.log("Before replace: %s", string);
  var retString = string.replace(grep, '<span id="grep_color">'+grep+'</span>');
  //console.log("retString :"+retString);
  return retString;
};

module.exports = colorize;