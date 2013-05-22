/*global desc, task, jake, fail, complete */
var cconsole = require("colorize").console;

task("default", ["lint", "test"]);

desc("Linkt code");
task("lint", [], function(){
    cconsole.log("#bold[#blue[Linting...]]");
    var lint = require('./build/lint/lint_runner'),
        files,
        opts,
        globals;

    files = new jake.FileList();
    files.include("**/*.js");
    files.exclude(["node_modules", "src/public/js/lib", "r.js", "test"]);

    opts = {
        bitwise: true,
        curly: false,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        regexp: true,
        trailing: true,
        node: true,
        devel: true,
        strict: false,
        sub: true
    };

    globals = {
        describe: false,
        it: false,
        beforeEach: false,
        afterEach: false
    };

    return lint.validateFileList(files.toArray(), opts, globals) || fail("Lint failed");
});

desc("Testing the Client Code");
task("test-client", ["lint"], function() {

    cconsole.log("#bold[#blue[Testing Client...]]");

    //generate spec file in test folder
    //1) use r.js to compile a single JS file out of all source files
    //2) walk through the source tree and collate all the _spec.js files in a single test/spec.js file
    function optimizeJs() {
        var config = {
            name: "js/bootstrap",
            include: [],
            findNestedDependencies: true,
            baseUrl: "src/public/",
            paths: {
                "jquery": 'js/lib/jquery/jquery-1.7.2',
                "underscore": 'js/lib/underscore/loader',
                "backbone": 'js/lib/backbone/loader',
                "text": 'js/lib/require/text',
                "app": 'js/app',
                "socketio": "js/socketio"
            },
            optimize: "none",
            out: "src/public/test/app.js"
        };

        require("requirejs").optimize(config, function(built) {
            //console.log("requirejs done. now generating specs...");
            //buildFiles = built.split("\n").slice(3, -1);
            generateSpecs();

        }, function (error) {
            console.log("Failed to build JS:");
            console.log(error.message);

        });
    }

    function generateSpecs() {
        //console.log("buildFiles", buildFiles);

        require("./build/buildspecs").build(process.cwd() + "/src/public/js/**/*_spec.js","src/public/test/specs.js");
        runTests();
    }

    function runTests() {
        //3) run tests
        sh("phantomjs src/public/test/lib/phantom-runner.js src/public/test/index.html src/public/test", true, function(out) {
            //4) remove generated spec file (test/spec.js)

            //5) exit test suite
            complete();
        });
    }

    optimizeJs();

}, {async: true});

desc("Testing the Server code");
task("test-server", ["lint"], function() {
    cconsole.log("#bold[#blue[Testing Node.js Server...]]");

    sh("jasmine-node spec", true, function(out) {
        complete();
    });
}, {async: true});

desc("Runs the Server");
task("server", [], function() {
    sh("node src/server", true, function(out){
        complete();
    });
}, {async: true});

desc("Test all");
task("test", ["test-server", "test-client"], function() {
});

function sh(command, output, callback) {
    var stdout = "",
        proc;


    proc = jake.createExec(command, {printStdout:false, printStderr:true});
    proc.on("stdout", function(chunk) {
        stdout += chunk;
        process.stdout.write(chunk);
    });
    proc.on("cmdEnd", function() {
        if(callback && typeof callback === "function") {
            callback(stdout);
        }
    });
    proc.run();
}
