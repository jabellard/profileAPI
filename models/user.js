var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

var collectionName = exports.collectionName = "user";

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
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

var User = exports.User = mongoose.model("User", userSchema);

exports.toUser = function(obj){
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
