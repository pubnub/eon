var bower = require('./bower.json');

console.log(bower)

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-css');

var pubnub = [
  'bower_components/pubnub/web/pubnub.min.js',
  'bower_components/subsub/subsub.js'
];

var map = [
  'bower_components/eon-map/lib/mapbox.js',
  'bower_components/eon-map/pubnub-mapbox.js',
];

var chart = [
  'bower_components/d3/d3.min.js',
  'bower_components/c3/c3.js',
  'bower_components/visibilityjs/lib/visibility.core.js',
  'bower_components/eon-chart/pubnub-c3.js'
];

var styles = [
  'bower_components/c3/c3.min.css',
  'bower_components/eon-map/lib/mapbox.css'
];

var images = [
  'bower_components/eon-map/lib/images/*'
];

var map_files = pubnub
  .concat(map);

var chart_files = pubnub
  .concat(chart);

var all_files = pubnub
  .concat(chart)
  .concat(map);

gulp.task('map', function(){

   gulp.src(map_files)
    .pipe(concat('eon-map.js'))
    .pipe(gulp.dest('v/eon-map/' + bower.dependencies['eon-map']));

});

gulp.task('chart', function(){

   gulp.src(chart_files)
    .pipe(concat('eon-chart.js'))
    .pipe(gulp.dest('v/eon-chart/' + bower.dependencies['eon-chart']));

});

gulp.task('javascript', function(){

   gulp.src(all_files)
    .pipe(concat('eon.js'))
    .pipe(gulp.dest('v/eon/' + bower.version));

});

gulp.task('css', function(){

   gulp.src(styles)
    .pipe(concat('eon.css'))
    .pipe(gulp.dest('v/eon/' + bower.version));

});

gulp.task('images', function(){

  return gulp.src(images)
    .pipe(gulp.dest('v/eon-map/' + bower.dependencies['eon-map'] + '/images'))
    .pipe(gulp.dest('v/eon/' + bower.version + '/images'))
    .pipe(gulp.dest('lib/images'));

});

gulp.task('default', ['map', 'chart', 'javascript', 'css', 'images']);