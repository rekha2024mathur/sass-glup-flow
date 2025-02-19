var gulp = require("gulp");
var sass = require('gulp-sass')(require('sass'));
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var mergeStream = require('ordered-read-streams');
var newer = require('gulp-newer');
// var imagemin = require('gulp-imagemin');


var SOURCEPATH = {
    sassSource : 'src/scss/*.scss',
    htmlSource: 'src/*.html',
    jsSource: 'src/js/**',
    imgSource: 'src/img/**'
};

var APPPATH = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js/',
    img:'app/img'
}

function clean_html() {
    return gulp.src(APPPATH.root + '*.html', {read:false})
        .pipe(clean());
}

function copy() {
    return gulp.src(SOURCEPATH.htmlSource)
        .pipe(gulp.dest(APPPATH.root))
}

function clean_scritps() {
    return gulp.src(APPPATH.js + '*.js', {read:false})
        .pipe(clean());
}

function copy_scripts() {
    return gulp.src(SOURCEPATH.jsSource)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(APPPATH.js))
}

function image(){
    return gulp.src(SOURCEPATH.imgSource)
        .pipe(APPPATH.img)
        .pipe(imagemin())
        .pipe(gulp.dest(APPPATH.img))
}

function style() {
    
    var boostrap = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    var sassFiles;
    sassFiles = gulp.src(SOURCEPATH.sassSource)
            .pipe(sass());

    return mergeStream([boostrap,sassFiles])
        .pipe(concat('app.css'))
        .pipe(gulp.dest(APPPATH.css))
        .pipe(browserSync.stream())

   /* // 1. Where is my SCSS file.
    return gulp.src(SOURCEPATH.sassSource)
    // 2. Pass that file through SCSS compiler.
    .pipe(sass())
    // Add autoprefixer Not compatible will look next time.
    // 3.  Where do I save the compiled CSS.
    .pipe(gulp.dest(APPPATH.css))
    // Stream changes to all browsers.
    .pipe(browserSync.stream())*/
   
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });

    gulp.watch(SOURCEPATH.sassSource, style);
    gulp.watch(SOURCEPATH.sassSource, style);
    // gulp.watch(SOURCEPATH.imgSource, image); // No success by require.

    // gulp.watch(APPPATH.css + '/*.css').on( 'change', browserSync.reload);
    gulp.watch(SOURCEPATH.jsSource, clean_scritps);
    gulp.watch(SOURCEPATH.jsSource, copy_scripts);
    gulp.watch(SOURCEPATH.htmlSource, clean_html)
    gulp.watch(SOURCEPATH.htmlSource, copy);
    gulp.watch(APPPATH.root + '*.html').on( 'change', browserSync.reload);
    gulp.watch(APPPATH.root + '*.js').on( 'change', browserSync.reload);
    
}

// exports.style = style;
// exports.watch = watch;
// Above statement can be written as follows in more common syntax too.
gulp.task( 'watch', watch);
// gulp.task( 'default', watch );