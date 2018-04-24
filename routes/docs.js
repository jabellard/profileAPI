exports.serveDocs = function(req, res){
  res.sendFile(req.__dirname + "/docs/docs.html");
}
