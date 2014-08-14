/*global module */
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.initConfig({
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        banner: '',
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                strict:       false,
                devel:        true,
                node:         true,
                esnext:       true,
                sub:          true,
                maxerr:       100,
                predef: [
                    "module",
                    "require",
                    "load",
                    "send",
                    "header",
                    "tash",
                    "define"
                ],
                globals: { require: false, __dirname: false, console: false, module: false, exports: false }
            }
        },

        src: {
            js: ['src/**/*.js'],
            //jsTpl: ['<%= distdir %>/templates/**/*.js'],
            specs: ['test/**/*.spec.js'],
            html: ['src/index.html']
        },

        clean: ['<%= distdir %>/*'],

        copy: {
            assets: {
                files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/static/' }]
            }
        },

        concat:{
            index: {
                src: ['src/index.html'],
                dest: '<%= distdir %>/index.html',
                options: {
                    process: true
                }
            }
        },

        browserify: {
            dist: {
                files: {
                    'dist/app.js': ['src/app/**/*.js']
                }
            },
            options: {
				/*
                shim: {
                    "Backbone": "./vendor/backbone/backbone.js"
                }
				*/
            }
        },

        watch: {
            files: ["src/app/**/*.js"],
            tasks: ['browserify:dist']
        }
    });

    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    grunt.registerTask('default', ['jshint','build']);
    grunt.registerTask('build', ['clean','jshint','concat','copy:assets', 'browserify']);
};

//--- Gruntfile.js:end
