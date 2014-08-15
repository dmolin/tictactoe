/*global module */
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-cafe-mocha");

    grunt.initConfig({
        cafemocha: {
            test: {
                src: "test/*.spec.js",
                options: {
                    ui: 'bdd',
                    reporter: 'spec'
                }
            }
        },

        jshint: {
            files: ['src/**/*.js'],
            options: {
                strict:       false,
                devel:        true,
                node:         true,
                esnext:       true,
                sub:          true,
                smarttabs:    true,
                maxerr:       100,
                predef: [
                    "module",
                    "require",
                    "load",
                    "send",
                    "header",
                    "tash",
                    "define",
                    "describe",
                    "it"
                ],
                globals: { require: false, __dirname: false, console: false, module: false, exports: false }
            }
        },

    });

    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });
    grunt.registerTask('supervise', function() {
        this.async();
        require('supervisor').run(['src/server.js']);
    });
    grunt.registerTask('test', ['cafemocha:test']);

    grunt.registerTask('default', ['jshint','test', 'supervise']);

};

//--- Gruntfile.js:end
