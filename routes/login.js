var authenticate = require("../modules/auth").authenticate;

exports.login = function(req, res){
  if(!req.body.username || !req.body.password){
    res.status(400);
    res.set({
      "Content-Type": "text/pain"
    });
    res.send("Unauthorized.");
  }
  else {
    authenticate(req, res);
  }
}
