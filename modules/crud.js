var mongoose = require("mongoose");

exports.read = function(req, res){
  console.log("read method");
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
  console.log("paginate methd");
  var options = {
    select: {
      _id: false
    },
    page: req.query.page || res.__model.defaultPaginationPage,
    limit: req.query.limit || res.__model.defaultPaginationLimit
  };

  req._model.paginate(req._query, options, function(err, results){
    if (err) {
      console.log(err);
      res.status(500);
      res.set({
        "Content-Type": "text/plain"
      });
      res.send("Internal Sever Error");
      res.end();
    }
    else {
      res.status(200);
      res.json({
        totalDocs: results.total,
        totalPages: results.pages,
        docsPerPage: results.limit,
        currentPage: results.page,
        results: results.docs
      });
      res.end();
    }
  })
}

exports.create = function(req, res){
  console.log("req.body =------------");
  console.log(req.body);
  var doc = req._doc;
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
  req._model.findOne({id: req._query.id}, function(err, doc){
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
                res.send("Updated document with id " + req._query.id + ".");
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
        res.send("Bad Request: Document with id " + req._query.id + " does not exist.");
      }
    }
  })
}

exports.delete = function(req, res){
  req._model.findOne({id: req._query.id}, function(err, doc){
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
            res.send("Removed document with id " + req._query.id + ".");
          }
        })
      }
      else{
        res.status(400);
        res.set({
          "Content-Type": "text/pain"
        });
        res.send("Document with id " + req._query.id + " does not exist.");
      }
    }
  })
}
