'use strict';

var path = require('path');
var defaultsDeep = require('lodash.defaultsdeep');
var map = require('lodash.map');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');

// PostCSS plugins
var autoprefixer = require('autoprefixer');

module.exports = function (gulp, gulpConfig) {

  gulpConfig = gulpConfig || { basePath: '.' };

  // Merge default config with gulp config.
  var defaultConfig = {
    stylesheets: {
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
    }
  };

  var config = defaultsDeep(gulpConfig, defaultConfig).stylesheets;

  // Default task mapping.
  gulp.task('stylesheets', ['postcss-compile']);

  // PostCSS with sourcemaps.
  gulp.task('postcss-compile', function () {
    var processors = map(Object.keys(config.processors), function (processor) {
      return require(processor)(config.processors[processor]);
    });

    return gulp.src(gulpConfig.basePath + config.src)
      .pipe(sourcemaps.init())
      .pipe(postcss(processors))
      .pipe(sourcemaps.write())
      .pipe(rename(function (path) {
        // Remove ".p" from filename.
        path.basename = path.basename.substr(0, path.basename.length -2);
      }))
      .pipe(gulp.dest(gulpConfig.basePath + config.dest))
      .pipe(notify({
        title: config.notify.title,
        message: config.notify.message,
        sound: false
      }));
  });
};
