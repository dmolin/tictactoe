/*global phantom: true, require: true, clearTimeout: true, setTimeout: true */

var cconsole = require("colorize").console;

/**********************/
/** Helper Functions **/
/**********************/

function waitfor(check, onTestPass, onTimeout, timeoutMs, freqMs) {
    timeoutMs = timeoutMs || 120000; // 2 mins
    freqMs = freqMs || 250;

    var start = Date.now(),
        condition = false,
        timer;

    function timerFactory() {
        timer = setTimeout(function () {
            var elapsedMs = Date.now() - start;
            if ((elapsedMs < timeoutMs) && !condition) {
                // If not time-out yet and condition not yet fulfilled
                condition = check(elapsedMs);
                timerFactory();
            } else {
                clearTimeout(timer); //< house keeping
                if (!condition) {
                    // If condition still not fulfilled (timeout but condition is "false")
                    onTimeout(elapsedMs);
                } else {
                    // Condition fulfilled (timeout and/or condition is "true")
                    onTestPass(elapsedMs);
                }
            }
        }, freqMs);
    }

    timerFactory();
}



/********************/
/** Phantom Loader **/
/********************/

(function (runnerURL, resultsDir) {
    var fs = require("fs"),
        page = require("webpage").create();

    function exit(exitCode) {
        /*
        var file = resultsDir + fs.separator + "screenshot.png";
        page.render(file);
        console.log("");
        console.log("See " + file + " for more");
        */
        phantom.exit(exitCode || 0);
    }

    if (!fs.isDirectory(resultsDir)) {
        fs.makeTree(resultsDir);
    }

    if (!runnerURL || !resultsDir || !fs.isDirectory(resultsDir)) {
        console.log("Usage: phantom-runner.js HTML_RUNNER RESULT_DIR");
        return phantom.exit();
    }

    this.onError = function (msg, trace) {
        var msgStack = ["PHANTOM ERROR: " + msg];
        if (trace) {
            msgStack.push("TRACE:");
            trace.forEach(function (t) {
                msgStack.push(" -> " + (t.file || t.sourceURL) + ": " + t.line + (t["function"] ? " (in function " + t["function"] + ")" : ""));
            });
        }
        console.error(msgStack.join("\n"));
    };

    var elapsed = new Date().getTime();
    page.open(runnerURL, function (status) {

        if (status !== "success") {
            console.log("Could not load \"" + runnerURL + "\". Status: " + status);
            exit(1);
        }

        waitfor(function () {
            return page.evaluate(function () {
                return window.tests.finished;
            });
        }, function () {

            elapsed = new Date().getTime() - elapsed;

            page.onConsoleMessage = function () {
                console.log.apply(console, arguments);
            };
            var results = page.evaluate(parseJasmineJsApiResults);

            console.log("");
            cconsole.log("  " + results.specs + " specs : " +
                                (results.passingSpecs ? "#green[" + results.passingSpecs + " passed]" : "0 passed") +
                                " | " +
                                (results.failingSpecs ? "#red[" + results.failingSpecs + " failed]" : "0 failed") +
                                ". finished in " + elapsed/1000 + "s");
            console.log("");

            /* no need to write out an XML file
            for (var i in results.xml) {
                var file = resultsDir + fs.separator + results.xml[i].xmlfilename;
                fs.write(file, results.xml[i].xmlbody, "w");
            }
            */

            // Return the correct exit status. "0" only if all the tests passed
            exit(results.failing);
        }, function () { // or, once it timesout...
            console.log("Page failed for an unknown reason. Status: " + status);
            exit(1);
        });

    });


}).apply(phantom, phantom.args);

/*********************/
/** Results Parsing **/
/*********************/

function parseJasmineJsApiResults() {

    var suites = window.tests.suites(),
    results = window.tests.results(),
    specs = 0,
    failing = 0,
    passing = 0,
    failingSpecs = 0,
    passingSpecs = 0;

    function dump(obj) {
        var output = '';
        for (property in obj) {
          output += property + ': ' + (obj[property] instanceof Object ? dump(obj[property]) : obj[property]) +'; ';
        }
        console.log(output);
    }

    function processSuite(suite, parents) {
        parents = parents || [];
        var i;
        if (suite.children.length) {
            for (i in suite.children) {
                processSuite(suite.children[i], [].concat(parents).concat([suite]));
            }
        } else {
            processSpec(suite, parents);
        }
    }

    function processSpec(suite, parents) {
        specs++;
        var name = "", i;
        for (i in parents) {
            name += " " + parents[i].name;
        }
        name += " " + suite.name;

        if (results[suite.id].result === "failed") {
            failingSpecs++;
            console.log("");
            console.error("  Failing Spec:" + name);
        } else {
            passingSpecs++;
        }

        for (i in results[suite.id].messages) {
            processTest(results[suite.id].messages[i]);
        }
    }

    function processTest(test) {
        if (!test["passed_"]) {
            failing++;
            if (test.trace && test.trace.stack) {
                console.error("    ", test.trace.stack || "<No stack trace inside Error()>");
            } else {
                console.error("    ", test.message || "<No message inside Error()>");
            }
        } else {
            passing++;
        }
    }

    for (var i in suites) {
        processSuite(suites[i]);
    }

    return {
        failing: failing,
        passing: passing,
        failingSpecs: failingSpecs,
        passingSpecs: passingSpecs,
        specs: specs,
        xml: jasmine.phantomjsXMLReporterResults || []
    };

}