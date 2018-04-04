exports.parseQueryString = function(req, res, next){
  req._query = {};
  var schemaFields = req._schemaFields;
  for(var i = 0; i < schemaFields.length; i++){
    if (req.query[schemaFields[i]]) {
      req._query[schemaFields[i]] = req.query[schemaFields[i]];
    }
  }
  next();
}
