var Backbone = require('Backbone'),
    $ = Backbone.$,
    _ = require('underscore'),
    CellModel = require('../models/cell');

var tpl = [
'<div class="cell <%= model.state %> winning-<%= model.winning %>">',
    '<a href="#"><%= model.text %></a>',
'</div>'
].join('');

var template = _.template(tpl);

var View = Backbone.View.extend({
    el: "div",

    events: {
        'click a': 'onCellClick',
        'touchend a': 'onCellClick'
    },

    initialize: function(options) {
        this.options = options;
        this.model = this.options.model || new CellModel();

        this.model.on('change', this.render, this);
        Backbone.on("cells:winning", this.checkAgainstWinningCells, this);
    },

    render: function() {
        this.$el.html( template({model: this.model.attributes}) );
        return this;
    },

    onCellClick: _.debounce(function(e) {
        if(e) {
            e.preventDefault();
        }

        if(this.model.get('state') !== 'empty') {
            return;
        }

        //change the state of the cell
        this.model.set('state', 'crossed');
        this.$('a').removeAttr('href');

        //publish crossed event
        Backbone.trigger("cell:ticked", {id: this.model.id, state: this.model.get('state')});
    }, 20),

    checkAgainstWinningCells: function(winning) {
        if(winning.indexOf(this.model.id) >= 0) {
            this.model.set('winning', true);
        }
    }

});

module.exports = View;
