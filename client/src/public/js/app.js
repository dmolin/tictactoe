define([
    'backbone'
], function( Backbone ) {

	var initialize = function(config) {
		console.log( "app initialize" );
        this.io = config.sio;
        this.socket = this.io.connect( document.location.protocol, '//' + document.location.hostname );
        //this.socket = config.socket;
        //this.socket.connect();
        this.inited = false;

        /*
        Backbone.on('status:connected', function (data) {
            if(!this.inited) {
                //emit inited application signal
                Backbone.trigger("appready");
                Backbone.history.start();
                this.inited = true;
            }
        }, this);
        */
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

	return {
		initialize: initialize
	};
});