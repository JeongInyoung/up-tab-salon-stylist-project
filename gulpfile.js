 // =======================================
// NPM 모듈 호출
// =======================================

var gulp			= require('gulp'),
	g_if				= require('gulp-if'),
	shell			= require('gulp-shell'),
	rename			= require('gulp-rename'),
	filter			= require('gulp-filter'),

	includer		= require('gulp-html-ssi'),

	sass			= require('gulp-sass'),
	rubySass		= require('gulp-ruby-sass'),

	sourcemaps	= require('gulp-sourcemaps'),
	csso			= require('gulp-csso'),

	concat			= require('gulp-concat'),
	uglify			= require('gulp-uglify'),

	imagemin		= require('gulp-imagemin'),
	pngquant		= require('imagemin-pngquant'),

	iconic			= require('gulp-iconic');

	browserSync	= require('browser-sync'),
	reload			= browserSync.reload;


// =======================================
// 환경설정
// =======================================

// 디렉토리 설정
const SRC	 = 'html';
const BUILD = 'build';

// 파일 압축 설정
var compress = {
	'css_singleline' : true,
	'js' : false,
};

// 디렉토리 설정
var dir = {
	'css': SRC + '/css',
	'js' : SRC + '/js',
};

// 자바스크립트 파일 병합 순서
var js_order = [
	// dir.js + '/**/*.js',
	dir.js + '/kalypto.checked.js',		// Checkbox or Radio Style 설정
	dir.js + '/jquery.popupLayer.js',		// 레이어 팝업
	dir.js + '/echo.min.js',				// Loading Image 사용
	dir.js + '/smooth-scroll.js',			// 상, 하 이동 스크롤 부드럽게
	dir.js + '/jquery.lazyload.min.js',	// Image 사이즈 변화
	dir.js + '/svg-injector.min.js',		// IMG => SVG로 변환, ie9 이하 버전 PNG로 대체
	dir.js + '/stb.dropdown.min.js',	// Select Box Style 설정
	dir.js + '/jiy.toggleshow.js',			// 토글 메뉴 설정
];

// 자바스크립트 파일 이동 (원본유지)
var moveJS = [
	dir.js + '/common.js',				// 공통 작업 자바스크립트
];

// =======================================
// 기본 업무
// =======================================
gulp.task('default', ['remove', 'server']);

// =======================================
// 빌드 업무
// =======================================
gulp.task('build', function() {
	compress.css = true;
	compress.js  = true;
	gulp.start('remove');
	gulp.start('htmlSSI');
	gulp.start('sass');
	gulp.start('js');
	gulp.start('iconfont');
	gulp.start('imagemin');
	setTimeout(function() {
		gulp.start('css:min');
	}, 16000);
});

// =======================================
// 관찰 업무
// =======================================
gulp.task('watch', function() {
	gulp.watch( SRC + '/**/*.html', ['htmlSSI'] );
	gulp.watch( SRC + '/sass/**/*', ['sass']);
	gulp.watch( SRC + '/js/**/*', ['js']);
	gulp.watch(SRC + '/images/**/*', ['imagemin']);
	gulp.watch( SRC + '/**/*.html' ).on('change', reload);
});

// =======================================
// 폴더 제거 업무
// =======================================
gulp.task('remove', shell.task('rm -rf ' + BUILD + ' ' + SRC + '/iconfont/fonts ' + SRC + '/iconfont/preview ' + SRC + '/sass/fonts/_iconfont.scss' + ' cache'));

// =======================================
// 서버 업무
// =======================================
gulp.task('server', ['imagemin', 'iconfont', 'htmlSSI', 'sass', 'js'], function() {
	browserSync.init({
		// 알림 설정
		notify: !true,
		// 포트 설정
		port: 9292,
		// 서버 설정
		server: {
			// 기본 디렉토리 설정
			baseDir: [ BUILD ],
			// 라우트 설정
			routes: {
				'/bower_components' : 'bower_components',
			}
		},
	});
	gulp.start('watch');
});

// =======================================
// HTML SSI(Server Side Include) 업무
// =======================================
gulp.task('htmlSSI', function() {
	gulp.src( SRC + '/**/*.html' )
		.pipe( includer() )
		.pipe( gulp.dest( BUILD ) );
});

// =======================================
// Sass 업무
// =======================================
gulp.task('sass', function() {
	return rubySass( SRC + '/sass/**.{sass,scss}', {
		defaultEncoding : 'utf-8',
		compass: true,
		require: ['susy'],
		style: compress.css_singleline ? 'compact' : 'expanded',
		sourcemap: true,
		lineNumbers: false,
		// noCache : true, // 캐시 사용 안할 시 'true' 캐시 사용 시 '!true',
		cacheLocation: "./cache"
	})
	.on('error', function(err) {
			console.error('Error!', err.message);
		})
		.pipe( sourcemaps.write('./', {
			includeContent: false,
			sourceRoot: './'
		}) )
		.pipe( gulp.dest(BUILD + '/Common/css') )
		.pipe( filter("**/*.css") )
		.pipe( reload({stream: true}) );
});

gulp.task('css:min', function() {
	gulp.src(BUILD + '/Common/css/style.css')
		.pipe( csso() )
		.pipe( rename('style.min.css') )
		.pipe( gulp.dest(BUILD + '/Common/css') );
});

// =======================================
// JS 병합 업무
// =======================================
gulp.task('js', ['js:concat']);

gulp.task('js:moveJS', function() {
	gulp.src( moveJS )
		.pipe( gulp.dest( BUILD + '/Common/js') );
});

gulp.task('js:concat', ['js:moveJS'], function() {
	gulp.src( js_order )
		.pipe( concat('bundle.js') )
		.pipe( g_if(compress.js, uglify()) )
		.pipe( g_if(compress.js, rename( 'bundle.min.js' )) )
		.pipe( gulp.dest( BUILD + '/Common/js' ) );
});

// =======================================
// Images min 업무
// =======================================
gulp.task('imagemin', function () {
	return gulp.src( SRC + '/images/**/*' )
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe( gulp.dest( BUILD + '/Common/images' ) );
});

// =======================================
// Iconfont 업무
// =======================================
gulp.task('iconfont', ['iconfont:make']);

gulp.task('iconfont:make', function(cb){
	iconic({
		// 템플릿 파일 경로 설정 (filename)
		// gulp-iconic/template/_iconfont.scss
		cssTemplate: SRC + '/sass/template/_iconfont.scss',
		// Scss 생성 파일 경로 설정
		cssFolder: SRC + '/sass/fonts',
		// Fonts 생성 파일 경로 설정
		fontFolder: SRC + '/iconfont/fonts',
		// SVG 파일 경로 설정
		svgFolder: SRC + '/iconfont/fonts_here',
		// Preview 생성 폴더 경로 설정
		previewFolder: SRC + '/iconfont/preview',
		// font 경로 설정
		fontUrl: '/Common/fonts',
		// 아이콘 베이스라인 위치 설정
		descent: 30
	}, cb);

	setTimeout(function() {
		gulp.start('iconfont:move');
	}, 1000);
});

gulp.task('iconfont:move', function(){
	gulp.src(SRC + '/iconfont/fonts/*')
		.pipe( gulp.dest( BUILD + '/Common/fonts' ) );
});