var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task("build", function () {
  return gulp.src("src/app.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
      sourceRoot: './src'
    }))
    .pipe(concat("codegen.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});
