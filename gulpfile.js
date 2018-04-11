var gulp = require("gulp");
var mocha = require("gulp-mocha");

gulp.task("initDb", [], function(done){
  done();
});

gulp.task("test", ["initDb"], function(done){
  gulp.src("./test/*.js", {
    read: false
  })
    .pipe(mocha({
      exit: true
    }));
  done();
});

gulp.task("default", ["test"]);
