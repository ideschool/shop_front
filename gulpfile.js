'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const scssSrc = './src/scss/*.scss';

sass.compiler = require('node-sass');

gulp.task('sass', () => {
    return gulp.src(scssSrc)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', () => {
    gulp.watch(scssSrc, gulp.parallel('sass'));
});
