const { UserInterface } = require('@config');
const Game = require('./config/game/index');
const Events = require('events');

const ui = new UserInterface('The Game');
const game = new Game(ui);

game.start();