var gulp        = require('gulp');
var browserSync = require('browser-sync');
var watch       = require('gulp-watch');
var config      = require('../config');

if (!config) return;

// Watch modifications to live reloading browsers with browsersync
gulp.task('watch', function() {
  browserSync.init(config.browsersync);

  watch(config.images.src, function(){ gulp.start('images') });
  watch(config.stylesheets.src, function(){ gulp.start('stylesheets') });
  watch(config.javascripts.src_watch, function(){ gulp.start('javascripts') });
  watch(config.fonts.src, function(){ gulp.start('fonts') });
  watch('./**/*.slim').on('change', browserSync.reload);
});
