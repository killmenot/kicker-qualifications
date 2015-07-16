'use strict'

define('player', function (require) {
  var _ = require('underscore');

  function Player(name) {
    this.name = name;
    this.games = [];
  }

  Player.prototype.addGame = function (game) {
    this.games.push(game);
  };

  Player.prototype.equals = function (player) {
    return this.name === player.name;
  };

  Player.prototype.getGamesCount = function () {
    return this.games.length;
  };

  Player.prototype.hasGameWithPlayer = function (player) {
    var playerNames = _.chain(this.games)
      .map(function (game) {
        return [game.home.name, game.visitor.name];
      })
      .flatten()
      .without(this.name)
      .value();

    return !!_.find(playerNames, function (playerName) { return playerName === player.name; });
    
  };

  return Player;
});
