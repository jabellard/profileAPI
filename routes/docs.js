var path = require("path");

exports.serveDocs = function(req, res){
  res.sendFile(req.__dirname + "/docs/docs.html");
}
