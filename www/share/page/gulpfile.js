'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const webpack = require('webpack');
const browserSync = require('browser-sync');
const notifier = require('node-notifier');

const APP_ROOT = __dirname;
const DIST_DIRECTORY = `${APP_ROOT}/dist`;

const config = {
  server: {
    port: 8282,
    server: {
      baseDir: DIST_DIRECTORY,
      index: 'index.html'
    },
    files: ['**/*.html', '**/*.js', '**/*.css']
  },
  vendor: {
    js: {
      output: {
        filename: 'vendor.js'
      },
      files: [
        'node_modules/react/dist/react.js',
        'node_modules/react-dom/dist/react-dom.min.js'
      ]
    },
    style: {
      output: {
        filename: 'vendor.css'
      },
      files: [
        'node_modules/sanitize.css/sanitize.css'
      ]
    }
  },
  lint: {
    files: [
      `${APP_ROOT}/**/*.js`,
      `${APP_ROOT}/**/*.jsx`
    ]
  }
};

const plumberNotifier = (taskName) => {
  return {
    errorHandler: (error) => {
      const title = `[task]${taskName} ${error.plugin}`;
      const errorMsg = `error: ${error.message}`;
      /* eslint-disable no-console */
      console.error(`${title}\n${error}`);
      /* eslint-enable no-console */
      notifier.notify({
        title: title,
        message: errorMsg,
        time: 3000
      });
    }
  };
};

gulp.task('server', () => {
  browserSync(config.server);
});

gulp.task('reloadServer', () => {
  browserSync.reload();
});

gulp.task('vendor-js', () => {
  return gulp.src(config.vendor.js.files)
  .pipe(plumber(plumberNotifier('vendor-js')))
  .pipe(concat(config.vendor.js.output.filename))
  .pipe(plumber.stop())
  .pipe(gulp.dest(DIST_DIRECTORY));
});
gulp.task('vendor-css', () => {
  return gulp.src(config.vendor.style.files)
  .pipe(plumber(plumberNotifier('vendor-css')))
  .pipe(concat(config.vendor.style.output.filename))
  .pipe(plumber.stop())
  .pipe(gulp.dest(DIST_DIRECTORY));
});
gulp.task('vendor', ['vendor-js', 'vendor-css']);
gulp.task('dist', ['vendor'], () => {
  return gulp.src([
    `${APP_ROOT}/index.html`,
    `${APP_ROOT}/font-awesome/**/*.css`,
    `${APP_ROOT}/font-awesome/**/*.woff2`
  ], { base: APP_ROOT })
  .pipe(gulp.dest(DIST_DIRECTORY));
});

const webpackBuild = (conf, cb) => {
  webpack(conf, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      throw err;
    }
    if (!cb.called) {
      cb.called = true;
      return cb();
    }
  });
};
gulp.task('webpack', ['lint'], (cb) => {
  const conf = require('./webpack.config');
  webpackBuild(conf, cb);
});
gulp.task('watch-webpack', ['lint'], (cb) => {
  const conf = Object.assign(require('./webpack.config'), { watch: true });
  webpackBuild(conf, cb);
});
gulp.task('lint', () => {
  return gulp.src(config.lint.files)
  .pipe(plumber(plumberNotifier('lint')))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failOnError())
  .pipe(plumber.stop());
});
gulp.task('build', ['dist', 'webpack'], () => {});
gulp.task('watch', ['watch-webpack'], () => {
  gulp.watch([
    `${APP_ROOT}/**/*.html`,
    `${APP_ROOT}/**/*.css`
  ], ['dist']);
});
gulp.task('default', ['build', 'watch', 'server']);