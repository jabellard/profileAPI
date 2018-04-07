var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

var collectionName = exports.collectionName = "profile";
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
  },
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
profileSchema.plugin(mongoosePaginate);

exports.defaultPaginationLimit = 10;
exports.defaultPaginationPage = 1;

exports.searchableSchemaFields = ["firstName", "lastName", "age", "gender", "id"];
exports.ID = "id";

var Profile = exports.Profile = mongoose.model("Profile", profileSchema);

exports.toDoc = function(obj){
  if (!obj) {
    return null;
  }
  else {
    return new Profile({
      firstName: obj.firstName,
      lastName: obj.lastName,
      age: obj.age,
      gender: obj.gender,
      id: obj.id
    });
  }
}

exports.updateDoc = function(doc, obj){
  doc.firstName = obj.firstName;
  doc.lastName = obj.lastName;
  doc.age = obj.age;
  doc.gender = obj.gender;
}
