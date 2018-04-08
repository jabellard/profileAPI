var createUser = require("./user.js").create;

exports.signup = function(req, res){
  createUser(req, res);
}
