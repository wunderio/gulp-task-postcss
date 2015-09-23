'use strict';

var projectConfig = require('../../config');

var gulp = require('gulp');
var path = require('path');
var defaults = require('lodash.defaults');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');

// PostCSS plugins
var autoprefixer = require('autoprefixer');

// Merge default & project config
var defaultConfig = {
  src: '/postcss/**/*.p.css',
  dest: '/css',
  processors: {
    autoprefixer: {
      browsers: ['last 2 versions']
    }
  },
  notify: {
    title: 'Wunderkraut',
    message: 'PostCSS compiled.'
  }
};

var config = defaults(projectConfig.stylesheets, defaultConfig);

// Default task mapping.
gulp.task('stylesheets', ['postcss-compile']);


// PostCSS with sourcemaps.
gulp.task('postcss-compile', function () {
  var processors = [
    autoprefixer(config.processors.autoprefixer),
  ];

  return gulp.src(projectConfig.basePath + config.src)
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write())
    .pipe(rename(function (path) {
      // Remove ".p" from filename.
      path.basename = path.basename.substr(0, path.basename.length -2);
    }))
    .pipe(gulp.dest(projectConfig.basePath + config.dest))
    .pipe(notify({
      title: config.notify.title,
      message: config.notify.message,
      sound: false
    }));
});
