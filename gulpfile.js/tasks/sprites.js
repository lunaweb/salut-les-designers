/**
 * REQUIREMENTS
 */
const { src, dest, series, watch } = require('gulp');

const glob                         = require('glob');
const rename                       = require('gulp-rename');
const svgmin                       = require('gulp-svgmin');
const svgstore                     = require('gulp-svgstore');
const merge                        = require('merge-stream');
const path                         = require('path');

const config                       = require('../config').sprites;
const browsersync                  = require('../browsersync').server;

if (!config) return;

/**
 * TASKS
 */

// Concatenate svg files in a single sprite (by sprite folders)
const sprites = (cb) => {
  const stream = merge(
    glob.sync(config.src).map((dirpath) => {
      const srcBase = config.src.split('**')[0];
      const relativePath = dirpath.replace(srcBase, '');
      const dirs = relativePath.split('/');

      // Last entry is empty cause source ending with "/" and so has no value
      dirs.pop();

      const spriteName = 'sprite' + dirs[dirs.length - 1].replace('sprite', '');

      // Don't need sprite folder anymore
      dirs.pop();

      const wildcardPath = dirs.join('/');

      return src(dirpath + '/*.svg')
        .pipe(svgmin(function(file) {
          const prefix = path.basename(file.relative, path.extname(file.relative));
          return {
            plugins: [{
              cleanupIDs: {
                prefix: prefix + '-',
                minify: true
              }
            }]
          };
        }))
        .pipe(rename({ prefix: spriteName + '-' }))
        .pipe(svgstore({ inline: true }))
        .pipe(dest(config.dest + '/' + wildcardPath))
        .pipe(browsersync.stream());
    })
  );

  return stream.isEmpty() ? cb() : stream;
};

/**
 * Browsersync have some difficulties to reload / inject changes on SVG files,
 * so we have a specific task to force the reload.
 */
const watchFiles = () => watch(config.src_watch, series(sprites, browsersync.reload));

/**
 * EXPORTS
 */
exports.default = sprites;
exports.watch   = watchFiles;
