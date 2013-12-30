var Backbone = require('Backbone'),
    $ = Backbone.$,
    _ = require('underscore'),
    BoardView = require('./board');

var tpl = [
'<div id="tictactoe">',
    '<h1>Tic Tac Toe</h1>',
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

module.exports = View;
