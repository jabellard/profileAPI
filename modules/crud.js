var mongoose = require("mongoose");
var profileModel = require("../models/profile");

exports.read = function(req, res){
  req._model.find(req._query, {_id: false, __v: false}, function(err, doc){
    if(err){
      cosole.log(err);
      res.status(500);
      res.set({
        "Content-Type": "text/pain"
      });
      res.send("Internal Sever Error.");
      return;
    }
    else {
      res.status(200);
      res.json({
        results: doc
      });
      return;
    }
  })
}

exports.paginate = function(req, res){
;
}

exports.create = function(req, res){
  console.log("req.body =------------");
  console.log(req.body);
  var doc = profileModel.toProfile(req.body);
  if(!doc){
    res.status(400);
    res.set({
      "Content-Type": "text/plain"
    })
    res.send("Bad Request: Invalid document.");
    return;
  }
  doc.validate(function(err){
    if (err) {
      console.log("validation error: ------------");
      console.log(err);
      console.log("validation error: ------------");

      res.status(400);
      res.set({
        "Content-Type": "text/plain"
      });
      res.send("Bad Request: Invalid document.");
    }
    else{
      doc.save(function(err){
        if(err){
          console.log("before-----------------------");
          console.log(err);
          console.log("after---------------------");
          req._model.findOne({id: doc.id}, function(err, doc){
            if (err) {
              console.log(err);
              res.status(500);
              res.set({
                "Content-Type": "text/pain"
              });
              res.send("Internal Sever Error.");
            }
            else {
              console.log("found doc = " + doc);
              if (doc) {
                res.status(400);
                res.set({
                  "Content-Type": "text/pain"
                })
                res.send("Bad Request: Document with id " + doc.id + " already exists.");
              }
              else {
                res.status(500);
                res.set({
                  "Content-Type": "text/pain"
                });
                res.send("Internal Sever Error.");
              }
            }
          });
          return;
        }
        else {
          res.status(200);
          res.set({
            "Content-Type": "text/pain"
          })
          res.send("Created document with id " + doc.id + ".");
        }
      });
    }
    return;
  });
}

exports.update = function(req, res){
  req._model.findOne({id: req.body.id}, function(err, doc){
    if (err) {
      console.log(err);
      res.status(500);
      res.set({
        "Content-Type": "text/pain"
      });
      res.send("Internal Sever Error.");
    }
    else {
      if (doc) {
        doc.firstName = req.body.firstName;
        doc.lastName = req.body.lastName;
        doc.age = req.body.age;
        doc.gender = req.body.gender;
        doc.validate(function(err){
          if(err){
            console.log(err);
            res.status(400);
            res.set({
              "Content-Type": "text/plain"
            });
            res.send("Bad Request: Invalid document.");
          }
          else {
            doc.save(function(err){
              if (err) {
                console.log(err);
                res.status(500);
                res.set({
                  "Content-Type": "text/pain"
                });
                res.send("Internal Sever Error.");
              }
              else {
                res.status(200);
                res.set({
                  "Content-Type": "text/pain"
                });
                res.send("Updated document with id " + req.body.id + ".");
              }
            });
          }
          return;
        });
      }
      else{
        res.status(400);
        res.set({
          "Content-Type": "text/pain"
        });
        res.send("Bad Request: Document with id " + req.body.id + " does not exist.");
      }
    }
  })
}

exports.delete = function(req, res){
  req._model.findOne({id: req.query.id}, function(err, doc){
    if (err) {
      console.log(err);
      res.status(500);
      res.set({
        "Content-Type": "text/pain"
      });
      res.send("Internal Sever Error.");
    }
    else {
      if (doc) {
        doc.remove(function(err){
          if (err) {
            console.log(err);
            res.status(500);
            res.set({
              "Content-Type": "text/pain"
            });
            res.send("Internal Sever Error.");
          }
          else {
            res.status(200);
            res.set({
              "Content-Type": "text/pain"
            });
            res.send("Removed document with id " + req.query.id + ".");
          }
        })
      }
      else{
        res.status(400);
        res.set({
          "Content-Type": "text/pain"
        });
        res.send("Document with id " + req.query.id + " does not exist.");
      }
    }
  })
}
