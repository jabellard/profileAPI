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

var invalidToken = "fjfj" + regularToken + "dkfdkf";

var validIdQuery = 22821;

var requester = supertest(app);

describe("REstful API", function(){
  describe("/profiles route", function(){
    describe("GET", function(){
      it("success -- valid auth", function(done){
        requester
          .get("/profiles")
          .set("Authorization", "Bearer " + regularToken)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- missing auth", function(done){
        requester
          .get("/profiles")
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
          .get("/profiles")
          .set("Authorization", "Bearer " + invalidToken)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
    });
    describe("POST", function(){
      it("success -- valid auth, and body", function(done){
        requester
          .post("/profiles")
          .set("Authorization", "Bearer " + adminToken)
          .send({
            firstName: "testuser1_first",
            lastName: "testuser1_last",
            age: 45,
            gender: "M",
            id: 34343
          })
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- missing auth", function(done){
        requester
        .post("/profiles")
        .send({
          firstName: "testuser2_first",
          lastName: "testuser2_last",
          age: 45,
          gender: "M",
          id: 34343
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .post("/profiles")
        .set("Authorization", "Bearer " + invalidToken)
        .send({
          firstName: "testuser11_first",
          lastName: "testuser11_last",
          age: 45,
          gender: "M",
          id: 34343
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin token)", function(done){
        requester
        .post("/profiles")
        .set("Authorization", "Bearer " + regularToken)
        .send({
          firstName: "testuser111_first",
          lastName: "testuser111_last",
          age: 45,
          gender: "M",
          id: 34343
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- missing body", function(done){
        requester
        .post("/profiles")
        .set("Authorization", "Bearer " + adminToken)
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- invalid body", function(done){
        requester
        .post("/profiles")
        .set("Authorization", "Bearer " + adminToken)
        .send({
          firstName: "testuser11_first",
          age: 45,
          gender: "M",
          id: 34343
        })
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe("PUT", function(){
      it("success -- valid query, and auth", function(done){
        requester
          .put("/profiles")
          .query({
            id: validIdQuery
          })
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- missing query", function(done){
        requester
        .put("/profiles")
        .set("Authorization", "Bearer " + adminToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- invalid query", function(done){
        requester
        .put("/profiles")
        .query({
          id: 23232
        })
        .set("Authorization", "Bearer " + adminToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- missing auth", function(done){
        requester
        .put("/profiles")
        .query({
          id: 23233
        })
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .put("/profiles")
        .query({
          id: 23232
        })
        .set("Authorization", "Bearer " + invalidToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin token)", function(done){
        requester
        .put("/profiles")
        .query({
          id: 23233
        })
        .set("Authorization", "Bearer " + regularToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe("DELETE", function(){
      it("success -- valid query and auth", function(done){
        requester
          .delete("/profiles")
          .query({
            id: validIdQuery
          })
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- missing query", function(done){
        requester
        .delete("/profiles")
        .set("Authorization", "Bearer " + adminToken)
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- invalid query", function(done){
        requester
        .delete("/profiles")
        .query({
          id: 23233
        })
        .set("Authorization", "Bearer " + adminToken)
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- missing auth", function(done){
        requester
        .delete("/profiles")
        .query({
          id: 23233
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .delete("/profiles")
        .query({
          id: 23233
        })
        .set("Authorization", "Bearer " + invalidToken)
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin token)", function(done){
        requester
        .delete("/profiles")
        .query({
          id: 23233
        })
        .set("Authorization", "Bearer " + regularToken)
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe("/users route", function(){
    describe("GET", function(){
      it("success -- valid auth", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- no auth", function(done){
        requester
          .get("/users")
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + invalidToken)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
      it("failure -- invalid auth (non-admin token)", function(done){
        requester
          .get("/users")
          .set("Authorization", "Bearer " + regularToken)
          .end(function(err, res){
            expect(res.status).to.equal(401);
            done();
          });
      });
    });
    describe("POST", function(){
      it("success -- valid auth, and body", function(done){
        requester
          .post("/users")
          .set("Authorization", "Bearer " + adminToken)
          .send({
            username: "testuser1",
            password: "passsss",
            admin: false
          })
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- missing auth", function(done){
        requester
        .post("/users")
        .send({
          username: "testuser2",
          password: "passsss",
          admin: false
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .post("/users")
        .set("Authorization", "Bearer " + invalidToken)
        .send({
          username: "testuser3",
          password: "passsss",
          admin: false
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin token)", function(done){
        requester
        .post("/users")
        .set("Authorization", "Bearer " + regularToken)
        .send({
          username: "testuser4",
          password: "passsss",
          admin: false
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe("PUT", function(){
      it("success -- valid auth, and query", function(done){
        requester
          .put("/users")
          .query({
            username: "sampleuser3"
          })
          .set("Authorization", "Bearer " + adminToken)
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- missing query", function(done){
        requester
        .put("/users")
        .set("Authorization", "Bearer " + adminToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- invalid query", function(done){
        requester
        .put("/users")
        .query({
          username: "dggdddf"
        })
        .set("Authorization", "Bearer " + adminToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- missing auth", function(done){
        requester
        .put("/users")
        .query({
          username: "sampleuser3"
        })
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .put("/users")
        .query({
          username: "sampleuser3"
        })
        .set("Authorization", "Bearer " + invalidToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin token)", function(done){
        requester
        .put("/users")
        .query({
          username: "sampleuser3"
        })
        .set("Authorization", "Bearer " + regularToken)
        .send({})
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe("DELETE", function(){
      it("success -- valid auth, and query", function(done){
        requester
          .delete("/users")
          .query({
            username: "sampleuser3"
          })
          .set("Authorization", "Bearer " + adminToken)
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- missing query", function(done){
        requester
        .delete("/users")
        .set("Authorization", "Bearer " + adminToken)
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- invalid query", function(done){
        requester
        .delete("/users")
        .query({
          username: "dggdddf"
        })
        .set("Authorization", "Bearer " + adminToken)
        .end(function(err, res){
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("failure -- missing auth", function(done){
        requester
        .delete("/users")
        .query({
          username: "sampleuser3"
        })
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (bad token)", function(done){
        requester
        .delete("/users")
        .query({
          username: "sampleuser3"
        })
        .set("Authorization", "Bearer " + invalidToken)
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
      it("failure -- invalid auth (non-admin token)", function(done){
        requester
        .delete("/users")
        .query({
          username: "sampleuser3"
        })
        .set("Authorization", "Bearer " + regularToken)
        .end(function(err, res){
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe("/signup route", function(){
    describe("POST", function(){
      it("success -- valid body", function(done){
        requester
          .post("/signup")
          .send({
            username: "signuuptest",
            password: "passssssss"
          })
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- invalid body", function(done){
        requester
          .post("/signup")
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
  });

  describe("/login route", function(){
    describe("POST", function(){
      it("success -- valid body", function(done){
        requester
          .post("/login")
          .send({
            username: "sampleuser1",
            password: "samplepass1"
          })
          .end(function(err, res){
            expect(res.status).to.equal(200);
            done();
          });
      });
      it("failure -- invalid body", function(done){
        requester
          .post("/login")
          .send({})
          .end(function(err, res){
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
  });
});
