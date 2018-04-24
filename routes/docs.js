var path = require("path");

exports.serveHtml = function(req, res){
  res.sendFile(__dirname + "/docs/docs.html");
  res.end();
}
