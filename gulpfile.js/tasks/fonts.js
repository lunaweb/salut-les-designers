var gulp        = require('gulp');
var browserSync = require('browser-sync');
var config      = require('../config').fonts;

if (!config) return;

// Simply copy fonts
gulp.task('fonts', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});
