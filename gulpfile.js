var gulp 	= require('gulp'),
	sass 	= require('gulp-sass'),
	concat 	= require('gulp-concat'),
	uglify 	= require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
    rename  = require('gulp-rename'),
    del     = require('del'),
    imagemin  = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant  = require('imagemin-pngquant'),
    cache   = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');


	gulp.task('sass', function(){ // Создаем таск "sass"
		return gulp.src('www/sass/**/*.sass') // Берем источник
			.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
			.pipe(gulp.dest('www/css')) // Выгружаем результата в папку app/css
	});

	gulp.task('scripts', function() {
        return gulp.src([ // Берем все необходимые библиотеки
            'www/libs/jquery/dist/jquery.min.js',
            'www/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
            ])
            .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
            .pipe(uglify()) // Сжимаем JS файл
            .pipe(gulp.dest('www/js')); // Выгружаем в папку app/js
    });

    gulp.task('css-libs', ['sass'], function() {
	    return gulp.src('www/css/libs.css') // Выбираем файл для минификации
	        .pipe(cssnano()) // Сжимаем
	        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
	        .pipe(gulp.dest('www/css')); // Выгружаем в папку app/css
	});

	gulp.task('watch', ['css-libs', 'scripts'], function() {
		gulp.watch('www/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
		gulp.watch('www/*.html'); // Наблюдение за HTML файлами в корне проекта
		gulp.watch('www/js/**/*.js'); // Наблюдение за JS файлами в папке js
	});

	gulp.task('clean', function() {
   		return del.sync('dist'); // Удаляем папку dist перед сборкой
	});

	gulp.task('img', function() {
        return gulp.src('www/img/**/*') // Берем все изображения из app
            .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
                interlaced: true,
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            })))
            .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
    });

	gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

        var buildCss = gulp.src([ // Переносим CSS стили в продакшен
            'www/css/main.css',
            'www/css/libs.min.css',
            'www/css/font-awesome/**/*'
            ])
        .pipe(gulp.dest('dist/css'))

        var buildFonts = gulp.src('www/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'))

        var buildJs = gulp.src('www/js/**/*') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'))

        var buildHtml = gulp.src('www/*.php') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

    });


	gulp.task('clear', function () {
        return cache.clearAll();
    })


	gulp.task('default', ['watch']);



