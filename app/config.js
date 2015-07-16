'use strict'

define('config', function (require) {
  var $ = require('jquery');

    return {
      version: '0.1.0',
      count: 4,
      gameLength: 15 * 60,
      tablesCount: 2,
      players: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
      playersTemplate: $('#players-template').html(),
      gamesTemplate: $('#games-template').html()
    }
});
