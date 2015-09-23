Gulp task PostCSS
=================

> A gulp task for PostCSS processing.

## Installation
```sh
npm install --save-dev wunderkraut/gulp-task-postcss
```

## Usage
```js
// Require gulp.
var gulp = require('gulp')

// Configurate.
var gulpConfig {
  basePath: '.',
  // Overwrite default config
  stylesheets: {
    src: '/assets/postcss/**/*.css',
    dest: '/assets/css'
  }
}

// Require task module to provide the gulp tasks.
require('gulp-task-postcss')(gulp, gulpConfig)
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/wunderkraut/gulp-task-postcss/issues/new).
