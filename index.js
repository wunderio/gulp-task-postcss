'use strict';

var path = require('path');
var defaultsDeep = require('lodash.defaultsdeep');
var map = require('lodash.map');
var notifier = require('node-notifier');

var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var filter = require('gulp-filter');

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

  // Default watch task.
  gulp.task('postcss-watch', ['postcss'], function () {
    gulp.watch(path.join(gulpConfig.basePath, config.src), ['postcss'])
  });

  // PostCSS with sourcemaps.
  gulp.task('postcss', function () {
    var processors = map(Object.keys(config.processors), function (processor) {
      return require(processor)(config.processors[processor]);
    });

    var errorThrown = false;

    // Create stream to catch postcss errors.
    var postcssStream = postcss(processors);

    postcssStream.on('error', function (error) {
      // Log error to console.
      console.error(error.message);

      // Display error notification.
      var message = error.message
        .replace(/^\/[^ ]+\//, '')
        .replace(/\^/, '')
        .replace(/\s/, ' ')
        .trim();

      notifier.notify({
        title: config.notify.title + ' - PostCSS Error',
        message: message,
        icon: gulpConfig.notify.errorIcon,
        sound: false
      });

      errorThrown = true;

      this.emit('end');
    });

    return gulp.src(path.join(gulpConfig.basePath, config.src))
      .pipe(filter(function (file) {
        return !/^_/.test(path.basename(file.path));
      }))
      .pipe(sourcemaps.init())
      .pipe(postcssStream)
      .pipe(sourcemaps.write())
      .pipe(rename(function (path) {
        // Remove ".p" from filename.
        path.basename = path.basename.substr(0, path.basename.length -2);
      }))
      .pipe(gulp.dest(path.join(gulpConfig.basePath, config.dest)))
      .on('end', function () {
        if (!errorThrown) {
          notifier.notify({
            title: config.notify.title,
            message: config.notify.message,
            icon: gulpConfig.notify.successIcon,
            sound: false
          });
        }
      });
  });
};
