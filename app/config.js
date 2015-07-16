'use strict'

define('config', function (require) {
  var $ = require('jquery');

    // 7—8 5
    // 9—16  6
    // 17—32 7
    // 33—64 8
    // 65—128  9
    // 129—256 10

    return {
      version: '0.1.0',
      count: 6,
      gameLength: 15 * 60,
      tablesCount: 2,
      players: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
      playersTemplate: $('#players-template').html(),
      gamesTemplate: $('#games-template').html(),
      enableAppLogs: true,
      enableStackTrace: false,
      applicationLevelsCategories: {
        // all: true,
        // none: false,
        // call: "debug",
        // portal: "warning",
        // configuration: "debug",
        // login: "debug",
        application: 'info',
        // soap: "warning",
        // ui: "info",
        // callback: "info",
        // cache: "none"
      }
    }
});
