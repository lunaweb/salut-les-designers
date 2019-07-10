var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var sass         = require('gulp-sass');
var sassGlob     = require('gulp-sass-glob');
var sourcemaps   = require('gulp-sourcemaps');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync  = require('browser-sync');
var config       = require('../config').stylesheets;

if (!config) return;

// Compile, improve and minify sass files
gulp.task('stylesheets', function() {
  return gulp.src(config.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass(config.sass))
    .on('error', sass.logError)
    .pipe(postcss([
      autoprefixer(config.autoprefixer)
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});
