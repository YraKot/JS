"use strict";

var gulp = require('gulp'),
	path = require('path'),
	data = require('gulp-data'),
	pug = require('gulp-pug'),
	prefix = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync');

/*
 * Directories here
 */
var paths = {
	public: './public/',
	sass: './src/sass/',
	css: './public/css/',
	data: './src/_data/',
	js: './public/js/',
	assets: './public/assets/'
};

/**
 * Compile .pug files and pass in data from json file
 * matching file name. index.pug - index.pug.json
 */
gulp.task('pug', function () {
	return gulp.src('./src/*.pug')
	.pipe(data(function (file) {
		return require(paths.data + path.basename(file.path) + '.json');
	}))
	.pipe(pug())
	.on('error', function (err) {
		process.stderr.write(err.message + '\n');
		this.emit('end');
	})
	.pipe(gulp.dest(paths.public));
});


gulp.task('assets', function(){
	return gulp.src('./src/assets/**/*.wav')
		.pipe(gulp.dest(paths.assets))
		.pipe(browserSync.reload({
			stream: true
		}));
});



gulp.task('js', function(){
	return gulp.src('./src/js/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('app.min.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.js))
		.pipe(browserSync.reload({
			stream: true
		}));
});


/**
 * Recompile .pug files and live reload the browser
 */
gulp.task('rebuild', ['pug'], function () {
	browserSync.reload();
});

/**
 * Wait for pug and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'pug', 'js', 'assets'], function () {
	browserSync({
	server: {
		baseDir: paths.public
	},
	notify: false
	});
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
	return gulp.src(paths.sass + '*.sass')
	.pipe(sass({
		includePaths: [paths.sass],
		outputStyle: 'compressed'
	}))
	.on('error', sass.logError)
	.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
		cascade: true
	}))
	.pipe(gulp.dest(paths.css))
	.pipe(browserSync.reload({
		stream: true
	}));
});

gulp.task('watch', function () {
	gulp.watch(paths.sass + '**/*.sass', ['sass']);
	gulp.watch('./src/**/*.pug', ['rebuild']);
	gulp.watch('./src/js/*.js', ['js']);
	gulp.watch('./src/assets/**/*.wav', ['assets']);
});

gulp.task('build', ['sass', 'pug', 'js', 'assets']);
gulp.task('default', ['browser-sync', 'watch']);
