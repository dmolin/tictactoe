require.config( {
    urlArgs: "bust=" + (new Date()).getTime(),  //cache busting for development
    paths: {
        "jquery": 'lib/jquery/jquery-1.7.2',
        "_": '/js/lib/underscore/loader',
        "backbone": '/js/lib/backbone/loader',
        "text": '/js/lib/require/text',
        "templates": '/templates',
        "app": '/js/app'
    }
});

define([
    "jquery"
], function($) {
    console.log("jQuery is " + ($ ? "defined" : "undefined"));
});