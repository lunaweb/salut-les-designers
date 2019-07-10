/**
 * REQUIREMENTS
 */
const { src, dest, series, parallel } = require('gulp');

const fs                              = require('fs');
const merge                           = require('merge-stream');
const moment                          = require('moment');
const replace                         = require('gulp-replace');
const zip                             = require('gulp-zip');

const config                          = require('../config').deliver;

if (!config) return;

const build = require('./build.js').default;

/**
 * TASKS
 */

/**
 * Copy assets sources
 *
 * This is a tricky task cause we need to detect all node_modules included in assets sources
 * and change there references to `vendor/{node_modules}` so all the resources are welled
 * delivered to the client.
 */

  /**
   * Node modules which are used as assets vendors
   * { directory: [node_module, ...], ... }
   */
  let node_modules_vendors = {};
  // Populate node_modules_vendors
  const addNodeModuleRef = (directory, node_module) => {
    if (typeof node_modules_vendors[directory] === 'undefined') {
      node_modules_vendors[directory] = [node_module];
    } else if (node_modules_vendors[directory].indexOf(node_module) === -1) {
      node_modules_vendors[directory].push(node_module);
    }
  };

  /**
   * Prevent characters from a string to conflict with regex rules
   * Taken from lodash's escapeRegExp() : https://github.com/lodash/lodash/blob/4.17.11/lodash.js
   */
  const escapeRegExString = (string) => string.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');

  // Get dependencies listed in package.json
  let dependencies = Object.keys(JSON.parse(fs.readFileSync('./package.json'))['dependencies']) || [];
  // Escape them
  let escapeDependencies = dependencies.map(string => escapeRegExString(string));
  // Create reg ex that will match node_modules references in assets sources
  const vendorRegExp = new RegExp('(' + escapeDependencies.join('|') + ')\/', 'gm');

  // Copy assets sources as they are, but replace node_modules references by `vendors/{node_module}`
  const copyOriginalSources = () => {
    return src(config.copy.src_sources)
      .pipe(replace(vendorRegExp, function(match, p1) {
        const splitPath = this.file.relative.split("/");

        addNodeModuleRef(splitPath[0], p1);

        return 'vendors/' + match;
      }, { skipBinary: true }))
      .pipe(dest(config.copy.dest_sources));
  };

  // Copy all node_modules referenced in `node_modules_vendors`
  const copyNodeModules = () => {
    return merge(
      Object.keys(node_modules_vendors).map(key => {
        return src('./node_modules/{' + node_modules_vendors[key].join(',') + '}/**/*')
          .pipe(dest(config.copy.dest_sources + '/' + key + '/vendors'));
      })
    );
  };

  // Copy build folder
  const copyBuild = () => {
    return src(config.copy.src_build)
      .pipe(dest(config.copy.dest_build));
  };

  // Copy assets sources
  const copySources = series(copyOriginalSources, copyNodeModules);

// Copy styleguide from build directory if configured
let copyStyleguide;
if(config.copy.src_styleguide){
  copyStyleguide = () => {
    return src(config.copy.src_styleguide)
      // Replace assets path because in the deliverable we have not the same structure as the build folder
      .pipe(replace(/"\.\.\/([\/a-zA-Z0-9-_\.#]+)"/g, function(match, p1) {
        return this.file.relative.indexOf('assets') === 0 ? match : '"' + p1 + '"';
      }, { skipBinary: true }))
      .pipe(dest(config.copy.dest_styleguide));
  };
}

/**
 * Main copy task
 *  - copy build folder
 *  - copy assets sources
 *  - if configured, copy styleguide
 */
let copyTasks = [copyBuild, copySources];
if (copyStyleguide) {
  copyTasks.push(copyStyleguide);
}

const copyFiles = parallel(...copyTasks);

// Zip the deliverable files
const zipFiles = () => {
  return src(config.zip.src)
    .pipe(zip(config.zip.prefix + moment().format('YYYYMMDD-HHmm') + '.zip'))
    .pipe(dest(config.zip.dest));
};

/**
 * Prepare a zip for delivering code to the client
 *  - Build assets (defined in build.js)
 *  - Gather resources in a folder
 *  - Zip it
 */
const deliver = series(build, copyFiles, zipFiles);

/**
 * EXPORTS
 */
exports.default = deliver;
