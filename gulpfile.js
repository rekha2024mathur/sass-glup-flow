var gulp = require("gulp");
var sass = require('gulp-sass')(require('sass'));
var browserSync = require('browser-sync').create();
// var autoprefixer = require('gulp-autoprefixer'); // Not supported in newer version.
// import autoprefixer from 'gulp-autoprefixer';

var SOURCEPATH = {
    sassSource : 'src/scss/*.scss',
    htmlSource: 'src/*.html'
};

var APPPATH = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js'

}

function copy() {
    console.log('copy Called!!!');
    return gulp.src(SOURCEPATH.htmlSource)
        .pipe(gulp.dest(APPPATH.root))
}

function style() {
    // 1. Where is my SCSS file.
    return gulp.src(SOURCEPATH.sassSource)
    // 2. Pass that file through SCSS compiler.
    .pipe(sass())
    // Add autoprefixer Not compatible will look next time.
    // 3.  Where do I save the compiled CSS.
    .pipe(gulp.dest(APPPATH.css))
    // Stream changes to all browsers.
    .pipe(browserSync.stream())
}

function watch() {
    // console.log('inside watch!!');
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });

    gulp.watch(SOURCEPATH.sassSource, style);
    gulp.watch(SOURCEPATH.htmlSource, copy);
    gulp.watch(APPPATH.root + '*.html').on( 'change', browserSync.reload);
    gulp.watch(APPPATH.root + '*.js').on( 'change', browserSync.reload);
    
}

// exports.style = style;
// exports.watch = watch;
// Above statement can be written as follows in more common syntax too.

// gulp.task( 'copy',  copy);
// gulp.task( 'style',  style);
gulp.task( 'watch',  watch);

