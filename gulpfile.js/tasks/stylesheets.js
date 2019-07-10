/**
 * REQUIREMENTS
 */
const { src, dest, watch } = require('gulp');

const autoprefixer         = require('autoprefixer');
const postcss              = require('gulp-postcss');
const sass                 = require('gulp-sass');
const sourcemaps           = require('gulp-sourcemaps');

const config               = require('../config').stylesheets;
const browsersync          = require('../browsersync').server;

if (!config) return;

/**
 * TASKS
 */

// Compile, improve and minify sass files
const stylesheets = () => {
  return src(config.src)
    .pipe(sourcemaps.init())
      .pipe(sass(config.sass))
      .pipe(postcss([
        autoprefixer(config.autoprefixer)
      ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(config.dest))
    .pipe(browsersync.stream());
};

// Watch file updates
const watchFiles = () => watch(config.src, stylesheets);

/**
 * EXPORTS
 */
exports.default = stylesheets;
exports.watch   = watchFiles;
