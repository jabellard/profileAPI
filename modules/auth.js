var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jsonwebtoken");

var secretKey = "secret";

exports.authenticate = function(req, res){
  req._model.findOne({username: req.body.username}, function(err, doc){
    if(err){
      cosole.log(err);
      res.status(500);
      res.set({
        "Content-Type": "text/pain"
      });
      res.send("Internal Sever Error.");
    }
    else {
      if (doc) {
        bcrypt.compare(req.body.password, doc.password, function(err, match){
          if (err) {
            cosole.log(err);
            res.status(500);
            res.set({
              "Content-Type": "text/pain"
            });
            res.send("Internal Sever Error.");
          }
          else {
            if (match) {
              var payload = {
                username: doc.username,
                admin: doc.admin
              };
              var options = {
                expiresIn: "1d"
              }

              jwt.sign(payload, secretKey, options, function(err, token){
                if (err) {
                  cosole.log(err);
                  res.status(500);
                  res.set({
                    "Content-Type": "text/pain"
                  });
                  res.send("Internal Sever Error.");
                }
                else {
                  res.status(200);
                  res.json({
                    message: "Successfully authenticated.",
                    token: token
                  });
                }
              });
            }
            else {
              res.status(401);
              res.set({
                "Content-Type": "text/pain"
              });
              res.send("Invalid password.");
            }
          }
        });
      }
      else {
        res.status(401);
        res.set({
          "Content-Type": "text/pain"
        });
        res.send("No user with username " + req.body.username + " exists.");
      }
      }
    });
  }

exports.authorize = function(req, res, next){
  var authHeader = req.get("authorization");
  console.log("Auth Header: --------------");
  console.log(authHeader);
  console.log("Auth Header: --------------");

  if (!authHeader) {
    res.status(401);
    res.set({
      "Content-Type": "text/pain"
    });
    res.send("Unauthorized.");
  }
  else {
    var token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, function(err, payload){
      if (err) {
        res.status(401);
        res.set({
          "Content-Type": "text/pain"
        });
        res.send("Unauthorized.");
      }
      else {
        if (!payload.admin && req._admin) {
          if (req.baseUrl == "/admin" && (req.method == "PUT" || req.method == "DELETE")) {
            if (payload.username == req.query.username) {
              req.body.admin = payload.admin;
              next()
            }
            else {
              res.status(401);
              res.set({
                "Content-Type": "text/pain"
              });
              res.send("Unauthorized.");
            }
          }
          else {
            res.status(401);
            res.set({
              "Content-Type": "text/pain"
            });
            res.send("Unauthorized.");
          }
        }
        else {
          next();
        }
      }
    });
  }
}
