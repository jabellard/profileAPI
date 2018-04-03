var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var profileRoute = require("./routes/profile");
var indexRoute = require("./routes/index");
var profileModel = require("./models/profile");

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
  console.log("mid 1");
  req._model = profileModel.Profile;
  next();
});
profileRouter.use("/", profileRoute.parseQueryString);
profileRouter.route("/")
  .get(profileRoute.read)
  .post(profileRoute.create)
  .put(profileRoute.update)
  .delete(profileRoute.delete);

app.use(bodyParser.json());
app.use(function(req, res, next){
  console.log("incoming request");
  next();
});
app.use("/profile", profileRouter);

http.createServer(app).listen(app.get("port"), function(){
  console.log("listening on port " + app.get("port") + " ...");
});
