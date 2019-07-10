var gulp        = require('gulp');
var replace     = require('gulp-replace');
var zip         = require('gulp-zip');
var fs          = require('fs');
var merge       = require('merge-stream');
var moment      = require('moment');
var runSequence = require('run-sequence');
var config      = require('../config').deliver;

if (!config) return;

/**
 *  Prepare a zip for delivering code to the client
 *   - Build assets (defined in build.js)
 *   - Gather resources in a folder
 *   - Zip it
 */
gulp.task('deliver', function(callback){
  return runSequence(
    'build',
    'deliver:copy',
    'deliver:zip',
    callback
  );
});

  /**
   *  Main copy task
   *   - copy build folder
   *   - copy assets sources
   */
  gulp.task('deliver:copy', ['deliver:copy:build', 'deliver:copy:sources']);

    // Copy build folder
    gulp.task('deliver:copy:build', function() {
      return gulp.src(config.copy.src_build)
        .pipe(gulp.dest(config.copy.dest_build));
    });

    /**
     * Copy assets sources
     *
     * This is a tricky task cause we need to detect all node_modules included in assets sources
     * and change there references to `vendor/{node_modules}` so all the resources are welled
     * delivered to the client.
     */
    gulp.task('deliver:copy:sources', function(callback){
      return runSequence(
        'deliver:copy:sources:original',
        'deliver:copy:sources:node_modules',
        callback
      );
    });

      /**
       * Node modules which are used as assets vendors
       * { directory: [node_module, ...], ... }
       */
      var node_modules_vendors = {};
      // Populate node_modules_vendors
      var addNodeModuleRef = function(directory, node_module){
        if(typeof node_modules_vendors[directory] === 'undefined')
          node_modules_vendors[directory] = [node_module];
        else if(node_modules_vendors[directory].indexOf(node_module) === -1)
          node_modules_vendors[directory].push(node_module);
      }

      /**
       * Prevent characters from a string to conflict with regex rules
       * Taken from lodash's escapeRegExp() : https://github.com/lodash/lodash/blob/4.17.11/lodash.js
       */
      var escapeRegExString = function(string){ return string.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'); };

      // Get dependencies listed in package.json
      var dependencies = Object.keys(JSON.parse(fs.readFileSync('./package.json'))['dependencies']) || [];
      // Escape them
      var escapeDependencies = dependencies.map(function(string){ return escapeRegExString(string); });
      // Create reg ex that will match node_modules references in assets sources
      var vendorRegExp = new RegExp('(' + escapeDependencies.join('|') + ')\/', 'gm');

      // Copy assets sources as they are, but replace node_modules references by `vendors/{node_module}`
      gulp.task('deliver:copy:sources:original', function(){
        return gulp.src(config.copy.src_sources)
          .pipe(replace(vendorRegExp, function(match, p1){
            var splitPath = this.file.relative.split("/");

            addNodeModuleRef(splitPath[0], p1);

            return 'vendors/' + match;
          }, {skipBinary: true}))
          .pipe(gulp.dest(config.copy.dest_sources))
      });

      // Copy all node_modules referenced in `node_modules_vendors`
      gulp.task('deliver:copy:sources:node_modules', function(){
        return merge(
          Object.keys(node_modules_vendors).map(function(key){
            return gulp.src('./node_modules/{' + node_modules_vendors[key].join(',') + '}/**/*')
              .pipe(gulp.dest(config.copy.dest_sources + '/' + key + '/vendors'));
          })
        );
      });

  // Zip the deliverable files
  gulp.task('deliver:zip', function() {
    return gulp.src(config.zip.src)
      .pipe(zip(config.zip.prefix + moment().format('YYYYMMDD-HHmm') + '.zip'))
      .pipe(gulp.dest(config.zip.dest));
  });
