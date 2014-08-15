# TIC TAC TOE Game

Tic Tac Toe is a simple turn-based Web Game where two players play against each other.
Each player tries to win the game checking 3 consecutive cells on the board. Valid rows are horizontal, vertical, diagonal.

The game is still in its infancy, since it was developed in a few hours just for a take home test.
No real server-side logic is implemented yet (beside reading socket messages from the client); The current game logic at the moment is still in the client and will be ported to the server (the Server will receive moves and then decide if a winning move has occurred).

This game (still in early development) serves the purpose of showing how to implemenent simple turn-based realtime games with Backbone, Node.js and Socket.IO.

The only behaviour implemented at the current time is:
- the board rendering logic
- the player "1" (X) behaviour (placing a move)
- the logic to detect if a winning move has been made

![Tic Tac Toe in action](https://raw.github.com/dmolin/tictactoe/master/README/tictactoe.png)

## Technologies Used ##

- jQuery
- Backbone (0.9.10)
- Node.js (for the server)
- Express
- Socket.IO
- Grunt (building tool)


## Compiling and running the game ##

- cd into the client folder and run npm
<code>
cd client && npm install && npm publish
</code>

- cd into the server folder; compile and run the server
<code>
cd server && npm install && npm start
</code>

- start a browser and go to http://localhost:3000
