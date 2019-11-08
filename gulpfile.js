const { watch, src, dest, series, parallel } = require('gulp');
const babel = require('gulp-babel'); //解析最新JS
var pug = require('gulp-pug'); //解析PUG
var rename = require("gulp-rename"); //檔案重新命名(去除原有目錄結構用))
var sass = require('gulp-sass'); //解析SASS
var clean = require('gulp-clean'); //輸出前清除資料夾
var uglifycss = require('gulp-uglifycss'); //css 壓縮
var uglify = require('gulp-uglify'); //js壓縮
var concat = require('gulp-concat'); //js合併檔案
var concatCss = require('gulp-concat-css'); //css 合併檔案
var gulpImagemin = require('gulp-imagemin'); //imgae 壓縮
sass.compiler = require('node-sass'); //解析SASS 用

img_def = function () {
  return src('src/img/**') //include.pug 除外
    .pipe(gulpImagemin())
    .pipe(dest('./dist/img'));
}

pug_def = function () {
  return src(['src/**/*.pug','!src/**/*.include.pug']) //include.pug 除外
    .pipe(pug({}))
    .pipe(rename({ dirname: '' })) //去除目錄結構
    .pipe(dest('./dist/'));
}

sass_def = function () {
  return src('src/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss("all.css"))
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    .pipe(rename({ dirname: '' }))
    .pipe(dest('./dist/css/'));
}
js_def = function () {
  return src(['src/**/*.js', '!src/extend/*.js'])
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(rename({ dirname: '' }))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('./dist/js/'));
}

initFolder = function () {
  return src('./dist/', { read: false })
    .pipe(clean());
}
creat_dist = function () {
  return src('*.*', { read: false })
  .pipe(dest('./dist'));
}

extendjs_def = function () { //extend 資料截js 編譯
  return src( ['src/extend/*.js','!src/extend/*.pre.js'])
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(rename({ dirname: '' }))
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(dest('./dist/js/'));
}
extendjsPre_def = function () { //extend 資料截js 編譯
  return src( 'src/extend/*.pre.js')
    .pipe(rename({ dirname: '' }))
    .pipe(concat('bundlePre.js'))
    .pipe(uglify())
    .pipe(dest('./dist/js/'));
}
extendcss_def = function () { //extend 資料截css 編譯
  return src('src/extend/*.css')
  .pipe(concatCss("bundle.css"))
  .pipe(uglifycss({
    "maxLineLen": 80,
    "uglyComments": true
  }))
  .pipe(rename({ dirname: '' }))
  .pipe(dest('./dist/css/'));
}
watch('src/**/*.pug', pug_def);
watch('src/**/*.sass', sass_def);
watch('src/**/*.js', js_def);
watch('src/img/**', img_def);
exports.default = series(creat_dist,initFolder, parallel(pug_def, sass_def, js_def,extendjs_def,extendcss_def,img_def,extendjsPre_def))


