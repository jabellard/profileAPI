var gulp = require("gulp");
var mocha = require("gulp-mocha");
var exec = require("child_process").exec;

gulp.task("initDb", [], function(done){
  done();
});

gulp.task("apiDocs", [], function(done){
  exec("raml2html ./apiDocs/api.raml > ./docs/docs.html", function(err, stdout, stderr){
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});
//shell.task("raml2html ./apiDocs/api.raml > ./docs/docs.html");

gulp.task("test", ["initDb", "apiDocs"], function(done){
  gulp.src("./test/*.js", {
    read: false
  })
    .pipe(mocha({
      exit: true
    }));
  done();
});

gulp.task("build", ["test"], function(done){
  done();
});

gulp.task("default", ["build"]);
