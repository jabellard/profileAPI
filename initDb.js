var mongoose = require("mongoose");
var profile = require("./models/profile");

mongoose.connect("mongodb://localhost:27017/profile");

var profileDb = mongoose.connection;

var collectionName = profile.collectionName;
var idLength = profile.idLength;
var Profile = profile.Profile;

profileDb.on("error", function(){
  console.log("failed to connect to profile database");
});

profileDb.on("open", function(){
  console.log("successfully connected to the profile database");
  if (profileDb.collections[collectionName]) {
    profileDb.collections[collectionName].drop(function(err){
      if (err){
        console.log("failed to drop " + collectionName +  " collection")
      }
      else {
        console.log("dropped " + collectionName + " collection");
      }

    })
  }
});



function randomNumberK(k){
  var factor = 1;
  for (var i = 0; i < k - 1; i++) {
    factor *= 10;
  }
  return Math.floor(factor + Math.random() * (9 * factor));
}

var s1 = mongoose.Schema({
  name: String
}, {collection: collectionName})

var m1 = mongoose.model("m1", s1);

var i = 0;
for (i = 0; i < 200; i++){
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

  var mk = new m1({
    name: "name" + randomNumberK(0)
  });

  profilek.save(function(err, profile){
    if (err){
      console.log("failed to save document");
    }
    else {
      console.log("saved profile document");
    }
  })
}
