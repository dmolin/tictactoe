define( [
    'backbone',
    '../views/game.js'
    ],
    //function($, _, Backbone, search ) {
    function( Backbone, gameView ) {
        var Router = Backbone.Router.extend( {
            routes: {
                '/': 'enterGame',
                '*actions': 'enterGame'
            },

            enterGame: function() {
                gameView.init();
                gameView.render();
            }
        });

        return new Router();
    }
);