/**
 * REQUIREMENTS
 */
const { src, dest, watch } = require('gulp');

const include              = require('gulp-include');
const sourcemaps           = require('gulp-sourcemaps');
const uglify               = require('gulp-uglify');

const config               = require('../config').javascripts;
const browsersync          = require('../browsersync').server;

if (!config) return;

/**
 * TASKS
 */

// Concatenate and minify javascripts
const javascripts = () => {
  return src(config.src)
      .pipe(sourcemaps.init())
        .pipe(include(config.include))
        .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(dest(config.dest))
      .pipe(browsersync.stream());
};

// Watch file updates
const watchFiles = () => watch(config.src_watch, javascripts);

/**
 * EXPORTS
 */
exports.default = javascripts;
exports.watch   = watchFiles;
