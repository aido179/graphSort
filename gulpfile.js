var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var mocha  = require('gulp-mocha');

gulp.task('lint', function() {
  return gulp
    .src(['gulpfile.js', 'js/*.js', 'test/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
  return gulp
    .src('test/*.js')
    .pipe(mocha());
});


gulp.task('default', ['lint', 'test'], function() {
  gulp.watch(['js/*.js', 'test/*.js'], function() {
    gulp.run('lint', 'test');
  });
});
