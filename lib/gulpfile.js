var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var scripts = [
  'bower_components/pubnub/web/pubnub.min.js',
  'bower_components/d3/d3.min.js',
  'bower_components/c3/c3.js',
  'bower_components/rickshaw/rickshaw.min.js',
  'bower_components/eon-mapbox/lib/mapbox.js',
  'bower_components/eon-c3/js/pubnub-c3.js',
  'bower_components/eon-rickshaw/Rickshaw.Fixtures.PubNub.js',
  'bower_components/eon-mapbox/pubnub-mapbox.js'
];

gulp.task('default', function() {
  return gulp.src(scripts)
    .pipe(concat('eon.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build'));
});