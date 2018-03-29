var gulp = require('gulp');
var watch = require('gulp-watch');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var minify = require('gulp-minify');

var stlyePath = './public/stylesheets';

// Compile less
gulp.task('less', function() {
    return gulp.src([stlyePath + '/portal.less'])
        .pipe(watch([stlyePath + '/portal.less']))
        .pipe(less())
        .pipe(gulp.dest(stlyePath));
});

// Compile admin less
gulp.task('admin-less', function() {
    return gulp.src([stlyePath + '/admin.less'])
        .pipe(watch([stlyePath + '/admin.less']))
        .pipe(less())
        .pipe(gulp.dest(stlyePath));
});

// Minify css
gulp.task('minify-css', function() {
    return gulp.src([stlyePath + '/portal.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(stlyePath));
});

// Minify css
gulp.task('minify-growl', function() {
    return gulp.src(['./public/growl/stylesheets/jquery.growl.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./public/growl/stylesheets'));
});

// Minify admin css
gulp.task('minify-admin-css', function() {
    return gulp.src([stlyePath + '/admin.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(stlyePath));
});

//minify javascript
gulp.task('minify-js', function() {
    gulp.src('./public/js/script.js')
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.min.js']
        }))
        .pipe(gulp.dest('./public/js'))
});