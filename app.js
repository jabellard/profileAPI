var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var parser = require("./modules/parse");
var profileRoute = require("./routes/profile");
var userRoute = require("./routes/user");
var indexRoute = require("./routes/index");
var profileModel = require("./models/profile");
var userModel = require("./models/user");

var app = express();

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
profileRouter.use("/", function(req, res, next){
  req.__model = profileModel;
  req._model = profileModel.Profile;
  req._schemaFields = profileModel.searchableSchemaFields;
  req._ID = profileModel.ID;
  req._id = req.query.id;
  next();
});
profileRouter.use("/", parser.parseQueryString);
profileRouter.route("/")
  .get(profileRoute.read)
  .post(profileRoute.create)
  .put(profileRoute.update)
  .delete(profileRoute.delete);

var adminRouter = express.Router();
adminRouter.use("/", function(req, res, next){
  req.__model = userModel;
  req._model = userModel.User;
  req._schemaFields = userModel.searchableSchemaFields;
  req._ID = userModel.ID;
  req._id = req.query.username;
  next();
});
adminRouter.use("/", parser.parseQueryString);
adminRouter.route("/")
  .get(userRoute.read)
  .post(userRoute.create)
  .put(userRoute.update)
  .delete(userRoute.delete);

app.use(bodyParser.json());
app.use("/profile", profileRouter);
app.use("/admin", adminRouter);

http.createServer(app).listen(app.get("port"), function(){
  console.log("listening on port " + app.get("port") + " ...");
});
