var Game = require('../src/services/TicTacToeService'),
    fs = require('fs');

describe("TicTacToe Game Interface", function () {
    it("Constructor must exist", function () {
        console.log("test");
        expect(Game).toBeDefined();
    });
});
