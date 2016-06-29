'use strict';

var request = require('request');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var reloadPort = 35729, files;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                src: ['test/**/*.js']
            }
        },
        browserify: {
            options: {
                ignore: ['cls-bluebird']
            },
            client: {
                src: ['public/js/*.js'],
                dest: 'public/main.js'
            }
        },
        develop: {
            server: {
                file: 'app/app.js'
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'public/styles/main.css': 'public/styles/main.scss'
                }
            }
        },
        watch: {
            options: {
                nospawn: true,
                livereload: reloadPort
            },
            js: {
                files: [
                    'app.js',
                    'app/**/*.js',
                    'config/*.js',
                    'public/js/*.js'
                ],
                tasks: ['build', 'delayed-livereload']
            },
            css: {
                files: [
                    'public/styles/*.scss'
                ],
                tasks: ['sass'],
                options: {
                    livereload: reloadPort
                }
            },
            views: {
                files: [
                    'views/*.html'
                ],
                options: {livereload: reloadPort}
            }
        }
    });

    grunt.config.requires('watch.js.files');
    files = grunt.config('watch.js.files');
    files = grunt.file.expand(files);

    grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
        var done = this.async();
        setTimeout(function () {
            request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','), function (err, res) {
                var reloaded = !err && res.statusCode === 200;
                if (reloaded)
                    grunt.log.ok('Delayed live reload successful.');
                else
                    grunt.log.error('Unable to make a delayed live reload.');
                done(reloaded);
            });
        }, 500);
    });

    grunt.registerTask('build', [
        'browserify',
        'scss',
        'develop'
    ]);
    grunt.registerTask('default', [
        'build',
        'test',
        'watch'
    ]);

    grunt.registerTask('test', ['mochaTest']);

    grunt.registerTask('scss', ['sass']);

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-mocha-test');
};
