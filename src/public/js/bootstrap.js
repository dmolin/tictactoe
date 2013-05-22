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
		"app": '/js/app',
        "socketio": '/js/socketio'
	}
});

require([
	"jquery",
	"underscore",
	"backbone",
	"app",
    'js/modules/tictactoe/routers/routes.js',
    //"socketio"
], function($, _, Backbone, App, Routes, Socket ) {

	console.log("ready");
	//App.initialize({socket: new Socket({vent: Backbone, io:{port:document.location.port}}).socket});
    App.initialize({sio: io});
});