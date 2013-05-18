define([
    'backbone',
    'js/modules/tictactoe/routers/routes.js'
], function( Backbone, TicTacToeRoutes ) {

	var initialize = function() {
		console.log( "app initialize" );
        Backbone.history.start();
	};

	return {
		initialize: initialize
	};
});