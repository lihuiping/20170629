var fs = require('fs');
//var path = require('path');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var rev = require('gulp-rev');
var revCollector = require("gulp-rev-collector");
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');
var gulpSequence = require('gulp-sequence').use(gulp);
var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');
var postcss = require('gulp-postcss');
var fileinclude = require('gulp-file-include');
var uncss = require('gulp-uncss');
var uglify = require('gulp-uglify');
var $ = gulpLoadPlugins();
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

livereload({
	start: true,
	auto: false
});

//配置路径
var baseUrl = './src/';
var destUrl = './';
var tinypngApi = 'm66cergQwJ-L96d3X1QhVs-mQs8WzrPm';
var config = {
	file: {
		css: baseUrl + 'assets/css/*.css',
		scss: baseUrl + 'assets/sass/**/*.scss',
		images: baseUrl + 'assets/images/**/*.{png,jpg,gif}',
		js: baseUrl + 'assets/js/*.js',
		html: baseUrl + 'static/*.html',
		htmlfile: baseUrl + '*.html',
		tpl: baseUrl + 'tpl/*.tpl'
	},
	folder: {
		css: baseUrl + 'assets/css/**/*',
		images: baseUrl + 'assets/images/**/*',
		font: baseUrl + 'assets/fonts/**/*',
		data: baseUrl + 'assets/data/**/*',
		scss: baseUrl + 'assets/sass/**/*',
		lib: baseUrl + 'lib/**/*',
		sprites: baseUrl + 'assets/sass/sprites',
		js: baseUrl + 'assets/js',
		html: baseUrl

	},
	dest: {
		css: destUrl + 'assets/css',
		images: destUrl + 'assets/images',
		scss: destUrl + 'assets/sass',
		font: destUrl + 'assets/fonts',
		data: destUrl + 'assets/data',
		sprites: destUrl + 'assets/sass/sprites',
		js: destUrl + 'assets/js',
		htmlfile: destUrl + '*.html',
		html: destUrl,
		lib: destUrl + 'lib',
		rev: destUrl + 'rev'
	}
};

//postcss依赖插件
var processors = [
	autoprefixer,
	cssnano
];
//清除文件
gulp.task('clean', function() {
	//	return gulp.src([config.dest.htmlfile, config.dest.css])
	return gulp.src([destUrl + 'assets', destUrl + '*.html', config.dest.rev])
		.pipe($.clean())
		.pipe($.clean());
});

//制作精灵图
gulp.task('sprites', function() {
	//2倍图
	// var spriteData = gulp.src('./dev/assets/images/icons/*.png')
	//     .pipe($.spritesmith({
	//         retinaSrcFilter: './dev/assets/images/icons/*@2x.png',
	//         retinaImgName: '../images/sprite@2x.png',
	//         imgName: 'sprite.png',
	//         imgPath: '../images/sprite.png',
	//         cssName: '_icons-sprites.scss',
	//         //cssFormat: 'scss',
	//         //cssSpritesheetName :'icons-',
	//         padding: 20,
	//         algorithm: '', //图像排序算法：top-down,left-right,diagonal,alt-diagonal,binary-tree
	//     }));

	// var imgStream = spriteData.img
	//     .pipe(buffer())
	//     .pipe(gulp.dest(config.folder.images));

	// var cssStream = spriteData.css
	//     .pipe(gulp.dest(config.folder.sprites));

	//生成多个精灵图
	var spirteFile = gulp.src(baseUrl + 'assets/images/icons/*.png')
		.pipe($.spritesmith({
			cssOpts: {
				cssSelector: function(item) {
					// If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
					if(item.name.indexOf('-hover') !== -1) {
						return '.icons-' + item.name.replace('-hover', ':hover');
						// Otherwise, use the name as the selector (e.g. 'home' -> 'home')
					} else {
						return '.icons-' + item.name;
					}
				}
			},
			imgName: 'sprite.png',
			imgPath: '../images/sprite.png',
			cssName: '_icons.scss',
			cssFormat: 'css',
			//cssSpritesheetName: 'foods', //变量名称
			padding: 50,
			algorithm: 'top-down', //top-down,left-right,diagonal,alt-diagonal,binary-tree
		}));

	var imgSprite = spirteFile.img
		.pipe(buffer())
		.pipe(gulp.dest(config.folder.images))
		.pipe($.notify({
			title: '<%= file.relative %>',
			message: '<%= file.relative %> 合成精灵图成功'
		}));

	var cssSprite = spirteFile.css
		.pipe(gulp.dest(config.folder.sprites))
		.pipe($.notify({
			title: '<%= file.relative %>',
			message: '<%= file.relative %> 合成精灵图成功'
		}));

	return merge([imgSprite, cssSprite]);
});

//本地开发时sass编译
gulp.task('sass', function() {

	return gulp.src(config.file.scss)

		.pipe($.sourcemaps.init({
			loadMaps: true
		}))
		.pipe($.sass({
			outputStyle: 'compressed' //生成压缩后的CSS
		}).on('error', $.sass.logError))
		//		.pipe($.autoprefixer({
		//			browsers: ['last 5 versions', 'Android >= 4.0', 'Firefox >= 20'],
		//			cascade: true
		//		}))
		.pipe(postcss(processors)) //postcss任务
		.pipe($.sourcemaps.write('./')) //生成sourcemap
		//		.pipe(gulp.dest(config.folder.css))
		.pipe(gulp.dest(config.dest.css))
		.pipe(livereload())
		.pipe($.notify({
			title: '<%= file.relative %>',
			message: 'Sass <%= file.relative %> 发布成功'
		}));
});

//发布上线时sass编译
gulp.task('relsass', function() {

	return gulp.src(config.file.scss)

		.pipe($.sourcemaps.init({
			loadMaps: true
		}))
		.pipe($.sass({
			outputStyle: 'compressed' //生成压缩后的CSS
		}).on('error', $.sass.logError))
		//		.pipe($.autoprefixer({
		//			browsers: ['last 5 versions', 'Android >= 4.0', 'Firefox >= 20'],
		//			cascade: true
		//		}))
		.pipe(postcss(processors)) //postcss任务
		.pipe($.sourcemaps.write('./')) //生成sourcemap
		//		.pipe(gulp.dest(config.folder.css))
		.pipe(rev()) //给css加版本号
		.pipe(gulp.dest(config.dest.css))
		.pipe(rev.manifest()) //生成一个rev-manifest.json
		.pipe(gulp.dest(config.dest.rev + '/sass/')) //将 rev-manifest.json 保存到 rev 目录内
		.pipe(livereload())
		.pipe($.notify({
			title: '<%= file.relative %>',
			message: 'Sass <%= file.relative %> 发布成功'
		}));
});

//压缩排序优化CSS
gulp.task('minicss', function() {
	return gulp.src([baseUrl + 'lib/light7/css/light7.min.css', baseUrl + 'lib/swiper/css/swiper.min.css'])
		.pipe(postcss(processors))
		//		.pipe(gulp.dest(config.folder.css))
		.pipe(gulp.dest(config.dest.css))
		.pipe($.notify({
			title: '<%= file.relative %>',
			message: '<%= file.relative %> 美化压缩CSS成功'
		}));
});

//删除无用CSS
gulp.task('uncss', ['sass', 'fileinclude'], function() {
	return gulp.src([baseUrl + 'lib/swiper/css/swiper.min.css'])
		.pipe(uncss({
			html: [baseUrl + '*.html', baseUrl + 'static/*.html'],
			ignore: [
				'.swiper-pagination-bullets',
				'.swiper-pagination-bullet .swiper-pagination-bullet-active',
				'.icon-video-active',
				'.icon-user-active',
				'.icon-mall-active',
				'.icon-ticket-active',
				'.icon-find-active',
				'.icon-video',
				'.icon-user',
				'.icon-mall',
				'.icon-ticket',
				'.icon-find',
				'/nth-child/',
			]
		}))
		//		.pipe(gulp.dest(config.folder.css))
		.pipe(gulp.dest(config.dest.css))
		.pipe($.notify({
			title: '<%= file.relative %>',
			message: '<%= file.relative %> Uncss 发布成功'
		}));
});

//tinypng图片压缩
gulp.task('tinypng', function() {
	return gulp.src(config.file.images)
		.pipe($.cache($.tinypng(tinypngApi)))
		//		.pipe(gulp.dest(config.folder.images))
		.pipe(gulp.dest(config.folder.images))
		.pipe($.notify({
			title: '<%= file.relative %>',
			message: '<%= file.relative %> 图片压缩发布成功'
		}));
});

//压缩 JS文件，发布时候使用
gulp.task('miniJs', function() {
	gulp.src(config.file.js)
		.pipe($.changed(config.dest.js))
		.pipe(uglify({
			//			   mangle: true,//类型：Boolean 默认：true 是否修改变量名
			//          compress: true,//类型：Boolean 默认：true 是否完全压缩
			//          preserveComments: 'all' //保留所有注释
		}))
		.pipe(rev()) //MD5
		.pipe(gulp.dest(config.dest.js))
		.pipe(rev.manifest()) //生成一个rev-manifest.json
		.pipe(gulp.dest(config.dest.rev + '/js/')) //将 rev-manifest.json 保存到 rev 目录内
		.pipe($.notify({
			message: 'JS 压缩成功'
		}));
});

//复制JS
gulp.task('copypubJs', function() {
	gulp.src(config.file.js)
		.pipe($.changed(config.dest.js))
		.pipe(gulp.dest(config.dest.js))
		.pipe($.notify({
			message: 'JS 发布成功'
		}));
});

//拷贝第三方库
gulp.task('copyJs', function() {
	return gulp.src([baseUrl + 'lib/**/*'])

		.pipe(gulp.dest(config.dest.lib))

		.pipe($.notify({
			message: '第三方库拷贝成功'
		}));
});

//开发时拷贝图片
gulp.task('copyImg', function() {
	return gulp.src(config.file.images)
		.pipe(gulp.dest(config.dest.images))
});

//发布上线时拷贝图片
gulp.task('relcopyImg', function() {
	return gulp.src(config.file.images)
		.pipe(rev()) //MD5
		.pipe(gulp.dest(config.dest.images))
		.pipe(rev.manifest()) //生成一个rev-manifest.json
		.pipe(gulp.dest(config.dest.rev + '/images/')) //将 rev-manifest.json 保存到 rev 目录内
});

//拷贝数据文件
gulp.task('copyData', function() {
	return gulp.src(config.folder.data)
		.pipe(gulp.dest(config.dest.data))

});

//拷贝字体文件
gulp.task('copyFont', function() {
	return gulp.src(config.folder.font)

		.pipe(gulp.dest(config.dest.font))

});

//发布上线编译HTML,并压缩
gulp.task('fileinclude', function() {
	return gulp.src([config.file.html])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe($.htmlmin({
			removeComments: true, //清除HTML注释
			collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
			removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
			collapseWhitespace: true, //压缩HTML
			minifyJS: true, //压缩页面JS
			minifyCSS: true //压缩页面CSS

		}))
		//		.pipe(gulp.dest(config.folder.html))
		.pipe($.changed(destUrl))
		.pipe(gulp.dest(destUrl))
		.pipe(livereload());

});

//本地调试编译HTML，不做压缩
gulp.task('compileHtml', function() {
	return gulp.src([config.file.html])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe($.changed(destUrl))
		.pipe(gulp.dest(destUrl))
		.pipe(livereload());

});

//替换有版本号的文件
gulp.task('rev', ['relsass', 'fileinclude'], function() {
	gulp.src([destUrl+'rev/**/*.json', config.dest.htmlfile, config.dest.css]) //- 读取 rev-manifest.json 文件以及需要进行替换的文件
		.pipe(revCollector()) //- 执行文件内替换
		.pipe(gulp.dest(destUrl)); //- 替换后的文件输出的目录
});

// webserver
gulp.task('webserver', function() {
	return gulp.src(baseUrl) // 服务器目录（./代表根目录）
		.pipe(webserver({ // 运行gulp-webserver
			host: 'localhost',
			port: 8000, //端口，默认8000
			livereload: true, // 启用LiveReload
			open: true, // 服务器启动时自动打开网页
			directoryListing: {
				enable: true,
				path: destUrl + 'index.html'
			},
			fallback: destUrl + 'index.html'
		}))
		.pipe($.notify({
			message: 'Webserver 启动成功'
		}));
});

// 监听
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch([config.file.scss, baseUrl + "assets/sass/*.scss"], ['sass']);
	gulp.watch([config.file.js], ['copypubJs']);
	gulp.watch([config.file.html, config.file.tpl], ['fileinclude', 'uncss']);

});

// 本地调试
gulp.task('default', gulpSequence(['clean'], 'sass', ['copypubJs', 'copyData', 'copyImg', 'copyFont'], 'minicss', 'compileHtml', 'watch'));

//发布上线
gulp.task('rel', gulpSequence(['clean'], 'relsass', ['miniJs', 'copyData', 'relcopyImg', 'copyFont'], 'minicss', 'fileinclude', ['rev'], 'watch'));