var _ = require("underscore");
var Backbone = require('backbone');
var $ = require('jquery-browserify');
Backbone.$ = $;
global._ = _;
var App = require('./app');
var Routes = require('./modules/tictactoe/routers/routes');

$(function(){
    App.initialize({sio: io});
    console.log("inited");
});
