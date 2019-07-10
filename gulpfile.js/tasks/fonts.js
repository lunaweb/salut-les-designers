/**
 * REQUIREMENTS
 */
const { src, dest, watch } = require('gulp');

const config               = require('../config').fonts;
const browsersync          = require('../browsersync').server;

if (!config) return;

/**
 * TASKS
 */

// Simply copy fonts
const fonts = () => {
  return src(config.src)
    .pipe(dest(config.dest))
    .pipe(browsersync.stream());
};

// Watch fonts updates
const watchFiles = () => watch(config.src, fonts);

/**
 * EXPORTS
 */
exports.default = fonts;
exports.watch   = watchFiles;
