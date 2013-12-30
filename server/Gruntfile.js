/*global module */
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-jasmine-node");

    grunt.initConfig({
        jasmine_node: {
            specNameMatcher: ".spec", // load only specs containing specNameMatcher
            projectRoot: "test",
            requirejs: false,
            forceExit: true,
            jUnit: {
                report: false,
                savePath : "./build/reports/jasmine/",
                useDotNotation: true,
                consolidate: true
            },
            all: ['test/']
        },

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

    });

    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    grunt.registerTask('default', ['jshint','jasmine_node']);

    grunt.registerTask('supervise', function() {
        this.async();
        require('supervisor').run(['src/server.js']);
    });
};

//--- Gruntfile.js:end
