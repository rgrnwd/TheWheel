var gulp = require('gulp'),
    server = require('gulp-develop-server');


gulp.task('default', function () {
    server.listen({path: './serverDev.js'});
});