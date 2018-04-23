var authenticate = require("../modules/auth").authenticate;

exports.login = function(req, res){
  if(!req.body.username || !req.body.password){
    res.status(400);
    res.json({
      message: "Unauthorized."
    });
    res.end();
  }
  else {
    authenticate(req, res);
  }
}
