define([
    'jquery',
    'underscore',
    'backbone',
    '../models/cell.js'
], function( $, _, Backbone, CellModel) {

    var tpl = [
    '<a href="#"><div class="cell {{model.state}} winning-{{model.winning}}">',
    '</div></a>'
    ].join('');

    var template = Handlebars.compile(tpl);

    var View = Backbone.View.extend({
        el: "div",

        events: {
            'click a': 'onCellClick',
            'touchend a': 'onCellClick'
        },

        initialize: function() {
            this.model = this.options.model || new CellModel();

            this.model.on('change', this.render, this);
            Backbone.on("cells:winning", this.checkAgainstWinningCells, this);
        },

        render: function() {
            this.$el.html( template({model: this.model.attributes}) );
            return this;
        },

        onCellClick: _.debounce(function(e) {
            //console.log("CLICK/TOUCH");
            if(e) {
                e.preventDefault();
            }

            if(this.model.get('state') !== 'empty') {
                return;
            }

            //change the state of the cell to cross (the AI drives the circle)
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

    return View;
});