var crud = require("../modules/crud");

exports.read = function(req, res, next){
  crud.read(req, res);
  next();
}

exports.create = function(req, res, next){
  crud.create(req, res);
  next();
}

exports.update = function(req, res, next){
  crud.update(req, res);
  next();
}

exports.delete = function(req, res, next){
  crud.delete(req, res);
  next();
}
