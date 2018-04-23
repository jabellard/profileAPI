var bcrypt = require("bcrypt-nodejs");
var crud = require("../modules/crud");
var schemaFields = require("../models/user").searchableSchemaFields;

exports.read = function(req, res){
  if (req.query.limit || req.query.page) {
    crud.paginate(req, res);
  }
  else {
    crud.read(req, res);
  }
}

exports.create = function(req, res){
  req._doc = req.__model.toDoc(req.body);
  if(!req._doc){
    res.status(400);
    res.json({
      message: "Bad Request: Invalid document."
    });
    res.end();
  }
  else{
    req._doc.validate(function(err){
      if (err) {
        console.log(err);
        res.status(400);
        res.json({
          message: "Bad Request: Invalid document."
        });
        res.end();
      }
      else{
        var salt = bcrypt.genSaltSync(5);
        bcrypt.hash(req._doc.password, salt, null, function(err, hash){
          if (err) {
            console.log(err);
            res.status(500);
            res.json({
              message: "Internal Sever Error."
            });
            res.end();
          }
          else {
            req._doc.password = hash;
            crud.create(req, res);
          }
        });
      }
  });
}
}

exports.update = function(req, res){
  crud.update(req, res);
}

exports.delete = function(req, res){
  crud.delete(req, res);
}
