var gulp = require("gulp");
var sass = require('gulp-sass')(require('sass'));
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var mergeStream = require('ordered-read-streams');
var newer = require('gulp-newer');
// var imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');


var injectPartials = require('gulp-inject-partials');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');


var SOURCEPATH = {
    sassSource : 'src/scss/*.scss',
    htmlSource: 'src/*.html',
    htmlPartialsSrc: 'src/partials/*.html',
    jsSource: 'src/js/**',
    imgSource: 'src/img/**'
};

var APPPATH = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js/',
    img:'app/img',
}

function clean_html() {
    return gulp.src(APPPATH.root + '*.html', {read:false})
        .pipe(clean());
}

// function copy() {
//     return gulp.src(SOURCEPATH.htmlSource)
//         .pipe(gulp.dest(APPPATH.root))
// }

function clean_scritps() {
    return gulp.src(APPPATH.js + '*.js', {read:false})
        .pipe(clean());
}

function copy_scripts() {
    return gulp.src(SOURCEPATH.jsSource)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(APPPATH.js))
}

function compress() {
    return gulp.src(SOURCEPATH.jsSource)
        .pipe(concat('main.js'))
        .pipe(minify())
        .pipe(gulp.dest(APPPATH.js))
}

function image(){
    return gulp.src(SOURCEPATH.imgSource)
        .pipe(APPPATH.img)
        .pipe(imagemin())
        .pipe(gulp.dest(APPPATH.img))
}


function html() {
    return gulp.src(SOURCEPATH.htmlSource)
        .pipe(injectPartials())
        .pipe(gulp.dest(APPPATH.root))
}

function minifyHtml() {
    return gulp.src(SOURCEPATH.htmlSource)
        .pipe(injectPartials())
        .pipe(htmlmin({collapseWhitespace:true}))
        .pipe(gulp.dest(APPPATH.root))
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


function compresscss() {
    
    var boostrap = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    var sassFiles;
    sassFiles = gulp.src(SOURCEPATH.sassSource)
            .pipe(sass());

    return mergeStream([boostrap,sassFiles])
        .pipe(concat('app.css'))
        .pipe(cleancss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(APPPATH.css))
        .pipe(browserSync.stream())
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });

    gulp.watch(SOURCEPATH.sassSource, style);
    // gulp.watch(SOURCEPATH.sassSource, style);
    // gulp.watch(SOURCEPATH.imgSource, image); // No success by require.

    // gulp.watch(APPPATH.css + '/*.css').on( 'change', browserSync.reload);
    gulp.watch(SOURCEPATH.jsSource, clean_scritps);
    gulp.watch(SOURCEPATH.jsSource, copy_scripts);
    gulp.watch(SOURCEPATH.htmlSource, clean_html)
    // gulp.watch(SOURCEPATH.htmlSource, copy);
    gulp.watch(SOURCEPATH.htmlSource, html);
    gulp.watch(SOURCEPATH.htmlPartialsSrc, html);
    gulp.watch(APPPATH.root + '*.html').on( 'change', browserSync.reload);
    gulp.watch(APPPATH.root + '*.js').on( 'change', browserSync.reload);
    
}

// exports.style = style;
// exports.watch = watch;
// Above statement can be written as follows in more common syntax too.
gulp.task( 'compress', compress);
gulp.task( 'watch', watch);
gulp.task( 'compresscss', compresscss);
gulp.task( 'minifyHtml', minifyHtml);
// gulp.task( 'default', watch );