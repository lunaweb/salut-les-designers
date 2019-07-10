/**
 * REQUIREMENTS
 */
const { src, dest, watch } = require('gulp');

const changed              = require('gulp-changed');
const imagemin             = require('gulp-imagemin');

const config               = require('../config').images;
const browsersync          = require('../browsersync').server;

if (!config) return;

/**
 * TASKS
 */

// Optimize images
const images = () => {
  return src(config.src)
    .pipe(changed(config.dest))
    .pipe(imagemin())
    .pipe(dest(config.dest))
    .pipe(browsersync.stream());
};

// Watch file updates
const watchFiles = () => watch(config.src, images);

/**
 * EXPORTS
 */
exports.default = images;
exports.watch   = watchFiles;
