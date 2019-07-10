var gulp   = require('gulp');
var del    = require('del');
var config = require('../config').clean;

if (!config) return;

// Delete wanted files
gulp.task('clean', function() {
  return del(config.src);
});
