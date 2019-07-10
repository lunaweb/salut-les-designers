const glob = require('glob');
const path = require('path');

/**
 * Exports all tasks
 *
 * Since Gulp 4, the gulp.task() declaration is no more recommended in favour for exports.
 * https://gulpjs.com/docs/en/getting-started/creating-tasks
 *
 * We're exporting all public properties (tasks or other) found in tasks files.
 *
 * Default exports are imported under the module name.
 * Other exports are imported as `modulename:property`.
 */
glob.sync('./gulpfile.js/tasks/**/*.js').forEach((file) => {
  moduleName = path.basename(file, path.extname(file));

  const requiredModule = require(path.resolve(file));

  for (key in requiredModule) {
    if (key === 'default') {
      module.exports[moduleName] = requiredModule[key];
    } else {
      module.exports[moduleName + ':' + key] = requiredModule[key];
    }
  }
});

// Define default task
if (typeof this['build:dev'] !== 'undefined') {
  module.exports.default =this['build:dev'];
}
