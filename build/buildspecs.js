/*global module: true, require: true, process: true */
exports.build = function (pattern, outputFile) {
    var path = require("path"),
        fs = require("fs"),
        glob = require("glob");

    var checkedPath = {};
    var files = [],
        source = "";

    var moduleFiles = [];

    moduleFiles = glob.sync(pattern);
    console.log("  Found " + moduleFiles.length + " test file(s)");

    moduleFiles.map(function (item) {
        files.push(path.relative(process.cwd(), item));
    });


    // Concatenate Spec sources into string:
    files.forEach(function (file) {
        source += fs.readFileSync(file) + "\n";
    });
    fs.writeFileSync(outputFile, source);

};