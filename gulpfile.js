var gulp = require('gulp');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var pump = require('pump');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
  gulp.start('minify-js');
  gulp.start('minify-css');
  gulp.start('minify-img');
  gulp.start('minify-sub-js');
  gulp.start('minify-sub-css');
  gulp.start('minify-sub-img');
});

gulp.task('hello', function(){
  console.log('Hello nacat');
});

gulp.task('watch', function () {
  gulp.watch('public/src/js/*.js', ['minify-js']);
  gulp.watch('public/src/css/*.css', ['minify-css']);
});

gulp.task('minify-js', function (cb) {
  pump([
      gulp.src('public/src/js/*.js'),
      uglify(),
      gulp.dest('public/dest/js')
    ],
    cb
  );
});
 
gulp.task('minify-css', function(){
	gulp.src('public/src/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/dest/css'));
});

gulp.task('minify-img', function(){
	gulp.src('public/src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/dest/img'))
});

gulp.task('minify-sub-js', function (cb) {
  pump([
      gulp.src('public/src/subdomain/js/*.js'),
      uglify(),
      gulp.dest('public/dest/subdomain/js')
    ],
    cb
  );
});
 
gulp.task('minify-sub-css', function(){
  gulp.src('public/src/subdomain/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/dest/subdomain/css'));
});

gulp.task('minify-sub-img', function(){
  gulp.src('public/src/subdomain/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/dest/subdomain/img'))
});
