var expect = require("chai").expect;
var supertest = require("supertest");
var jwt = require("jsonwebtoken");
var app = require("../app").app;
var keys = require("../config/keys");

var secretKey = keys.secretKey;

var adminPayload = {
  username: "admin",
  admin: true
};

var adminToken = jwt.sign(adminPayload, secretKey);

var regularPayload = {
  username: "regular",
  admin: false
};

var regularToken = jwt.sign(regularPayload, secretKey);

var invalidToken = regularToken + "dkfdkf";

var requester = supertest(app);

describe("REstful API", function(){
  describe("/profiles route", function(){
    describe("GET", function(){
      it("sucess -- valid auth", function(done){
        requester
          .get("/profiles")
          .set("Authorization", "Bearer " + regularToken)
          .end(function(err, res){
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/profiles")
          .end(function(err, res){
          });
      });
      it("failure -- invalid auth", function(done){
        requester
          .get("/profiles")
          .set("Authorization", "Bearer " + invalidToken)
          .end(function(err, res){
          });
      });
    });
    describe("POST", function(){
      it("sucess -- valid auth and body", function(done){
        requester
          .get("/profiles")
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/profiles")
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- invalid auth", function(done){
        requester
          .get("/profiles")
          .set("Authorization", "Bearer " + invalidToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- regular oath", function(done){
        requester
          .get("/profiles")
          .set("Authorization", "Bearer " + regularToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- no body", function(done){
        requester
          .get("/profiles")
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
          });
      });
      it("failure -- invalid body", function(done){
        requester
          .get("/profiles")
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
    });
    describe("PUT", function(){
      it("sucess -- valid auth, and query", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- no query", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- invalid query", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/users")
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- invalid auth", function(done){
        requester
          .get("/users")
          .query{}
          .set("Authorization", "Bearer " + invalidToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- insuficient rights", function(done){
        requester
          .get("/users")
          .query{}
          .set("Authorization", "Bearer " + regularToken)
          .send({})
          .end(function(err, res){
          });
      });
    });
    describe("DELETE", function(){
      it("sucess -- valid auth, and query", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- no query", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- invalid query", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/users")
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- invalid auth", function(done){
        requester
          .get("/users")
          .query{}
          .set("Authorization", "Bearer " + invalidToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- insuficient rights", function(done){
        requester
          .get("/users")
          .query{}
          .set("Authorization", "Bearer " + regularToken)
          .send({})
          .end(function(err, res){
          });
      });
    });
    describe("DELETE", function(){
      it("sucess -- valid auth, and query", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
          });
      });
      it("failure -- no query", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
          });
      });
      it("failure -- invalid query", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/users")
          .query({})
          .end(function(err, res){
          });
      });
      it("failure -- invalid auth", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + invalidToken)
          .end(function(err, res){
          });
      });
      it("failure -- insuficient rights", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + regularToken)
          .end(function(err, res){
          });
      });
    });
  });

  describe("/users route", function(){
    describe("GET", function(){
      it("sucess -- valid auth", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/users")
          .end(function(err, res){
          });
      });
      it("failure -- invalid auth", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + invalidToken)
          .end(function(err, res){
          });
      });
      it("failure -- non-admin token", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + regularToken)
          .end(function(err, res){
          });
      });
    });
    describe("POST", function(){
      it("sucess -- valid auth, and body", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/users")
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- invalid auth", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + invalidToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- non-admin auth", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + regularToken)
          .send({})
          .end(function(err, res){
          });
      });
    });
    describe("PUT", function(){
      it("sucess -- valid auth, and query", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- no query", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- invalid query", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/users")
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- invalid auth", function(done){
        requester
          .get("/users")
          .query{}
          .set("Authorization", "Bearer " + invalidToken)
          .send({})
          .end(function(err, res){
          });
      });
      it("failure -- insuficient rights", function(done){
        requester
          .get("/users")
          .query{}
          .set("Authorization", "Bearer " + regularToken)
          .send({})
          .end(function(err, res){
          });
      });
    });
    describe("DELETE", function(){
      it("sucess -- valid auth, and query", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
          });
      });
      it("failure -- no query", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
          });
      });
      it("failure -- invalid query", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/users")
          .query({})
          .end(function(err, res){
          });
      });
      it("failure -- invalid auth", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + invalidToken)
          .end(function(err, res){
          });
      });
      it("failure -- insuficient rights", function(done){
        requester
          .get("/users")
          .query({})
          .set("Authorization", "Bearer " + regularToken)
          .end(function(err, res){
          });
      });
    });
  });

  describe("/signup route", function(){
    describe("POST", function(){
      it("sucess -- valid body", function(done){
        requester
          .post("/login/")
          .send({username: "validuser", password: "pass"})
          .end(function(err, res){
          });
      });
      it("failure -- invalid body", function(done){
        requester
          .post("/login/")
          .send({})
          .end(function(err, res){
          });
      });
    });
  });

  describe("/login route", function(){
    describe("POST", function(){
      it("sucess -- valid body", function(done){
        requester
          .post("/login/")
          .send({username: "validuser", password: "pass"})
          .end(function(err, res){
          });
      });
      it("failure -- invalid body", function(done){
        requester
          .post("/login/")
          .send({})
          .end(function(err, res){
          });
      });
    });
  });
});
