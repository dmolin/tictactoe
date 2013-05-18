define([
    'jquery',
    'underscore',
    'backbone',
    './board.js'
//  'text!./templates/search.html'
], function( $, _, Backbone, BoardView ) {

    var tpl = [
    '<div id="tictactoe">',
        '<h1>Circle And Cross Game</h1>',
        '<div id="board"></div>',
    '</div>'
    ].join('');


    var View = Backbone.View.extend({
        el: $('#application')[0],

        init: function() {
            //setup a new player
            this.player = { moves:{} };
        },

        render: function() {
            this.$el.html( tpl );

            this.renderSubViews();
            return this;
        },

        renderSubViews: function() {
            this.boardView = new BoardView({player: this.player, el:this.$('#board')[0]});
            this.boardView.render();
        }
    });

    return new View();
});