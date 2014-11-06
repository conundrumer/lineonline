// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass');
// var compass = require('gulp-compass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('./public/stylesheets/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/stylesheets/css/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./public/stylesheets/sass/*.scss', ['sass']);
});

// Browserify
gulp.task('browserify', function() {
    var path = './public/js/src/';
    var files = [
        path + 'scripts.js'
    ];
    var bundler = browserify(files, watchify.args);

    var bundle = function() {
        return bundler.bundle()
            //Pass desired output filename to vinyl-source-stream
            .pipe(source('bundle.js'))
            //Start piping stream to tasks
            .pipe(gulp.dest('./public/js/build/'));
    };

    bundler = watchify(bundler);
    bundler.on('update', bundle);

    return bundle();
});

// Default Task
gulp.task('default', ['browserify', 'sass', 'watch']);
