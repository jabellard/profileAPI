var mongoose = require("mongoose");
var profile = require("../models/profile");
var user = require("../models/user");

mongoose.connect("mongodb://localhost:27017/profile");

var profileDb = mongoose.connection;

var collectionNames = [profile.collectionName, user.collectionName];
var idLength = profile.idLength;
var Profile = profile.Profile;
var User = user.User;
var NUM_DOCS = 10;

profileDb.on("error", function(){
  console.log("failed to connect to profile database");
});

profileDb.on("open", function(){
  console.log("successfully connected to the profile database");
  for(var i = 0; i < collectionNames.length; i++){
    if (profileDb.collections[collectionNames[i]]) {
      profileDb.collections[collectionNames[i]].drop(function(err){
        if (err){
          console.log("failed to drop " + collectionNames[i] +  " collection")
        }
        else {
          console.log("dropped " + collectionNames[i] + " collection");
        }

      })
    }
  }
});

function randomNumberK(k){
  var factor = 1;
  for (var i = 0; i < k - 1; i++) {
    factor *= 10;
  }
  return Math.floor(factor + Math.random() * (9 * factor));
}

for (var i = 0; i < NUM_DOCS; i++){
  var _firstName = "firstName" + i;
  var _lastName = "lastNname" + i;
  var _age = 20;
  var _gender = "M";
  var _id = randomNumberK(idLength);

  var profilek = new Profile({
    firstName: _firstName,
    lastName: _lastName,
    age: _age,
    gender: _gender,
    id: _id
  });

  profilek.save(function(err, profile){
    if (err){
      console.log("failed to save profile document");
    }
    else {
      console.log("saved profile document");
    }
  })
}

for(var j = 0; j < NUM_DOCS; j++){
  var _userName = "user" + j;
  var _password = "pass" + j;
  var _admin = false;
  if (j % 2 == 0) {
    _admin = true;
  }
  var userk = new User({
    username: _userName,
    password: _password,
    admin: _admin
  });

  userk.save(function(err, user){
    if (err) {
      console.log("Failed to save user document");
    }
    else{
      console.log("Saved user document");
    }
  });
}
