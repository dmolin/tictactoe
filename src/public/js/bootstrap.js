require.config( {
	//urlArgs: "bust=" + (new Date()).getTime(),  //cache busting for development
	shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    },
	paths: {
		"jquery": '/js/lib/jquery/jquery-1.7.2',
		"underscore": '/js/lib/underscore/loader',
		"backbone": '/js/lib/backbone/loader',
		"text": '/js/lib/require/text',
		"templates": '/templates',
		"app": '/js/app'
	}
});

require([
	"jquery",
	"underscore",
	"backbone",
	"app"
], function( $, _, Backbone, App ) {

	console.log("ready");
	App.initialize();
});