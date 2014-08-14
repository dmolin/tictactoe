var Game = require('../src/services/TicTacToeService'),
    expect = require("chai").expect,
    fs = require('fs');

describe("TicTacToe Game Interface", function () {
    it("Constructor must exist", function () {
        expect(Game).to.be.defined;
    });
});
