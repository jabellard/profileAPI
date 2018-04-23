var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jsonwebtoken");
var secretKey = require("../config/keys").secretKey;

exports.authenticate = function(req, res){
  req._model.findOne({username: req.body.username}, function(err, doc){
    if(err){
      cosole.log(err);
      res.status(500);
      res.json({
        message: "Internal Sever Error."
      });
      res.end();
    }
    else {
      if (doc) {
        bcrypt.compare(req.body.password, doc.password, function(err, match){
          if (err) {
            cosole.log(err);
            res.status(500);
            res.json({
              message: "Internal Sever Error."
            });
            res.end();
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
                  res.json({
                    message: "Internal Sever Error."
                  });
                  res.end();
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
              res.json({
                message: "Invalid password."
              });
              res.end();
            }
          }
        });
      }
      else {
        res.status(401);
        res.json({
          message: "No user with username " + req.body.username + " exists."
        });
        res.end();
      }
      }
    });
  }

exports.authorize = function(req, res, next){
  var authHeader = req.get("authorization");
  if (!authHeader) {
    res.status(401);
    res.json({
      message: "Unauthorized."
    });
    res.end();
  }
  else {
    var token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, function(err, payload){
      if (err) {
        res.status(401);
        res.json({
          message: "Unauthorized."
        });
        res.end();
      }
      else {
        if (!payload.admin && req._admin) {
          if (req.baseUrl == "/users" && (req.method == "PUT" || req.method == "DELETE")) {
            if (payload.username == req.query.username) {
              req.body.admin = payload.admin;
              next()
            }
            else {
              res.status(401);
              res.json({
                message: "Unauthorized."
              });
              res.end();
            }
          }
          else {
            res.status(401);
            res.json({
              message: "Unauthorized."
            });
            res.end();
          }
        }
        else {
          next();
        }
      }
    });
  }
}
