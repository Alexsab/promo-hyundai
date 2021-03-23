// VARIABLES & PATHS
let preprocessor = 'sass', // Preprocessor (sass, scss, less, styl)
    fileswatch   = 'html,htm,txt,json,md,woff2,php', // List of files extensions for watching & hard reload (comma separated)
    pageversion  = 'html,htm,php', // List of files extensions for watching change version files (comma separated)
    imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
    online       = true, // If «false» - Browsersync will work offline without internet connection
    basename     = require('path').basename(__dirname),
    forProd      = [
					'/**',
					' * @author Alexsab.ru',
					' */',
					''].join('\n');

const { src, dest, parallel, series, watch, task } = require('gulp'),
	sass           = require('gulp-sass'),
	cleancss       = require('gulp-clean-css'),
	concat         = require('gulp-concat'),
	browserSync    = require('browser-sync').create(),
	uglify         = require('gulp-uglify-es').default,
	autoprefixer   = require('gulp-autoprefixer'),
	imagemin       = require('gulp-imagemin'),
	newer          = require('gulp-newer'),
	rsync          = require('gulp-rsync'),
	del            = require('del'),
	connect        = require('gulp-connect-php'),
	header         = require('gulp-header'),
	notify         = require('gulp-notify'),
	rename         = require('gulp-rename'),
	responsive     = require('gulp-responsive'),
	pngquant       = require('imagemin-pngquant'),
	merge          = require('merge-stream'),
	// version        = require('gulp-version-number'),
	// revAll         = require('gulp-rev-all'),
	replace        = require('gulp-replace');

if(typeof projects == 'undefined') 
	global.projects = {};
if(typeof port == 'undefined') 
	global.port = 8100;


projects.promo_hyundai = {

	port: ++port,

	base: basename,
	dest: basename,

	styles: {
		src:    basename + '/' + preprocessor + '/main.'+preprocessor,
		watch:    basename + '/' + preprocessor + '/**/*.'+preprocessor,
		dest:   basename + '/css',
		output: 'styles.min.css',
	},

	scripts: {
		src: [
			basename + '/libs/jquery/dist/jquery.min.js',
			basename + '/libs/Magnific-Popup-master/jquery.magnific-popup.js',
			'node_modules/slick-carousel/slick/slick.js',
			basename + '/libs/range/range.js',
			basename + '/libs/animate/animate-css.js',
			basename + '/libs/jquery.mb.YTPlayer.min.js',
			basename + '/libs/lazyload.min.js',
			basename + '/libs/waypoint.js',
			basename + '/js/map.js',
			basename + '/js/common.js', // Custom scripts. Always at the end
		],
		dest:       basename + '/js',
		output:     'scripts.min.js',
	},

	code: {
		src: [
			basename  + '/**/*.{' + fileswatch + '}',
			'!' + basename + '/cars.json'
		],
	},

	forProd: [
		'/**',
		' * @author https://github.com/newstreetpunk',
		' * @editor https://github.com/alexsab',
		' */',
		''].join('\n'),
}


/* promo_hyundai BEGIN */

// Local Server
function promo_hyundai_browsersync() {
	connect.server({
		port: projects.promo_hyundai.port,
		base: projects.promo_hyundai.base,
	}, function (){
		browserSync.init({
			// server: { baseDir: projects.promo_hyundai.base + '/' },
			proxy: '127.0.0.1:' + projects.promo_hyundai.port,
			notify: false,
			online: online
		});
	});
};

// Custom Styles
function promo_hyundai_styles() {
	return src(projects.promo_hyundai.styles.src)
	.pipe(eval(preprocessor)({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(concat(projects.promo_hyundai.styles.output))
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'] }))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(dest(projects.promo_hyundai.styles.dest))
	.pipe(browserSync.stream())

};

// Scripts & JS Libraries
function promo_hyundai_scripts() {
	return src(projects.promo_hyundai.scripts.src)
	.pipe(concat(projects.promo_hyundai.scripts.output))
	.pipe(uglify()) // Minify js (opt.)
	.pipe(header(projects.promo_hyundai.forProd))
	.pipe(dest(projects.promo_hyundai.scripts.dest))
	.pipe(browserSync.stream())
};

function promo_hyundai_watch() {
	watch(projects.promo_hyundai.styles.watch, promo_hyundai_styles);
	watch(projects.promo_hyundai.scripts.src, promo_hyundai_scripts);

	watch(projects.promo_hyundai.code.src).on('change', browserSync.reload);
};

exports.hyundai_promo = parallel(promo_hyundai_styles, promo_hyundai_scripts, promo_hyundai_browsersync, promo_hyundai_watch);

/* promo_hyundai END */