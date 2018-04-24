var path = require("path");

exports.serveHtml = function(req, res){
  console.log("in module: " + req.__dirname + "/docs/docs.html");
  res.sendFile(req.__dirname + "/docs/docs.html");
}
