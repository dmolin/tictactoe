define([
    'jquery',
    'underscore',
    'backbone',
    'cell.js'
], function( $, _, Backbone, CellModel) {

    var Model = Backbone.Model.extend({
        defaults: {
            id: 0,
            state: 'empty',
            winning: false,
            text: ''
        },

        initialize: function(){
            this.on('change:state', this._setContent, this);
        },

        isEmpty: function() {
            return this.get('state') === 'empty';
        },

        _setContent: function() {
            var state = this.get('state');
            this.set('text', ( state === 'empty' ? '' : state === 'crossed' ? 'X' : 'O' ));
        }
    });

    return Model;
});