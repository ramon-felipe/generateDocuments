var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    browsersync = require('browser-sync'),
    imagemin    = require('gulp-imagemin'),
    usemin      = require('gulp-usemin'),
    minifyjs    = require('gulp-js-minify'),
    htmlmin     = require('gulp-htmlmin'),
    cssmin      = require('gulp-cssmin');

const dist_path = 'dist/',
      dist_css_path = 'dist/css/',
      dist_img_path = 'dist/img/',
      src_path = 'src/',
      src_css_path = 'src/css/';


gulp.task('default', ['clean'], function(){
  gulp.start('copy', 'minify');
});

gulp.task('clean', function(){
  return gulp
    .src(dist_path + '*', {read: false})
    .pipe(clean());
});

gulp.task('copy', function(){
  gulp.start('copyjslib', 'copycsslib', 'copysvg');
});

gulp.task('copysvg', function(){
  gulp
    .src('src/img/*.svg')
    .pipe(gulp.dest(dist_img_path));
});

gulp.task('copyjslib', function(){
  gulp
    .src(['src/js/libs/bootstrap.min.js', 'src/js/libs/jquery.min.js'])
    .pipe(gulp.dest('dist/js/libs/'));
});

gulp.task('copycsslib', function(){
  gulp
    .src('src/css/libs/bootstrap.min.css')
    .pipe(gulp.dest('dist/css/libs'));
});

gulp.task('minify', ['imagemin', 'usemin'], function(){
  gulp.start('htmlmin');
});

gulp.task('imagemin', function(){
  gulp
  .src(['src/img/**/*.jpg',
        'src/img/**/*.jpeg',
        'src/img/**/*.png'])
  .pipe(imagemin())
  .pipe(gulp.dest(dist_img_path));
});

/*gulp.task('cssmin', function(){
  gulp
    .src('src/css/*.css')
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('jsmin', function(){
  gulp
    .src('src/js/*.js')
    .pipe(minifyjs())
    .pipe(gulp.dest('dist/js/'));
});*/

gulp.task('usemin', function(){
  return gulp
  .src('src/*.html')
  .pipe(usemin({
    js: [minifyjs],
    css: [cssmin]
  }))
  .pipe(gulp.dest(dist_path));
});

gulp.task('htmlmin', function(){
  gulp
  .src('dist/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe(gulp.dest(dist_path));
})

///////////////////////
// BROWSER SYNC
gulp.task('browsersync', function(){
  browsersync.init({
    server: {
      baseDir: dist_path
    }
  });

  gulp.watch('dist/index.html').on('change', browsersync.reload);
});
