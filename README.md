Gulp task PostCSS
=================

> A gulp task for PostCSS processing.

## Installation
```sh
npm install --save-dev wunderkraut/gulp-task-postcss
```

## Usage

### Basic usage

```js
// Require gulp.
var gulp = require('gulp')

// Require task module and pass gulp to provide the gulp tasks.
require('gulp-task-postcss')(gulp)
```

### Advanced usage
You can also pass a configuration to the task. This allows you to overwrite the default configuration and provide other configuration like a base path for your files.

#### gulpfile.js
```js
var gulp = require('gulp')
var gulpConfig = require('./gulpconfig')

// Just pass the configuration object as second parameter.
require('gulp-task-postcss')(gulp, gulpConfig)
```

#### gulpconfig.js
```js
module.exports = {
  // Basic configuration.
  basePath: '.',

  // Overwrite default configurations.
  stylesheets: {
    src: '/assets/postcss/**/*.css',
    dest: '/assets/css'
  }
}
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/wunderkraut/gulp-task-postcss/issues/new).
