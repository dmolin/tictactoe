var Backbone = require('backbone'),
    GameView = require('../views/game');

var Router = Backbone.Router.extend({
    routes: {
        '/': 'enterGame',
        '*actions': 'enterGame'
    },

    enterGame: function() {
        var gameView = new GameView();
        gameView.init();
        gameView.render();
    }
});

module.exports = new Router();