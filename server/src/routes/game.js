/*jshint devel:true, undef:true, latedef:false*/
/*global require:true exports:true */

var Game = require('../services/TicTacToeService');

//this will be used to access the application-wide in-memory scope
var scope;

exports.init = function (app, data) {
    scope = data ? data : {game:{}};
    if(!scope.game) {
        scope.game = {};
    }

    //app.post('/anagram/init/:masterword', initMasterword);
    //app.get('/anagram/highscores', findHighscores );
    //app.get('/anagram/highscores/:index', findHighscoreByIndex );
    //app.post('/anagram/check/:word', checkWord);
    //app.get('/anagram/config', getGameConfig);
    return this;
};