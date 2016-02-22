var gulp = require('gulp');

var glob = require('glob-array');
var tslint = require('gulp-tslint');
var ts     = require('gulp-typescript');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var debug  = require('gulp-debug');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var server = require('gulp-develop-server');
var jade = require('gulp-jade');

// Adds sourcemap info
var DEBUG = {
    client: true,
    vendor: false // Increases size by A LOT. Only enable if actually wanted. Phase+Angular was 6MB.
}

// Libs to put in vendor instead of client bundle.
var clientDeps = [
    'angular',
    'angular-ui-router',
    'phaser'
];


// Typescript settings
var clientJadeGlob = ['client/**/*.jade'];
var clientJSGlob = ['client/**/*.js', '!client/index*.js', '!client/vendor*.js'];
var clientTSGlob = ['client/**/*.ts', '!client/typings{,/**}'];
var sharedTSGlob = ['shared/**/*.ts', '!shared/typings{,/**}'];
var serverTSGlob = ['server/**/*.ts', '!server/typings{,/**}'];

var tsClientProject = {
    module: 'commonjs',
    noImplicitAny: true,
    target: 'ES5',
    baseUrl: '.'
};

var tsSharedProject = {
    module: 'commonjs',
    noImplicitAny: true,
    target: 'ES5'
};

var tsServerProject = {
    module: 'commonjs',
    noImplicitAny: true,
    target: 'ES5'
};

process.once('SIGINT', function () {
    process.exit(0);
});

function lint(src) {
    return src
        .pipe(tslint())
        .pipe(tslint.report('default'));
}

// Lint
gulp.task('lint', ['lint:client', 'lint:server']);

// Lint client
gulp.task('lint:client', function () {
    return lint(gulp.src(clientTSGlob));
});

// Lint shared
gulp.task('lint:shared', function () {
    return lint(gulp.src(sharedTSGlob));
});

// Lint server
gulp.task('lint:server', function () {
    return lint(gulp.src(serverTSGlob));
});

// Compile
gulp.task('compile', ['compile:jade', 'compile:client', 'compile:shared', 'compile:server']);

// Compile client
gulp.task('compile:client', ['lint:client'], function () {
    return gulp.src(clientTSGlob)
        .pipe(sourcemaps.init())
        .pipe(ts(tsClientProject))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('client'));
});

// Compile shared
gulp.task('compile:shared', ['lint:shared'], function () {
    return gulp.src(sharedTSGlob)
        .pipe(ts(tsSharedProject))
        .pipe(gulp.dest('shared'));
});

// Compile server
gulp.task('compile:server', ['compile:shared', 'lint:server'], function () {
    return gulp.src(serverTSGlob)
        .pipe(ts(tsServerProject))
        .pipe(gulp.dest('server'));
});

// Compile jade
gulp.task('compile:jade', function () {
    return gulp.src(clientJadeGlob)
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('client'));
});

// Browserify
gulp.task('browserify:client', ['compile:client', 'compile:shared'], function () {
    return browserify(glob.sync(clientJSGlob), {
            debug: DEBUG.client,
        })
        .external(clientDeps)
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('client'));
});

// Bundle vendor
gulp.task('browserify:vendor', function () {
    return browserify({
            debug: DEBUG.vendor,
            require: clientDeps
        })
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('client'));
});

// Minify
gulp.task('minify', ['browserify:client'], function () {
    return;
    return gulp.src('index.js')
        .pipe(rename('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('client'));
});

// Watch files for changes
gulp.task('watch:jade', function () {
    gulp.watch(clientJadeGlob, ['compile:jade']);
});

gulp.task('watch:client', function () {
    gulp.watch(clientTSGlob, ['minify']);
});

gulp.task('watch:shared', function () {
    gulp.watch(sharedTSGlob, ['compile:shared']);
});

gulp.task('watch:server', function () {
    gulp.watch(serverTSGlob, ['compile:server', 'server:restart']);
});

// Start server
gulp.task('serve', ['watch'], function () {
    server.listen({
        path: './index.js'
    });
});

gulp.task('server:restart', ['compile:server'], function () {
    server.restart();
});

// Watch
gulp.task('watch', ['default', 'watch:jade', 'watch:client', 'watch:shared', 'watch:server']);

// Default
gulp.task('default', ['compile', 'browserify:vendor', 'minify']);
