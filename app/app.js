'use strict'

define('app', function (require) {
  var _ = require('underscore');
  var handlebars = require('handlebars');
  var config = require('./config');
  var Player = require('./player');
  var Game = require('./game');

  var that = {};

  that.config = config;
  that.players = [];
  that.games = [];
  that.cache = {};
  that.templates = {};

  var createPlayers = function () {
    _.each(config.players, function (player) {
      that.players.push(new Player(player));
    });
  };

  var buildCache = function () {
    that.cache.$playersContainer = $('#players');
    that.cache.$gamesContainer = $('#games');
  };

  var buildTemplates = function () {
    that.templates.playersTemplate = handlebars['default'].compile(config.playersTemplate);
    that.templates.gamesTemplate = handlebars['default'].compile(config.gamesTemplate);
  };

  var renderPlayers = function () {
    var html = that.templates.playersTemplate(that.players);
    that.cache.$playersContainer.html(html);
  };

//   var calculateGamesCount = function () {

//   };
//   7—8 5
// 9—16  6
// 17—32 7
// 33—64 8
// 65—128  9
// 129—256 10


  var main = function () {
    buildCache();
    buildTemplates();
    createPlayers();

    var tours = _.range(1, config.count + 1);
    _.each(tours, function (tour) {
      var game, home, visitor, players;

      players = _.sortBy(that.players, function (player) { return player.games.length; });

      console.log('tour', tour);
      console.log('players', _.map(players, function (p) {return p.name;}));
      console.log('players games count', _.map(players, function (p) {return p.games.length;}));

      for (var i = 0; i < players.length; i++) {
        home = players[i];
        console.log('searching game for ' + home.name + ' (home)');

        // var searching = true;
        // var j = 0;
        for (var j = 0; j < players.length; j++) {
          visitor = players[j];
          console.log('consider ' + visitor.name + ' (visitor)');

          if (visitor.equals(home)) {
            console.log('visitor is the same as home');
            continue;
          }

          if (visitor.hasGameWithPlayer(home)) {
            console.log('visitor already has a game with home');
            continue;
          }

          if (visitor.getGamesCount() >= tour) {
            console.log('visitor has more games than tour number');
            continue;
          }

          console.log(home.name + ' (home) - vs - ' + visitor.name + ' (visitor)');
          game = new Game(home, visitor);
          that.games.push(game);
          break;
        }
      }
    });

    renderPlayers();
    console.log('-----------------------------');
    var players = _.sortBy(that.players, function (player) { return player.games.length; });
    console.log('players', _.map(players, function (p) {return p.name;}));
    console.log('players games count', _.map(players, function (p) {return p.games.length;}));
  };

  that.main = main;

  return that;
});
