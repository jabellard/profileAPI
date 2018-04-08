var mongoose = require("mongoose");

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
  var options = {
    select: {
      _id: false,
      __v: false
    },
    page: req.query.page || req.__model.defaultPaginationPage,
    limit: req.query.limit || req.__model.defaultPaginationLimit
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
  var doc = req._doc;
  console.log(doc);
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
      console.log(err);
      res.status(400);
      res.set({
        "Content-Type": "text/plain"
      });
      res.send("Bad Request: Invalid document.");
    }
    else{
      doc.save(function(err){
        if(err){
          console.log(err);
          var query = {};
          query[req._ID] = doc[req._ID];
          req._model.findOne(query, function(err, doc){
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
                res.status(400);
                res.set({
                  "Content-Type": "text/pain"
                })
                res.send("Bad Request: Document with ID " + doc[req._ID] + " already exists.");
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
          res.send("Created document with ID " + doc[req._ID] + ".");
        }
      });
    }
    return;
  });
}

exports.update = function(req, res){
  var query = {};
  query[req._ID] = req._id;
  req._model.findOne(query, function(err, doc){
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
        try {
          req.__model.updateDoc(doc, req.body);
        } catch (err) {
          console.log(err);
          res.status(500);
          res.set({
            "Content-Type": "text/pain"
          });
          res.send("Internal Sever Error.");
        }

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
                res.send("Updated document with ID " + req._id + ".");
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
        res.send("Bad Request: Document with ID " + req._id + " does not exist.");
      }
    }
  })
}

exports.delete = function(req, res){
  var query = {};
  query[req._ID] = req._id;
  req._model.findOne(query, function(err, doc){
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
            res.send("Removed document with ID " + req._id + ".");
          }
        })
      }
      else{
        res.status(400);
        res.set({
          "Content-Type": "text/pain"
        });
        res.send("Document with ID " + req._id + " does not exist.");
      }
    }
  })
}
