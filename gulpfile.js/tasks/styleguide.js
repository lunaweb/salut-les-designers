/**
 * REQUIREMENTS
 */
const { src, dest, watch, series, parallel } = require('gulp');

const hologram                               = require('gulp-hologram');
const include                                = require('gulp-include');
const replace                                = require('gulp-replace');

const config                                 = require('../config').styleguide;
const browsersync                            = require('../browsersync').server;

if(!config) return;

/**
 * TASKS
 */

// Compile styleguide : simply exectue Hologram
const compile = () => {
  return src(config.src)
    .pipe(hologram())
    .pipe(browsersync.stream());
};

/**
 * Since the styleguide base folder is outside of Middleman sources we can't use
 * traditionals `stylesheets` and `javascripts` tasks.
 * So we use sprockets like inclusions.
 */
const assets = () => {
  return src(config.src_assets)
    .pipe(include(config.include))
    .pipe(dest(config.dest_assets))
    .pipe(browsersync.stream());
};

/**
 * Inject browsersync livereload script as the styleguide does not live in Middleman execution,
 * so we can't add it manually in the template because we don't when we are in developement mode or not.
 */
const injectBrowserSync = () => {
  return src(config.src_browsersync)
    .pipe(replace(/<\/body>(?![\s\S]*<\/body>)/, '<script async src=\"http://localhost:3001/browser-sync/browser-sync-client.js?v=2.26.5\"></script></body>'))
    .pipe(dest(config.dest_browsersync));

};

// Watch file updates
const watchFiles = () => watch(config.src_watch, dev);

// Build styleguide and this assets
const build = series(compile, assets);

// Dev specific task for handling browsersync
const dev = series(
  compile,
  parallel(injectBrowserSync, assets)
);

/**
 * EXPORTS
 */
exports.default = build;
exports.dev     = dev;
exports.watch   = watchFiles;
