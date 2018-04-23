var mongoose = require("mongoose");

exports.read = function(req, res){
  req._model.find(req._query, {_id: false, __v: false}, function(err, doc){
    if(err){
      cosole.log(err);
      res.status(500);
      res.json({
        message: "Internal Sever Error."
      });
      res.end();
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
      res.json({
        message: "Internal Sever Error."
      });
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
  if(!doc){
    res.status(400);
    res.json({
      message: "Bad Request: Invalid document."
    });
    res.end();
    return;
  }
  doc.validate(function(err){
    if (err) {
      console.log(err);
      res.status(400);
      res.json({
        message: "Bad Request: Invalid document."
      });
      res.end();
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
              res.json({
                message: "Internal Sever Error."
              });
              res.end();
            }
            else {
              if (doc) {
                res.status(400);
                res.json({
                  message: "Bad Request: Document with ID " + doc[req._ID] + " already exists."
                });
                res.end();
              }
              else {
                res.status(500);
                res.json({
                  message: "Internal Sever Error."
                });
                res.end();
              }
            }
          });
          return;
        }
        else {
          res.status(200);
          res.json({
            message: "Created document with ID " + doc[req._ID] + "."
          });
          res.end();
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
      res.json({
        message: "Internal Sever Error."
      });
      res.end();
    }
    else {
      if (doc) {
        try {
          req.__model.updateDoc(doc, req.body);
        } catch (err) {
          console.log(err);
          res.status(500);
          res.json({
            message: "Internal Sever Error."
          });
          res.end();
        }

        doc.validate(function(err){
          if(err){
            console.log(err);
            res.status(400);
            res.json({
              message: "Bad Request: Invalid document."
            });
            res.end();
          }
          else {
            doc.save(function(err){
              if (err) {
                console.log(err);
                res.status(500);
                res.json({
                  message: "Internal Sever Error."
                });
                res.end();
              }
              else {
                res.status(200);
                res.json({
                  message: "Updated document with ID " + req._id + "."
                });
                res.end();
              }
            });
          }
          return;
        });
      }
      else{
        res.status(400);
        res.json({
          message: "Bad Request: Document with ID " + req._id + " does not exist."
        });
        res.end();
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
      res.json({
        message: "Internal Sever Error."
      });
      res.end();
    }
    else {
      if (doc) {
        doc.remove(function(err){
          if (err) {
            console.log(err);
            res.status(500);
            res.json({
              message: "Internal Sever Error."
            });
            res.end();
          }
          else {
            res.status(200);
            res.json({
              message: "Removed document with ID " + req._id + "."
            });
            res.end();
          }
        })
      }
      else{
        res.status(400);
        res.json({
          message: "Document with ID " + req._id + " does not exist."
        });
        res.end();
      }
    }
  })
}
