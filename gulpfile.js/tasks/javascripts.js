var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var sourcemaps  = require('gulp-sourcemaps');
var include     = require('gulp-include');
var uglify      = require('gulp-uglify');
var util        = require('gulp-util');
var browserSync = require('browser-sync');
var config      = require('../config').javascripts;

if (!config) return;

// Concatenate and minify javascripts
gulp.task('javascripts', function() {
  return gulp.src(config.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(include(config.include).on('error', util.log))
    .pipe(uglify().on('error', util.log))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});
