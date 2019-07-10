/**
 * REQUIREMENTS
 */
const { series, parallel } = require('gulp');

const config               = require('../config');

// Required tasks
const clean                = require('./clean').default
const fonts                = require('./fonts').default
const images               = require('./images').default
const javascripts          = require('./javascripts').default
const sprites              = require('./sprites').default
const stylesheets          = require('./stylesheets').default
const watch                = require('./watch').default

// Main tasks that will be run in parallel
const concurrentTasks = [images, stylesheets, javascripts, fonts, sprites];
let buildConcurrentTasks = Array.from(concurrentTasks);
let devConcurrentTasks = Array.from(concurrentTasks);

// If config is setup for a styleguide require it and add tasks
if (config.styleguide) {
  const styleguide = require('./styleguide');
  buildConcurrentTasks.push(styleguide.default);
  devConcurrentTasks.push(styleguide.dev);
}

/**
 * TASKS
 */

// Build application
const build = series(clean, parallel(buildConcurrentTasks));

// Build application and watch changes
const dev = series(clean, parallel(devConcurrentTasks), watch);

/**
 * EXPORTS
 */
exports.default = build;
exports.dev     = dev;
