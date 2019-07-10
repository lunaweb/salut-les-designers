/**
 * REQUIREMENTS
 */
const { watch, series, parallel } = require('gulp');

const config                      = require('../config');
const browsersync                 = require('../browsersync');

if(!config) return;

const fonts       = require('./fonts').watch;
const images      = require('./images').watch;
const javascripts = require('./javascripts').watch;
const sprites     = require('./sprites').watch;
const styleguide  = require('./styleguide').watch;
const stylesheets = require('./stylesheets').watch;

/**
 * TASKS
 */

// Execute watch tasks defined
const watchFiles = () => {
  fonts();
  images();
  javascripts();
  sprites();
  stylesheets();

  if(styleguide){
    styleguide();
  }

  watch('./**/*.slim', browsersync.reload);
}

/**
 * EXPORTS
 */
exports.default = parallel(browsersync.serve, watchFiles);
