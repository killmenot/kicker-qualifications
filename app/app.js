'use strict'

define('app', function (require) {
  var _ = require('underscore');
  var handlebars = require('handlebars');
  var moment = require('moment');

  require('moment-duration-format');

  var config = require('./config');
  var Player = require('./player');
  var Game = require('./game');
  var Slot = require('./slot');

  // move to utils
  var logger = require('./logger');

  var that = {};

  that.config = config;
  that.players = [];
  that.games = [];
  that.cache = {};
  that.templates = {};
  that.tours = [];
  that.slots = [];

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

    handlebars['default'].registerHelper('printPlayerGameInfo', function (player, game) {
      return new handlebars['default'].SafeString('<li>' + game.format(player) + '</li>');
    });

    handlebars['default'].registerHelper('printGameInfo', function (tour, games) {
      var ret = '';

      ret += '<h3>Tour #' + tour + '</h3>';

      ret += '<ul>';
      games.forEach(function (game) {
        ret += '<li>' + game.format() + '</li>';
      });
      ret += '</ul>';

      return new handlebars['default'].SafeString('<li>' + ret + '</li>');
    });
  };

  var renderPlayers = function () {
    var html = that.templates.playersTemplate(that.players);
    that.cache.$playersContainer.html(html);
  };

  var renderGames = function () {
    var games = _.groupBy(that.games, function (game) { return game.tour; });
    var html = that.templates.gamesTemplate(games);
    that.cache.$gamesContainer.html(html);
  };

  var process = function (tours, _players) {
    _.each(tours, function (tour) {
      var game,
          home,
          visitor,
          // players sorted by games count ascending (0,1,2..)
          players,
          // players who are playing in the current tour
          participants = [];

      // Sort players by games count, players having less games in the beginning
      players = _.sortBy(_players, function (player) { return player.games.length; });

      logger.log('info', 'application', 'Tour #', tour);
      logger.log('info', 'application', 'Players: ', _.map(players,
        function (player) {
          return player.name + ' (' + player.games.length  + ')';
        })
      );

      that.tours.push(tour);

      // Calculating games between players
      for (var i = 0; i < players.length; i++) {
        home = players[i];

        // The home player cannot play more games than the current tour number
        if (home.getGamesCount() >= tour) {
          console.log(home.name + ' (home) has more games than tour number');
          continue;
        }

        // The home already has the game in this tour
        if (_.contains(participants, home.name)) {
          console.log('home already has a game in this tour');
          continue;
        }

        console.log('searching game for ' + home.name + ' (home)');

        for (var j = players.length - 1; j >= 0; j--) {
          visitor = players[j];
          console.log('consider ' + visitor.name + ' (visitor)');

          // The player can play only with another player
          if (visitor.equals(home)) {
            console.log('visitor is the same as home');
            continue;
          }

          // The visitor already has the game in this tour
          if (_.contains(participants, visitor.name)) {
            console.log('visitor already has a game in this tour');
            continue;
          }

          // The home player already has a game with the visitor player
          if (visitor.hasGameWithPlayer(home)) {
            console.log('visitor already has a game with home');
            continue;
          }

          // The visitor player cannot play more games than the current tour number
          if (visitor.getGamesCount() >= tour) {
            console.log('visitor has more games than tour number');
            continue;
          }

          // Seems all is fine, make a new game
          console.log(home.name + ' (home) - vs - ' + visitor.name + ' (visitor)');
          // mark both users are participants of the tour
          participants.push(home.name, visitor.name);

          game = new Game(home, visitor);
          game.setNumber(that.games.length + 1);
          game.setTour(tour);

          that.games.push(game);
          break;
        }
      }
    });
  };

  var processExtraTours = function () {
    var players = _.filter(that.players, function (player) { return player.games.length < config.count; });
    
    if (players.length > 0) {
      logger.log('info', 'application', 'Extra tour needed');
      logger.log('info', 'application', 'Players: ', _.map(players,
        function (player) {
          var others = _.reject(players, function (p) { return player.name === p.name; });
          others.forEach(function (another) {
            var result = player.hasGameWithPlayer(another);
            if (!result) {
              console.log(player.name + ' vs. ' + another.name + ' -> ' + result);
            }
          });
          return player.name + ' (' + player.games.length  + ')';
        })
      );
      process([config.count + 1], players);
    }
  };

  var createSlots = function () {
    var slot,
      start = config.startTime - config.gameLength;

    that.games.forEach(function (game, n) {
      if (n % config.tablesCount === 0) {
        start += config.gameLength;
      }

      slot = new Slot();
      slot.setTableNumber(n % config.tablesCount + 1);
      slot.setTime(moment.duration(start, 'seconds').format("h:mm"));

      that.slots.push(slot);
    });
  };

  var assignSlots = function () {
    var shuffledGames = [];
    that.tours.forEach(function (tour) {
      var games = _.filter(that.games, function (game) {
        return game.getTour() === tour;
      });

      games = _.chain(games)
        .map(function (game, n) { return n; })
        .shuffle()
        .map(function (n) { return games[n]; })
        .value();

      Array.prototype.push.apply(shuffledGames, games);
    });

    shuffledGames.forEach(function (game, n) {
      game.setSlot(that.slots[n]);
    });

    //   _.chain(games)
    //     .map(function (game, n) { return n; })
    //     .shuffle()
    //     .map(function (n) { return games[n]; })
    //     .each(function (game, n) {
    //       game.setTableNumber(n % config.tablesCount + 1);
    //     })
    //     .value()
    // });
    // _.chain(that.games)
    //   .map(function (game, n) { return n; })
    //   .shuffle()
    //   .map(function (n) { return that.games[n]; })
    //   .each(function (game, n) {
    //     console.log(game.getNumber());
    //     game.setTableNumber(n % config.tablesCount + 1);
    //   })
  };

  var main = function () {
    logger.enable(config.enableAppLogs);
    logger.enableStackTrace(config.enableStackTrace);
    logger.setLevelsCategories(config.applicationLevelsCategories);

    buildCache();
    buildTemplates();
    createPlayers();

    // Process qualification games
    var tours = _.range(1, config.count + 1);
    process(tours, that.players);

    // Do we need extra tour?
    processExtraTours();

    createSlots();
    assignSlots();

    renderPlayers();
    renderGames();

    console.log('-----------------------------');
    var players = _.sortBy(that.players, function (player) { return player.games.length; });
    console.log('players', _.map(players, function (p) {return p.name;}));
    console.log('players games count', _.map(players, function (p) {return p.games.length;}));
  };

  that.main = main;

  return that;
});
