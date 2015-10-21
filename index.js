'use strict';

var path = require('path');
var defaultsDeep = require('lodash.defaultsdeep');
var map = require('lodash.map');
var notifier = require('node-notifier');

var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var tap = require('gulp-tap');
var stripSync = require('strip-css-singleline-comments/sync');

var postcssImport = require('postcss-import');

module.exports = function (gulp, gulpConfig) {

  gulpConfig = gulpConfig || {basePath: '.'};

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
  var streamSrc = path.join(gulpConfig.basePath, config.src);
  var streamDest = path.join(gulpConfig.basePath, config.dest);

  // Create postcss processors array based on the given configuration.
  var processors = map(Object.keys(config.processors), function (processor) {
    return require(processor)(config.processors[processor]);
  });

  // Postcss error handler.
  var errorThrown = false;
  var postcssErrorHandler = function (error) {
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
  };

  // Creates core postcss stream used by both tasks.
  var postcssGulpStream = function (srcPath) {
    // Wrap postcss in a stream to catch postcss errors.
    var postcssStream = postcss(processors);

    // This stream imports files while removing single line comments from all files.
    var postcssImportStream = postcss([
      postcssImport({
        transform: function (content) {
          return stripSync(content);
        }
      })
    ]);

    // Attach error handler to streams.
    postcssStream.on('error', postcssErrorHandler);
    postcssImportStream.on('error', postcssErrorHandler);

    var stream = gulp.src(srcPath)
      .pipe(filter(function (file) {
        return !/^_/.test(path.basename(file.path));
      }))
      .pipe(sourcemaps.init())
      .pipe(tap(function (file) {
        // Strips all single line comments from the base files.
        file.contents = new Buffer(stripSync(file.contents));
      }))
      .pipe(postcssImportStream)
      .pipe(postcssStream)
      .pipe(sourcemaps.write())
      .pipe(rename(function (path) {
        // Remove ".p" from filename if exists.
        var remove = '.p';
        if (path.basename.substr(path.basename.length - remove.length) === remove) {
          path.basename = path.basename.substr(0, path.basename.length - remove.length);
        }
      }))
      .on('end', function () {
        var relativePath = path.relative(streamSrc, srcPath);
        if (!errorThrown) {
          notifier.notify({
            title: config.notify.title,
            message: config.notify.message + "\n" + relativePath,
            icon: gulpConfig.notify.successIcon,
            sound: false
          });
        }
        else {
          errorThrown = false;
        }
      })
      .pipe(gulp.dest(streamDest));

    return stream;
  };

  // Default watch task for postcss.
  gulp.task('postcss-watch', ['postcss'], function () {
    gulp.watch(streamSrc, function (event) {
      if (['changed', 'added'].indexOf(event.type) !== -1) {
        return postcssGulpStream(event.path);
      }
    });
  });

  // Processes postcss source files.
  gulp.task('postcss', function () {
    return postcssGulpStream(streamSrc);
  });
};
