var Backbone = require('backbone');

var initialize = function(config) {
    console.log( "app initialize" );
    this.io = config.sio;
    this.socket = this.io.connect( document.location.protocol, '//' + document.location.hostname );
    this.inited = false;

    var self = this;
    this.socket.on("connect", function(data){
        if(!self.inited) {
            //emit inited application signal
            Backbone.trigger("appready");
            Backbone.history.start();
            self.inited = true;
        }
    });

};

module.exports = {
    initialize: initialize
};
