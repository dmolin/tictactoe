/*jshint devel:true, node:true, strict:false */
/*global require */

/**
 * Requirements:
 *
 * This Server must provide the following services:
 *
 * - ADMIN SERVICES -
 * RA1 : List of Games (if player token is received, will flag games where player is enrolled)
 * RA2 : Creation of a Game (will send an admin token ID to the client)
 * RA21: the creator of a Game can choose to enroll as a player in the game (will also receive the player token ID)
 * RA3 : Removal of a Game (only available to the creator of the Game)
 *       Handle scenario when other player try to enter a deleted game
 *       (when connecting, the server must notify the user and remove its token from the client)
 *
 * - GAME SERVICES -
 * RG1 : Enrollment into a Game (will send a player token ID to the client - saved in local storage -)
 * RG2 : Receive move [REAL TIME] (along with player token and game ID)
 * RG21: Broadcast move to other player in the same Game [REAL TIME]
 * RG3 : Unenrollment from a Game (removal of player token)
 * RG4 : Get Global Roster
 * RG5 : broadcast games winners and their actual score (async growl style notifications to all players)
 *
 * - OTHER REQUIREMENTS -
 * - each move scores 1 pt
 * - a winning game scores 20pt
 * - winning 3 games in a row scores an additional 50pt bonus
 *
 * - FUTURE EVOLUTIONS -
 * - creation of Game Rooms, where a Game Room contains a list of Games (could be a Game Node Server)
 * - multi dimensional TicTacToe. 3 overlapping boards: a winning streak can be on one single board of span the 3 boards in a 3D fashion
 *   (see: http://www.sciencenews.org/view/download/id/50546/name/Tic-tac-toe_many_times_over)
 */

var express = require('express'),
    path = require('path'),
    http = require("http"),
	app = express(),
    server;

var sio = require('socket.io');
var io, iosetting;

app.configure(function() {
	app.use(express.logger('dev')); //default, short, tiny, dev
	app.use(express.bodyParser());
    app.use(express['static'](path.join(__dirname, '../../client/dist/')));
});

server = http.createServer(app);
io = sio.listen(server);
for (iosetting in app.settings.socketIO) {
    if (app.settings.socketIO.hasOwnProperty(iosetting)) {
        io.set(iosetting, app.settings.socketIO[iosetting]);
    }
}
io.on('connection', onSIOConnect);

function onSIOConnect (socket) {
    socket.emit("connected", {});
    console.log("Receiving connection from client ", socket.id);
    //handle client messages (if any)

    //each client will send a message with the move of the player
    socket.on("board:move", function(move){
        console.log("MOVE", move);
    });
    //we broadcast to the other connected client
}


//for the sake of simplicity, let's have an exported global scope named "data",
//that will be used as an in-memory scope for the running application
var scope = {};
require('./routes/game').init(app,scope);

if (!module.parent) {
    var port = process.env.PORT || 3000;
    server.listen(port, '127.0.0.1');
    console.log("TicTacToe server listening on port %d within %s environment", port, app.settings.env);
}

//console.log('Server running at http://127.0.0.1:3000/');
