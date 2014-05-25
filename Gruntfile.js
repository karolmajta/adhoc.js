module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            source: {
                files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
                tasks: ['jshint:all', 'karma:unit:run', 'copy']
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
        },
        copy: {
            exampleLibs: {
                files: [
                    {'examples/libs/require.js': ['bower_components/requirejs/require.js']},
                    {'examples/libs/q.js': ['bower_components/q/q.js']},
                    {'examples/libs/request.js': ['bower_components/browser-request/dist/browser/request.js']},
                    {'examples/libs/underscore.js': ['bower_components/underscore/underscore.js']},
                    {'examples/libs/uuid.js': ['bower_components/uuid-js/lib/uuid.js']},
                    {
                        cwd: 'src/',
                        expand: 'true',
                        flatten: 'false',
                        dest: 'examples/js/',
                        src: ['**']
                    }
                ]
            },
            dist: {
                files: [
                    {'dist/adhoc.worker.js': ['src/adhoc.worker.js']}
                ]
            }
        },
        concat: {
            dist: {
                src: ['src/adhoc.js', 'src/*.js', '!adhoc.worker.js'],
                dest: 'dist/adhoc.js'
            }
        },
        'http-server': {
            dev: {
                root: "examples/",
                port: 8282,
                host: "127.0.0.1",
                cache: 0,
                showDir: true,
                autoIndex: true,
                defaultExt: "html",
                runInBackground: true
            }
        },
        karma: {
            unit: {
                background: true,
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['copy', 'http-server:dev', 'karma:unit:start', 'watch']);
};
