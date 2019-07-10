var gulp        = require('gulp');
var runSequence = require('run-sequence');
var config = require('../config');

var concurrentTasks = ['images', 'stylesheets', 'javascripts', 'fonts'];

// Staging & Production : Rebuild assets
gulp.task('build', function(callback){
  return runSequence(
    'clean',
    concurrentTasks,
    callback
  );
});

// Developement : Rebuild assets and watch them
gulp.task('build-dev', function(callback){
  return runSequence(
    'clean',
    concurrentTasks,
    'watch',
    callback
  );
});
