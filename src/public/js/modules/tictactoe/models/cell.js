define([
    'jquery',
    'underscore',
    'backbone',
    '../models/cell.js'
], function( $, _, Backbone, CellModel) {

    var Model = Backbone.Model.extend({
        defaults: {
            id: 0,
            state: 'empty',
            winning: false
        },

        isEmpty: function() {
            return this.get('state') === 'empty';
        }
    });

    return Model;
});