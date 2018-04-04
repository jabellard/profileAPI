var crud = require("../modules/crud");
var schemaFields = require("../models/profile").schemaFields;

exports.read = function(req, res){
  console.log("get request");
  if (req.query.limit || req.query.page) {
    console.log("pagiantion request");
    console.log("limit = " + req.query.limit);
    console.log("page = " + req.query.page);

    crud.paginate(req, res);
  }
  else {
    crud.read(req, res);
  }
}

exports.create = function(req, res){
  crud.create(req, res);
}

exports.update = function(req, res){
  crud.update(req, res);
}

exports.delete = function(req, res){
  crud.delete(req, res);
}

exports.parseQueryString = function(req, res, next){
  req._query = {};
  console.log("query string = ");
  console.log(req.query);
  for(var i = 0; i < schemaFields.length; i++){
    if (req.query[schemaFields[i]]) {
      req._query[schemaFields[i]] = req.query[schemaFields[i]];
    }
  }
  console.log("_query string = ");
  console.log(req._query);
  next();
}
