// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass');

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('public/stylesheets/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/stylesheets/css'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('public/stylesheets/sass/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['sass', 'watch']);
