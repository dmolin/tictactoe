var Backbone = require('backbone'),
    $ = Backbone.$,
    _ = require('underscore'),
    Cell = require('./cell'),
    CellModel = require('../models/cell'),
    App = require('../../../app');

var tpl = [
    '<table class="board">',
        '<tbody>',
        '<tr>',
            '<td class="cell0"></td>',
            '<td class="cell1"></td>',
            '<td class="cell2"></td>',
        '</tr>',
        '<tr>',
            '<td class="cell3"></td>',
            '<td class="cell4"></td>',
            '<td class="cell5"></td>',
        '</tr>',
        '<tr>',
            '<td class="cell6"></td>',
            '<td class="cell7"></td>',
            '<td class="cell8"></td>',
        '</tr>',
        '</tbody>',
    '</table>'
].join('');


var View = Backbone.View.extend({
    el: "div",

    initialize: function(options) {
        this.options = options;
        this.player = this.options.player;

        //listen for cell events and delegate to Game service (here implemented locally)
        Backbone.on("cell:ticked", this._checkMove, this);
    },

    render: function() {
        this.$el.html( tpl );

        // render cells
        this.renderCells();
        return this;
    },

    renderCells: function() {
        this.cells = [];
        for(var i = 0; i < 9; i++) {
            var cell = new Cell({el: this.$('.cell' + i), model: new CellModel({id:i})});
            cell.render();
            this.cells.push(cell);
        }
    },

    _checkMove: function(move) {
        var board = this;

        //store the move in player record (we assume the move is always from the only player present, the one with the cross)
        this.player.moves[move.id] = 'X';  //signal the move (eg: { 0: 'X' } means 'X' check in the cell 0)

        //we should delegate to some kind of REST service here, but because it's just a simple example
        //we'll implement the game logic here

        //console.log("APP", App);
        App.socket.emit("board:move", {
            gameId: '1',  //should be received from the server on game access,
            moves: this.player.moves //send all the moves, since the server is stateless
        });

        var winningMoves = [
            [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
        ];

        //check moves against winning ones
        winningMoves.every(function(element, index, list) {
            var matched = 0;
            _.each(element, function(id) {
                if(board.player.moves[id]) {
                    matched++;
                }
            });
            if(matched === element.length) {
                //player won!
                console.log("PLAYER WIN THE GAME!");
                //trigger winning cells
                Backbone.trigger("cells:winning", element);
                return false;
            }
            return true;
        });
    }
});

module.exports = View;
