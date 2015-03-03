var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-css');

var pubnub = [
  'bower_components/pubnub/web/pubnub.min.js'
];

var map = [
  'bower_components/eon-map/lib/mapbox.js',
  'bower_components/eon-map/pubnub-mapbox.js',
];

var chart = [
  'bower_components/d3/d3.min.js',
  'bower_components/c3/c3.js',
  'bower_components/eon-chart/pubnub-c3.js'
];

var bind = [
  'bind.js'
];

var styles = [
  'bower_components/c3/c3.min.css',
  'bower_components/eon-map/lib/mapbox.css'
];

var map_files = pubnub
  .concat(map)
  .concat(bind);

var chart_files = pubnub
  .concat(chart)
  .concat(bind);

var all_files = pubnub
  .concat(chart)
  .concat(map)
  .concat(bind)

gulp.task('map', function(){

  return gulp.src(map_files)
    .pipe(concat('eon-map.js'))
    .pipe(gulp.dest('../lib'));

});

gulp.task('chart', function(){

  return gulp.src(chart_files)
    .pipe(concat('eon-chart.js'))
    .pipe(gulp.dest('../lib'));

});

gulp.task('javascript', function(){

  return gulp.src(all_files)
    .pipe(concat('eon.js'))
    .pipe(gulp.dest('../lib'));

  /*
  return gulp.src(scripts)
    .pipe(concat('eon.js'))
    //.pipe(uglify({
    //  mangle: false
    //}))
    .pipe(gulp.dest('build'));
  */

});

gulp.task('css', function(){

  return gulp.src(styles)
    .pipe(concat('eon.css'))
    .pipe(gulp.dest('../lib'));

});

gulp.task('default', ['map', 'chart', 'javascript', 'css']);