var gulp = require("gulp");
var sass = require('gulp-sass')(require('sass'));
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var SOURCEPATH = {
    sassSource : 'src/scss/*.scss'

};

var APPPATH = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js',

}

// Compile SCSS into CSS & auto-inject into browsers.
gulp.task('sass', function() {
    return gulp.src(SOURCEPATH.sassSource)
        .pipe(sass({ outputStyle:'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest(APPPATH.css))
});

gulp.task('serve', gulp.series( 'sass', function() {
    browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
        server: {
            baseDir: APPPATH.root
        }
    });
   
}));


gulp.task('watch', gulp.series('serve'), function() {
    gulp.watch(SOURCEPATH.sassSource, gulp.series('sass'));
});
