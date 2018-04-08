var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var bcrypt = require("bcrypt-nodejs");

var collectionName = exports.collectionName = "user";

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  admin: {
    type: Boolean,
    required: true
  }
}, {collection: collectionName});
userSchema.plugin(mongoosePaginate);

exports.defaultPaginationLimit = 10;
exports.defaultPaginationPage = 1;

exports.searchableSchemaFields = ["username", "admin"];
exports.ID = "username";

var User = exports.User = mongoose.model("User", userSchema);

exports.toDoc = function(obj){
  if(!obj){
    return null;
  }
  else {
    return new User({
      username: obj.username,
      password: obj.password,
      admin: obj.admin
    });
  }
}

exports.updateDoc = function(doc, obj){
  if (obj.password) {
    var salt = bcrypt.genSaltSync(5);
    bcrypt.hash(obj.password, salt, null, function(err, hash){
      if (err) {
        throw( new Error("Hashing error."));
      }
      else {
        doc.password = hash;
      }
    });
  }
  if (obj.admin) {
    doc.admin = obj.admin;
  }
}
