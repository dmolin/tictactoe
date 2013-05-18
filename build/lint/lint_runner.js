/*jshint node:true */
"use strict";

var jshint = require("jshint").JSHINT;
var fs = require("fs");
var cconsole = require("colorize").console;

exports.validateSource = function(sourceCode, options, globals, description) {
    description = description ? description + " " : "";
    var pass = jshint(sourceCode, options, globals);
    if (pass) {
        cconsole.log("  #green[OK  ] " + description);
    }
    else {
        cconsole.log("  #red[FAIL] " + description);
        jshint.errors.forEach(function (error) {
            console.log(error.line + ": " + error.evidence.trim());
            console.log("   " + error.reason);
        });
    }
    return pass;
};

exports.validateFile = function(filename, options, globals) {
    var sourceCode = fs.readFileSync(filename, "utf8");
    return exports.validateSource(sourceCode, options, globals, filename);
};

exports.validateFileList = function(fileList, options, globals) {
    var pass = true;
    fileList.forEach(function(filename) {
        pass = exports.validateFile(filename, options, globals) && pass;
    });
    return pass;
};