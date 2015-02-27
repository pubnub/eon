var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-css');

var scripts = [
  'bower_components/pubnub/web/pubnub.min.js',
  'bower_components/d3/d3.min.js',
  'bower_components/c3/c3.js',
  'bower_components/rickshaw/rickshaw.min.js',
  'bower_components/eon-mapbox/lib/mapbox.js',
  'bower_components/eon-c3/pubnub-c3.js',
  'bower_components/eon-rickshaw/Rickshaw.Fixtures.PubNub.js',
  'bower_components/eon-mapbox/pubnub-mapbox.js',
  'bind.js'
];

var styles = [
  'bower_components/c3/c3.min.css',
  'bower_components/eon-mapbox/lib/mapbox.css'
];

gulp.task('javascript', function(){

  return gulp.src(scripts)
    .pipe(concat('eon.js'))
    //.pipe(uglify({
    //  mangle: false
    //}))
    .pipe(gulp.dest('build'));

});

gulp.task('css', function(){
  return gulp.src(styles)
    .pipe(concat('eon.css'))
    .pipe(gulp.dest('build'));

});

gulp.task('default', ['javascript', 'css']);