var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var changed     = require('gulp-changed');
var imagemin    = require('gulp-imagemin');
var browserSync = require('browser-sync');
var config      = require('../config').images;

if (!config) return;

// Optimize images
gulp.task('images', function() {
  return gulp.src(config.src)
    .pipe(plumber())
    .pipe(changed(config.dest))
    .pipe(imagemin())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});
