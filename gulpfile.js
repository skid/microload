var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('minify', function(){
  gulp
    .src('./microload.js')
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(rename('microload.min.js'))
    .pipe(gulp.dest('.'));
});