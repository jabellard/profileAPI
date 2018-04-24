var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var parser = require("./modules/parse");
var profileRoute = require("./routes/profile");
var userRoute = require("./routes/user");
var signupRoute = require("./routes/signup");
var loginRoute = require("./routes/login");
var indexRoute = require("./routes/index");
var docsRoute = require("./routes/docs");
var profileModel = require("./models/profile");
var userModel = require("./models/user");
var auth = require("./modules/auth");

var app = exports.app = express();

app.set("port", process.env.PORT || 3000);

mongoose.connect("mongodb://localhost:27017/profile");
var profileDb = mongoose.connection;
profileDb.on("error", function(){
  console.log("Failed to connect to the profile database.");
});
profileDb.on("open", function(){
  console.log("Connected to the profile database.");

  if(!profileDb.collections[profileModel.collectionName]){
    console.log(profileModel.collectionName + " collection does not exist.");
  }
});

var profileRouter = express.Router();
profileRouter.use(function(req, res, next){
  req.__model = profileModel;
  req._model = profileModel.Profile;
  req._schemaFields = profileModel.searchableSchemaFields;
  req._ID = profileModel.ID;
  req._admin = true;
  if(!req._query){
    req._query = {};
  }
  next();
});
profileRouter.use(parser.parseQueryString);
profileRouter.param("id", function(req, res, next, id){
  req._id = id;
  if(!req._query){
    req._query = {};
  }
  req._query["id"] = id;
  next();
});
profileRouter.route("/")
  .get(function(req, res, next){
  req._admin = false;
  next();
})
  .get(auth.authorize, profileRoute.read)
  .post(auth.authorize, profileRoute.create);

profileRouter.route("/:id")
  .get(function(req, res, next){
    req._admin = false;
    next();
  })
  .get(auth.authorize, profileRoute.read)
  .put(auth.authorize, profileRoute.update)
  .delete(auth.authorize, profileRoute.delete);

var userRouter = express.Router();
userRouter.use(function(req, res, next){
  req.__model = userModel;
  req._model = userModel.User;
  req._schemaFields = userModel.searchableSchemaFields;
  req._ID = userModel.ID;
  req._admin = true;
  if(!req._query){
    req._query = {};
  }
  next();
});
userRouter.use(parser.parseQueryString);
userRouter.param("username", function(req, res, next, username){
  req._id = username;
  if(!req._query){
    req._query = {};
  }
  req._query["username"] = username;
  next();
})
userRouter.route("/")
  .get(auth.authorize, userRoute.read)
  .post(auth.authorize, userRoute.create)

userRouter.route("/:username")
  .get(auth.authorize, userRoute.read)
  .put(auth.authorize, userRoute.update)
  .delete(auth.authorize, userRoute.delete);

var signupRouter = express.Router();
signupRouter.use("/", function(req, res, next){
  req.__model = userModel;
  req._model = userModel.User;
  req._ID = userModel.ID;
  req.body.admin = false;
  next();
});
signupRouter.route("/")
  .post(signupRoute.signup);

var loginRouter = express.Router();
loginRouter.use("/", function(req, res, next){
  req.__model = userModel;
  req._model = userModel.User;
  req.body.admin = false;
  next();
});
loginRouter.route("/")
  .post(loginRoute.login);

var docsRouter = express.Router();
docsRouter.route("/")
  .get(docsRoute.serveHtml);

app.use(bodyParser.json());
app.use("/profiles", profileRouter);
app.use("/users", userRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/docs", docsRouter);

http.createServer(app).listen(app.get("port"), function(){
  console.log("listening on port " + app.get("port") + " ...");
});
