/*global module */
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-contrib-nodeunit");

    grunt.initConfig({
        nodeunit: ['test/**/*.js'],

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

    grunt.registerTask('default', ['jshint','nodeunit']);

    grunt.registerTask('supervise', function() {
        this.async();
        require('supervisor').run(['src/server.js']);
    });
};

//--- Gruntfile.js:end