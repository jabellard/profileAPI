var mongoose = require("mongoose");

var collectionName = exports.collection_Name = "profile";
var idLength = exports.idLength = 5;

var profileSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    uppercase: true
  },
  lastName: {
    type: String,
    required: true,
    uppercase: true
  },
  age: {
    type: Number,
    required: true,
    min: 1
  }
  gender: {
    type: String,
    required: true,
    uppercase: true,
    enum: ["M", "m", "F", "f"]
  },
  id: {
    type: Number,
    required: true,
    unique: true,
    validate: function(v){
      var len = v.toString().length;
      if (len == idLength) {
        return true;
      }
      return false;
    }
  }
}, {collection: collectionName});

var Profile = exports.Profile = mongoose.model("Profile", profileSchema);

exports.toProfile = function(obj){
  if (!obj) {
    return null;
  }
  else {
    return ne99 Profile({
      firstName = obj.firstName;
      lastName = obj.lastName;
      age = obj.age;
      gender = obj.gender;
      id = obj.id;
    });
  }
}
