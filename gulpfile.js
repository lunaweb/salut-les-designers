var gulp      = require('gulp'),
    shell     = require('gulp-shell'),
    zip       = require('gulp-zip'),
    moment    = require('moment'),
    rename    = require('gulp-rename'),
    svgstore  = require('gulp-svgstore'),
    svgmin    = require('gulp-svgmin');

gulp.task('svgmin', function () {
  return gulp
    .src('app/assets/images/front/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('app/assets/images/front'));
});

gulp.task('sprite', ['svgmin'], function () {
  return gulp
    .src('app/assets/images/front/sprite/*.svg')
    .pipe(rename({prefix: 'sprite-'}))
    .pipe(svgmin())
    .pipe(svgstore({
      inline: true
    }))
    .pipe(gulp.dest('app/assets/images/front'));
});

gulp.task('zip', ['clean'], function() {
  return gulp.src(['./build/**/*.*', '!./**/prototype/**'])
    .pipe(zip('livrable-' + moment().format('YYYYMMDD-HHmm') + '.zip'))
    .pipe(gulp.dest('./livrables/'));
});

gulp.task('build', shell.task([
  'bundle exec middleman build'
]));

gulp.task('deploy', shell.task('bundle exec middleman deploy'));

gulp.task('default', ['zip']);

gulp.task('watch', ['build'], function () {
  gulp.watch('app/assets/images/front/sprite/*.svg', ['sprite']);
});
